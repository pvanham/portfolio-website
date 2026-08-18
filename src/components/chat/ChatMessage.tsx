"use client";

/**
 * A single turn. User messages keep a tinted bubble; assistant answers render as
 * full-width prose so markdown lists, tables and code have room to breathe.
 */

import { isTextUIPart, type UIMessage } from "ai";
import { Check, Copy, RefreshCw } from "lucide-react";
import { memo, useState } from "react";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { RetrievalSteps } from "@/components/chat/RetrievalSteps";
import { SourceChips } from "@/components/chat/SourceChips";
import { IconButton } from "@/components/ui/IconButton";
import { isRetrieveOutput, type ChatSource } from "@/lib/chat-sources";
import { getRetrievalParts } from "@/lib/chat-tool-parts";
import { cn } from "@/lib/utils";

const ACTION_CLASS = "h-9 w-9";

interface ChatMessageProps {
  message: UIMessage;
  isLast: boolean;
  canRegenerate: boolean;
  onRegenerate: () => void;
}

function collectSources(message: UIMessage): ChatSource[] {
  const sources: ChatSource[] = [];
  const seen = new Set<string>();

  for (const part of getRetrievalParts(message.parts)) {
    if (part.state !== "output-available" || !isRetrieveOutput(part.output)) {
      continue;
    }
    for (const source of part.output.sources) {
      if (seen.has(source.id)) continue;
      seen.add(source.id);
      sources.push(source);
    }
  }

  return sources;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isLast,
  canRegenerate,
  onRegenerate,
}: ChatMessageProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const text = message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm whitespace-pre-wrap">
          {text}
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; the answer is still selectable.
    }
  };

  return (
    <div className="group">
      <RetrievalSteps parts={getRetrievalParts(message.parts)} />
      {text && <ChatMarkdown text={text} />}
      <SourceChips sources={collectSources(message)} />

      {text && (
        <div
          className={cn(
            "mt-1 flex items-center gap-1 transition-opacity",
            isLast
              ? "opacity-100"
              : "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
          )}
        >
          <IconButton
            label={hasCopied ? "Copied" : "Copy answer"}
            onClick={handleCopy}
            className={ACTION_CLASS}
          >
            {hasCopied ? (
              <Check className="text-primary h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </IconButton>
          {canRegenerate && (
            <IconButton
              label="Regenerate answer"
              onClick={onRegenerate}
              className={ACTION_CLASS}
            >
              <RefreshCw className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
});
