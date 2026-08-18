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
import { resolveSource, type RetrieveOutput } from "@/lib/chat-sources";
import { getIndex } from "@/lib/vector";

export const maxDuration = 30;

const GENERIC_ERROR = "An unexpected error occurred. Please try again.";

/** Stable machine-readable codes so the client can pick its own copy. */
type ErrorCode =
  | "not_configured"
  | "forbidden"
  | "rate_limited"
  | "invalid_request"
  | "server_error";

function errorResponse(
  status: number,
  code: ErrorCode,
  error: string,
  extra?: Record<string, unknown>,
  headers?: HeadersInit,
) {
  return Response.json({ error, code, ...extra }, { status, headers });
}

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
      return errorResponse(
        500,
        "not_configured",
        "The chat service is not configured correctly.",
      );
    }

    const verification = await checkBotId();
    if (verification.isBot) {
      return errorResponse(403, "forbidden", "Access denied.");
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const [ipLimit, globalLimit] = await Promise.all([
      getIpRatelimit().limit(ip),
      getGlobalRatelimit().limit("global"),
    ]);

    if (!ipLimit.success || !globalLimit.success) {
      // `reset` is a Unix ms timestamp; surface the wait so the UI can say how
      // long rather than an open-ended "try again later".
      const reset = Math.max(
        ipLimit.success ? 0 : ipLimit.reset,
        globalLimit.success ? 0 : globalLimit.reset,
      );
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000),
      );

      return errorResponse(
        429,
        "rate_limited",
        "Too many requests. Please wait a moment and try again.",
        { retryAfterSeconds },
        { "Retry-After": String(retryAfterSeconds) },
      );
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(400, "invalid_request", "Invalid request body.");
    }

    const validated = await safeValidateUIMessages({
      messages: parsed.data.messages,
    });

    if (!validated.success) {
      return errorResponse(400, "invalid_request", "Invalid request body.");
    }

    const uiMessages = sanitizeMessages(validated.data);
    if (uiMessages.length === 0) {
      return errorResponse(400, "invalid_request", "Invalid request body.");
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
          execute: async ({ query }): Promise<RetrieveOutput> => {
            const results = await getIndex().query({
              data: query,
              topK: 8,
              includeMetadata: true,
              fusionAlgorithm: FusionAlgorithm.DBSF,
            });

            const topScore = results[0]?.score ?? 0;
            const minScore = topScore * RELATIVE_SCORE_FLOOR;
            const seenText = new Set<string>();
            const sourceStems = new Set<string>();

            const passages = results
              .filter((r) => (r.score ?? 0) >= minScore)
              .filter(
                (
                  r,
                ): r is typeof r & {
                  metadata: { text: string; source: string };
                } => {
                  const metadata = r.metadata as
                    | Record<string, unknown>
                    | undefined;
                  return (
                    typeof metadata?.text === "string" &&
                    typeof metadata.source === "string"
                  );
                },
              )
              .filter((r) => {
                if (seenText.has(r.metadata.text)) return false;
                seenText.add(r.metadata.text);
                return true;
              })
              .map((r) => {
                sourceStems.add(r.metadata.source);
                return `[Source: ${r.metadata.source}]\n${r.metadata.text}`;
              });

            return {
              context:
                passages.join("\n\n---\n\n") ||
                "No relevant information found.",
              sources: [...sourceStems].map(resolveSource),
            };
          },
          // Keep the model's view identical to the previous string return; the
          // structured output exists only so the client can render citations.
          toModelOutput: ({ output }) => ({
            type: "text",
            value: output.context,
          }),
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
    return errorResponse(500, "server_error", GENERIC_ERROR);
  }
}
