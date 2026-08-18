"use client";

/** Inline failure notice placed where the answer would have been. */

import { RefreshCw } from "lucide-react";

interface ChatErrorProps {
  message: string;
  onRetry: () => void;
}

export function ChatError({ message, onRetry }: ChatErrorProps) {
  return (
    <div
      role="alert"
      className="border-destructive/50 bg-destructive/10 rounded-xl border p-3"
    >
      <p className="text-foreground text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="text-primary hover:text-primary/80 focus-visible:ring-ring mt-2 inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
