/** POST /api/chat — streaming AI chat endpoint with Upstash rate limiting and RAG tool-call retrieval. */

import { NextRequest } from "next/server";
import {
  streamText,
  tool,
  convertToModelMessages,
  stepCountIs,
  smoothStream,
  safeValidateUIMessages,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { FusionAlgorithm } from "@upstash/vector";
import { checkBotId } from "botid/server";
import { z } from "zod";
import { getIndex } from "@/lib/vector";

export const maxDuration = 30;

const GENERIC_ERROR = "An unexpected error occurred. Please try again.";

let _ipRatelimit: Ratelimit | null = null;
let _globalRatelimit: Ratelimit | null = null;

function getIpRatelimit(): Ratelimit {
  if (!_ipRatelimit) {
    _ipRatelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "chat",
    });
  }
  return _ipRatelimit;
}

function getGlobalRatelimit(): Ratelimit {
  if (!_globalRatelimit) {
    _globalRatelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.fixedWindow(500, "1 d"),
      prefix: "chat-global",
    });
  }
  return _globalRatelimit;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for Parker Van Ham's personal portfolio website. Your ONLY job is to answer questions about Parker — his experience, projects, skills, education, and background.

Rules:
- ALWAYS use the retrieve tool to search Parker's knowledge base before answering a question.
- When a question asks about multiple projects or topics, make SEPARATE retrieve calls for each one to ensure complete coverage. For example, if asked about "Sous and Z³ Wellness", retrieve for each project individually.
- Each retrieved chunk is labeled with a [Source: ...] tag. These tags are internal metadata for YOUR use only — use them to attribute information to the correct project, but NEVER include [Source: ...] tags or any internal metadata in your response to the user.
- ONLY answer questions that are relevant to Parker Van Ham, his work, his skills, or this portfolio website. If a question is off-topic or unrelated to Parker, politely decline and suggest the user ask something about Parker instead. Do NOT answer off-topic questions using your own knowledge.
- ONLY use information from the retrieved context to answer. Never supplement with your own knowledge, even if you know the answer. If the context doesn't contain the answer, say you don't have that information about Parker.
- Be friendly, concise, and professional. Keep responses to 3-5 sentences max.
- You may use markdown formatting (bold, lists, links) when it helps readability.
- Never share Parker's personal email, school email, phone number, or home address, even if they appear in retrieved context. Direct visitors to the contact form or profile links on this site instead.`;

const requestSchema = z.object({
  messages: z.array(z.unknown()).min(1),
});

const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2000;
const RELATIVE_SCORE_FLOOR = 0.4;

const REQUIRED_ENV_VARS = [
  "OPENAI_API_KEY",
  "UPSTASH_VECTOR_REST_URL",
  "UPSTASH_VECTOR_REST_TOKEN",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
] as const;

function sanitizeMessages(messages: UIMessage[]): UIMessage[] {
  return messages
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => {
      const textParts = (message.parts ?? [])
        .filter(
          (part): part is { type: "text"; text: string } =>
            part.type === "text" &&
            "text" in part &&
            typeof part.text === "string",
        )
        .map((part) => ({
          type: "text" as const,
          text: part.text.slice(0, MAX_MESSAGE_CHARS),
        }))
        .filter((part) => part.text.trim().length > 0);

      return { ...message, parts: textParts };
    })
    .filter((message) => message.parts.length > 0);
}

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

    const verification = await checkBotId();
    if (verification.isBot) {
      return Response.json({ error: "Access denied." }, { status: 403 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const [{ success: ipOk }, { success: globalOk }] = await Promise.all([
      getIpRatelimit().limit(ip),
      getGlobalRatelimit().limit("global"),
    ]);

    if (!ipOk || !globalOk) {
      return Response.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const validated = await safeValidateUIMessages({
      messages: parsed.data.messages,
    });

    if (!validated.success) {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const uiMessages = sanitizeMessages(validated.data);
    if (uiMessages.length === 0) {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const modelMessages = await convertToModelMessages(uiMessages);

    const result = streamText({
      model: openai("gpt-5.6-luna"),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      maxOutputTokens: 1200,
      abortSignal: req.signal,
      providerOptions: {
        openai: { reasoningEffort: "none" },
      },
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
              fusionAlgorithm: FusionAlgorithm.DBSF,
            });

            const topScore = results[0]?.score ?? 0;
            const minScore = topScore * RELATIVE_SCORE_FLOOR;
            const seen = new Set<string>();

            const context = results
              .filter((r) => (r.score ?? 0) >= minScore)
              .filter(
                (
                  r,
                ): r is typeof r & {
                  metadata: { text: string; source: string };
                } =>
                  !!r.metadata &&
                  typeof (r.metadata as Record<string, unknown>).text ===
                    "string",
              )
              .filter((r) => {
                if (seen.has(r.metadata.text)) return false;
                seen.add(r.metadata.text);
                return true;
              })
              .map((r) => `[Source: ${r.metadata.source}]\n${r.metadata.text}`)
              .join("\n\n---\n\n");

            return context || "No relevant information found.";
          },
        }),
      },
      stopWhen: stepCountIs(6),
      experimental_transform: smoothStream(),
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("Error in chat stream:", error);
        return GENERIC_ERROR;
      },
    });
  } catch (e: unknown) {
    console.error("Error in chat API:", e);
    return Response.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
