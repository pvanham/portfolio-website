/** POST /api/chat — streaming AI chat endpoint with Upstash rate limiting and RAG tool-call retrieval. */

import { NextRequest } from "next/server";
import {
  streamText,
  tool,
  convertToModelMessages,
  stepCountIs,
  smoothStream,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { getIndex } from "@/lib/vector";

let _ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit {
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "chat",
    });
  }
  return _ratelimit;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for Parker Van Ham's personal portfolio website. Your ONLY job is to answer questions about Parker — his experience, projects, skills, education, and background.

Rules:
- ALWAYS use the retrieve tool to search Parker's knowledge base before answering a question.
- When a question asks about multiple projects or topics, make SEPARATE retrieve calls for each one to ensure complete coverage. For example, if asked about "Sous and Tabixell", retrieve for each project individually.
- Each retrieved chunk is labeled with a [Source: ...] tag. These tags are internal metadata for YOUR use only — use them to attribute information to the correct project, but NEVER include [Source: ...] tags or any internal metadata in your response to the user.
- ONLY answer questions that are relevant to Parker Van Ham, his work, his skills, or this portfolio website. If a question is off-topic or unrelated to Parker, politely decline and suggest the user ask something about Parker instead. Do NOT answer off-topic questions using your own knowledge.
- ONLY use information from the retrieved context to answer. Never supplement with your own knowledge, even if you know the answer. If the context doesn't contain the answer, say you don't have that information about Parker.
- Be friendly, concise, and professional. Keep responses to 3-5 sentences max.
- You may use markdown formatting (bold, lists, links) when it helps readability.`;

const requestSchema = z.object({
  messages: z.array(z.object({}).passthrough()).min(1),
});

const MAX_HISTORY_MESSAGES = 20;

const REQUIRED_ENV_VARS = [
  "OPENAI_API_KEY",
  "UPSTASH_VECTOR_REST_URL",
  "UPSTASH_VECTOR_REST_TOKEN",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
] as const;

export async function POST(req: NextRequest) {
  try {
    const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
    if (missing.length > 0) {
      console.error("Missing required env vars:", missing.join(", "));
      return Response.json(
        { error: "The chat service is not configured correctly." },
        { status: 500 },
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const { success } = await getRatelimit().limit(ip);

    if (!success) {
      return Response.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const uiMessages = (parsed.data.messages as unknown as UIMessage[]).slice(
      -MAX_HISTORY_MESSAGES,
    );
    const modelMessages = await convertToModelMessages(uiMessages);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools: {
        retrieve: tool({
          description:
            "Search Parker Van Ham's portfolio knowledge base for relevant information. Use this before answering any question about Parker.",
          inputSchema: z.object({
            query: z
              .string()
              .describe("The search query to find relevant information"),
          }),
          execute: async ({ query }) => {
            const results = await getIndex().query({
              data: query,
              topK: 8,
              includeMetadata: true,
            });

            const context = results
              .filter(
                (r): r is typeof r & {
                  metadata: { text: string; source: string };
                } =>
                  !!r.metadata &&
                  typeof (r.metadata as Record<string, unknown>).text ===
                    "string",
              )
              .map(
                (r) =>
                  `[Source: ${r.metadata.source}]\n${r.metadata.text}`,
              )
              .join("\n\n---\n\n");

            return context || "No relevant information found.";
          },
        }),
      },
      stopWhen: stepCountIs(3),
      experimental_transform: smoothStream(),
    });

    return result.toUIMessageStreamResponse();
  } catch (e: unknown) {
    console.error("Error in chat API:", e);
    const message =
      e instanceof Error
        ? e.message
        : "An unexpected error occurred. Please try again.";
    return Response.json({ error: message }, { status: 500 });
  }
}
