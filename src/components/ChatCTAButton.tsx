"use client";

import { Bot } from "lucide-react";
import { useChatState } from "@/components/ChatContext";

export function ChatCTAButton() {
  const { toggleChat } = useChatState();

  return (
    <button
      onClick={toggleChat}
      className="focus-visible:ring-ring mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-primary/90 hover:to-cyan-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:to-teal-400 dark:hover:to-teal-500"
    >
      <Bot className="h-4 w-4" />
      Try It Yourself
    </button>
  );
}
