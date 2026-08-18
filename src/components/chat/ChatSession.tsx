"use client";

/**
 * Owns the conversation.
 *
 * The `Chat` instance is constructed once and held here rather than inside
 * ChatPanel, so the panel can unmount to play its exit animation without
 * aborting an in-flight stream or dropping history.
 */

import { Chat, useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useChatUI } from "@/components/chat/ChatProvider";
import { clearMessages, loadMessages, saveMessages } from "@/lib/chat-storage";
import { createChatTransport } from "@/lib/chat-transport";

const PERSIST_DEBOUNCE_MS = 500;

export default function ChatSession() {
  const { pendingQuestion, consumePending } = useChatUI();

  // A lazy useState initializer is the guaranteed-once construction point.
  const [chat] = useState(
    () =>
      new Chat<UIMessage>({
        messages: loadMessages(),
        transport: createChatTransport<UIMessage>(),
      }),
  );

  const {
    messages,
    status,
    error,
    sendMessage,
    regenerate,
    stop,
    setMessages,
    clearError,
  } = useChat({ chat, experimental_throttle: 50 });

  // Debounced so streaming does not serialize the transcript on every chunk.
  useEffect(() => {
    const timer = setTimeout(() => saveMessages(messages), PERSIST_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [messages]);

  const handledIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (!pendingQuestion || handledIdRef.current === pendingQuestion.id) return;
    handledIdRef.current = pendingQuestion.id;
    consumePending();
    void sendMessage({ text: pendingQuestion.text });
  }, [consumePending, pendingQuestion, sendMessage]);

  const handleSend = useCallback(
    (text: string) => void sendMessage({ text }),
    [sendMessage],
  );

  const handleStop = useCallback(() => void stop(), [stop]);

  const handleRegenerate = useCallback(() => void regenerate(), [regenerate]);

  const handleClear = useCallback(() => {
    void stop();
    setMessages([]);
    clearMessages();
    clearError();
  }, [clearError, setMessages, stop]);

  return (
    <ChatPanel
      messages={messages}
      status={status}
      error={error}
      onSend={handleSend}
      onStop={handleStop}
      onRegenerate={handleRegenerate}
      onClear={handleClear}
      onClearError={clearError}
    />
  );
}
