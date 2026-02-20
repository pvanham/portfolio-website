// src/components/ChatbotUI.tsx
"use client";

import { useChat, UIMessage } from "@ai-sdk/react";
import { Bot, Send, Loader2, X, RotateCcw } from "lucide-react";
import { FormEvent, useRef, useEffect, useState } from "react";
import { useChatState } from "@/components/ChatContext";

const getMessageText = (m: UIMessage): string =>
  m.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

export default function ChatbotUI() {
  const { isChatOpen, toggleChat: onClose } = useChatState();

  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat_messages");
      if (saved) {
        try {
          setInitialMessages(JSON.parse(saved));
        } catch {
          localStorage.removeItem("chat_messages");
        }
      }
    }
  }, []);

  const { messages, sendMessage, status, error, regenerate } = useChat({
    messages: initialMessages,
  });

  const isLoading = status === "streaming" || status === "submitted";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput("");
    sendMessage({ text });
  };

  const clearChat = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("chat_messages");
    }
    window.location.reload();
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[60] w-[90vw] max-w-md transition-all duration-300 ease-in-out sm:w-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      <div className="bg-background border-border flex h-[80vh] max-h-[600px] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:max-h-[700px]">
        {/* Header */}
        <div className="border-border from-primary/10 to-background flex items-center justify-between border-b bg-gradient-to-r p-3 sm:p-4">
          <div className="flex items-center space-x-3">
            <Bot className="text-primary h-6 w-6" />
            <h3 className="text-foreground text-lg font-semibold">
              Portfolio Assistant
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="text-muted-foreground hover:text-primary focus-visible:ring-primary rounded-full p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Clear chat"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-primary focus-visible:ring-primary rounded-full p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className="bg-background flex-grow space-y-4 overflow-y-auto p-4 sm:p-5"
          aria-live="polite"
        >
          {messages.length === 0 && !isLoading && (
            <div className="text-muted-foreground py-8 text-center text-sm sm:py-10 sm:text-base">
              <p className="mb-2 font-medium">Ask me anything about Parker!</p>
              <p>
                For example: &quot;What was Parker&apos;s role in the Z3
                Wellness app?&quot;
              </p>
            </div>
          )}
          {messages.map((m: UIMessage, index: number) => (
            <div
              key={m.id || index}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}
            >
              {m.role !== "user" && (
                <Bot className="text-primary mt-auto mb-1 h-5 w-5 flex-shrink-0 opacity-50" />
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm transition-shadow hover:shadow-md ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <span className="block whitespace-pre-wrap">
                  {getMessageText(m)}
                </span>
              </div>
              {m.role === "user" && (
                <div className="h-5 w-5" /> // Placeholder for symmetry
              )}
              {m.role === "assistant" && (
                <button
                  onClick={() => regenerate()}
                  className="text-muted-foreground hover:text-primary mt-auto mb-1 p-1 transition-colors"
                  aria-label="Regenerate response"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          ))}
          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && (
              <div className="flex items-end justify-start space-x-2">
                <Bot className="text-primary mt-auto mb-1 h-5 w-5 flex-shrink-0 opacity-50" />
                <div className="bg-muted text-foreground rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm">
                  <Loader2 className="text-primary h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display Area */}
        {error && (
          <div className="border-border bg-destructive/10 text-destructive border-t p-3 text-sm">
            <p className="font-medium">
              <strong>Error:</strong>{" "}
              {error.message || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="border-border bg-background flex items-center space-x-2 border-t p-3 sm:p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Parker..."
            className="border-input bg-muted/50 text-foreground focus:border-primary focus:ring-primary flex-grow rounded-full border px-4 py-2.5 text-sm transition-shadow hover:shadow-sm focus:outline-none sm:text-base"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary rounded-full p-2.5 transition-shadow hover:shadow-md focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
