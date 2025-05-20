// src/contexts/ChatContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface ChatContextType {
  isChatOpen: boolean;
  toggleChat: () => void;
}

// Create a context with a default undefined value, but the provider will always supply a value.
// The '!' asserts that the context will be provided.
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatStateProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatState() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatState must be used within a ChatStateProvider");
  }
  return context;
}
