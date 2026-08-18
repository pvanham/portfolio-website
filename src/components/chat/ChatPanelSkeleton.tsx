"use client";

/**
 * Placeholder shown while the chat chunk downloads, so opening the panel gives
 * immediate feedback instead of a dead click. Geometry mirrors ChatPanel.
 */

import { Bot } from "lucide-react";

export function ChatPanelSkeleton() {
  return (
    <div
      className="bg-background border-border fixed inset-0 z-[var(--z-chat-panel)] flex flex-col sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[27.5rem] sm:border-l sm:shadow-2xl"
      aria-hidden="true"
    >
      <div className="border-border flex items-center gap-3 border-b p-4">
        <Bot className="text-primary h-5 w-5" />
        <span className="text-foreground font-semibold">
          Portfolio Assistant
        </span>
      </div>
      <div className="flex-1 space-y-4 p-4">
        <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
        <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
        <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
      </div>
      <div className="border-border border-t p-4">
        <div className="bg-muted h-11 w-full animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}
