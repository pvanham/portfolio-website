"use client";

/**
 * The transcript.
 *
 * `aria-live` is deliberately off here: announcing a container while tokens
 * stream in makes screen readers restart the message on every chunk. Short state
 * changes go through the dedicated status region at the bottom instead.
 */

import type { ChatStatus, UIMessage } from "ai";
import { ArrowDown, Bot } from "lucide-react";
import { useEffect, useRef } from "react";
import { ChatError } from "@/components/chat/ChatError";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { useAutoScroll } from "@/lib/hooks/useAutoScroll";

interface ChatThreadProps {
  messages: UIMessage[];
  status: ChatStatus;
  error: Error | undefined;
  onRegenerate: () => void;
  onSuggestion: (prompt: string) => void;
}

function ThinkingIndicator() {
  return (
    <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
      <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
      <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
      <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full" />
    </div>
  );
}

export function ChatThread({
  messages,
  status,
  error,
  onRegenerate,
  onSuggestion,
}: ChatThreadProps) {
  const { containerRef, contentRef, isPinned, scrollToBottom } =
    useAutoScroll();

  // Written straight to the DOM rather than through state: the live region is an
  // output-only surface, and this keeps restored history from announcing itself
  // the moment the panel opens.
  const announcerRef = useRef<HTMLParagraphElement>(null);
  const wasBusyRef = useRef(false);

  useEffect(() => {
    const announcer = announcerRef.current;
    if (!announcer) return;

    if (status === "submitted") {
      wasBusyRef.current = true;
      announcer.textContent = "Searching Parker's knowledge base";
    } else if (status === "streaming") {
      wasBusyRef.current = true;
      announcer.textContent = "Assistant is responding";
    } else if (status === "error") {
      announcer.textContent = "The assistant ran into an error";
    } else {
      announcer.textContent = wasBusyRef.current ? "Response ready" : "";
    }
  }, [status]);

  const lastMessage = messages.at(-1);
  const isWaiting = status === "submitted" && lastMessage?.role === "user";
  const lastAssistantId = messages.findLast(
    (message) => message.role === "assistant",
  )?.id;
  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
      >
        <div ref={contentRef} className="space-y-5">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <Bot className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-foreground text-sm">
                  Hi! I&apos;m Parker&apos;s portfolio assistant. Ask me about
                  his projects, skills, or experience.
                </p>
              </div>
              <SuggestedPrompts onSelect={onSuggestion} />
            </div>
          ) : (
            <div
              role="log"
              aria-label="Conversation"
              aria-live="off"
              className="space-y-5"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLast={message.id === lastMessage?.id}
                  canRegenerate={
                    !isBusy && message.id === lastAssistantId && !error
                  }
                  onRegenerate={onRegenerate}
                />
              ))}
            </div>
          )}

          {isWaiting && <ThinkingIndicator />}

          {error && (
            <ChatError message={error.message} onRetry={onRegenerate} />
          )}
        </div>
      </div>

      {!isPinned && messages.length > 0 && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="border-border bg-background text-foreground hover:border-primary/50 hover:text-primary focus-visible:ring-ring absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs shadow-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowDown className="h-3.5 w-3.5" />
          Jump to latest
        </button>
      )}

      <p
        ref={announcerRef}
        role="status"
        aria-live="polite"
        className="sr-only"
      />
    </div>
  );
}
