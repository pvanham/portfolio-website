"use client";

/** Loads the chatbot module only after the visitor opens the panel. */

import { useEffect, useState, type ComponentType } from "react";
import { useChatState } from "@/components/ChatContext";

export default function ChatbotLazy() {
  const { isChatOpen } = useChatState();
  const [ChatUI, setChatUI] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (!isChatOpen) return;
    void import("@/components/ChatbotUI").then((mod) => {
      setChatUI(() => mod.default);
    });
  }, [isChatOpen]);

  if (!ChatUI) return null;
  return <ChatUI />;
}
