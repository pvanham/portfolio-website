"use client";

/**
 * Live composer on the homepage. Replaces what used to be a hardcoded mock
 * conversation, so the assistant can be tried without clicking into it first.
 */

import { ArrowUp } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useChatUI } from "@/components/chat/ChatProvider";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";

export function HomeChatPrompt() {
  const { askChat, prefetch } = useChatUI();
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setValue("");
    askChat(trimmed);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="border-input bg-background/60 focus-within:border-primary flex items-center gap-2 rounded-full border px-2 py-1.5 transition-colors">
          <label htmlFor="home-chat-input" className="sr-only">
            Ask a question about Parker
          </label>
          <input
            id="home-chat-input"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={prefetch}
            maxLength={2000}
            autoComplete="off"
            enterKeyHint="send"
            placeholder="Ask about Parker..."
            className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent px-3 py-2 text-base focus:outline-none"
          />
          <button
            type="submit"
            disabled={value.trim().length === 0}
            aria-label="Ask the assistant"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </form>

      <SuggestedPrompts onSelect={askChat} />
    </div>
  );
}
