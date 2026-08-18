/**
 * localStorage persistence for the chat transcript.
 *
 * Read synchronously when constructing the `Chat` instance so restored history
 * is present on the first paint instead of popping in after an effect.
 */

import { isToolUIPart, type UIMessage } from "ai";
import { isRetrieveOutput } from "@/lib/chat-sources";

const STORAGE_KEY = "chat_messages_v3";
const LEGACY_STORAGE_KEYS = ["chat_messages", "chat_messages_v2"];
const MAX_HISTORY_MESSAGES = 20;
const SESSION_TTL_MS = 30 * 60 * 1000;

interface StoredSession {
  savedAt: number;
  messages: UIMessage[];
}

function isMessageArray(value: unknown): value is UIMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (message) =>
        typeof message === "object" &&
        message !== null &&
        "role" in message &&
        "parts" in message &&
        Array.isArray(message.parts),
    )
  );
}

function isStoredSession(value: unknown): value is StoredSession {
  return (
    typeof value === "object" &&
    value !== null &&
    "savedAt" in value &&
    typeof value.savedAt === "number" &&
    "messages" in value &&
    isMessageArray(value.messages)
  );
}

/**
 * Retrieved passages can run to tens of kilobytes per turn and are only needed
 * by the model, so drop the context but keep the citations that the UI renders.
 */
function compactMessage(message: UIMessage): UIMessage {
  return {
    ...message,
    parts: message.parts.map((part) => {
      if (
        isToolUIPart(part) &&
        part.state === "output-available" &&
        isRetrieveOutput(part.output)
      ) {
        return {
          ...part,
          output: { context: "", sources: part.output.sources },
        };
      }
      return part;
    }),
  };
}

export function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];

  for (const key of LEGACY_STORAGE_KEYS) {
    window.localStorage.removeItem(key);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!isStoredSession(parsed)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    if (Date.now() - parsed.savedAt > SESSION_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return parsed.messages.slice(-MAX_HISTORY_MESSAGES);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function saveMessages(messages: UIMessage[]): void {
  if (typeof window === "undefined") return;

  if (messages.length === 0) {
    clearMessages();
    return;
  }

  const session: StoredSession = {
    savedAt: Date.now(),
    messages: messages.slice(-MAX_HISTORY_MESSAGES).map(compactMessage),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Quota or private-mode failures are non-fatal; chat still works in memory.
  }
}

export function clearMessages(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  for (const key of LEGACY_STORAGE_KEYS) {
    window.localStorage.removeItem(key);
  }
}
