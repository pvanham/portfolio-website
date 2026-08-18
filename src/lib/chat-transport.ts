/**
 * Chat transport with human-readable failures.
 *
 * The SDK's default behaviour on a non-OK response is `throw new Error(await
 * response.text())`, which puts the raw JSON body in front of the visitor. This
 * wrapper maps the route's status codes and error codes onto real copy first.
 */

import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";

const CHAT_API_PATH = "/api/chat";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

function formatWait(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

function readRetryAfter(body: Record<string, unknown>): number | null {
  const value = body.retryAfterSeconds;
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.ceil(value)
    : null;
}

function friendlyMessage(
  status: number,
  body: Record<string, unknown>,
): string {
  switch (status) {
    case 429: {
      const retryAfter = readRetryAfter(body);
      return retryAfter
        ? `That's a lot of questions in a short window. Try again in ${formatWait(retryAfter)}.`
        : "That's a lot of questions in a short window. Give it a minute and try again.";
    }
    case 403:
      return "That request was blocked by bot protection. Reload the page and try again.";
    case 400:
      return "That message could not be sent. Try rephrasing it and asking again.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "The assistant is having trouble right now. Please try again in a moment.";
    default:
      return FALLBACK_MESSAGE;
  }
}

async function readBody(response: Response): Promise<Record<string, unknown>> {
  try {
    const parsed: unknown = await response.json();
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

/**
 * BotID instruments the global `fetch` from instrumentation-client.ts, so the
 * global has to be read at call time. Capturing a reference at module load
 * would send unsigned requests and every chat turn would fail the bot check.
 */
const chatFetch: typeof globalThis.fetch = async (input, init) => {
  const response = await globalThis.fetch(input, init);
  if (response.ok) return response;

  throw new Error(friendlyMessage(response.status, await readBody(response)));
};

export function createChatTransport<TMessage extends UIMessage>() {
  return new DefaultChatTransport<TMessage>({
    api: CHAT_API_PATH,
    fetch: chatFetch,
  });
}
