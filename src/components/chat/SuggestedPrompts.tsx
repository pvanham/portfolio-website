"use client";

/** Starter questions. Most visitors will not invent a question from a blank box. */

import { chatPrompts } from "@/data/chat-prompts";
import { cn } from "@/lib/utils";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  className?: string;
}

export function SuggestedPrompts({
  onSelect,
  className,
}: SuggestedPromptsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chatPrompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="border-border bg-secondary/40 text-foreground hover:border-primary/50 hover:text-primary focus-visible:ring-ring rounded-full border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
