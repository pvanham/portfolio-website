/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ChatbotUI.tsx
"use client";

//import { useChat, Message } from "ai/react"; // Core hook from Vercel AI SDK
import { useChat, Message } from "@ai-sdk/react";
import { Bot, Send, User, Loader2, X } from "lucide-react"; // Icons
import { FormEvent, useRef, useEffect } from "react";
import { useChatState } from "@/components/ChatContext"; //Import the custom hook

// interface ChatbotUIProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

export default function ChatbotUI() {
  const { isChatOpen, toggleChat: onClose } = useChatState(); // Get state and toggle from context

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat({
    api: "/api/chat", // Your backend API endpoint created in Phase 3
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Custom submit handler to potentially clear input or add other logic
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e); // This is Vercel AI SDK's handleSubmit
    // Input is typically cleared automatically by the useChat hook
  };

  if (!isChatOpen) return null; // Don't render if not open

  return (
    // Main chat window container
    <div className="fixed right-4 bottom-4 z-[60] w-[calc(100%-2rem)] max-w-sm sm:right-8 sm:bottom-8 sm:max-w-md">
      {" "}
      {/* Adjusted max-width */}
      <div className="bg-card border-border flex h-[70vh] max-h-[500px] flex-col overflow-hidden rounded-xl border shadow-xl sm:max-h-[550px]">
        {/* Header */}
        <div className="border-border bg-muted/50 flex items-center justify-between border-b p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <Bot className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            <h3 className="text-md text-foreground font-semibold sm:text-lg">
              Portfolio Assistant
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-full p-1 focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="bg-background flex-grow space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-muted-foreground py-6 text-center text-xs sm:py-8 sm:text-sm">
              <p>
                Ask me anything about Parker&apos;s skills, projects, or
                experience!
              </p>
              <p className="mt-1 sm:mt-2">
                For example: &quot;What was Parker&apos;s role in the Z3
                Wellness app?&quot;
              </p>
            </div>
          )}
          {messages.map((m: Message) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-2.5 text-sm shadow-sm sm:max-w-[75%] sm:rounded-xl sm:p-3 sm:text-base ${
                  // Adjusted padding and font size
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            </div>
          ))}
          {/* Loading indicator specifically for when assistant is typing */}
          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground max-w-[80%] rounded-lg p-2.5 shadow-sm sm:max-w-[75%] sm:rounded-xl sm:p-3">
                  <Loader2 className="text-primary h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display Area */}
        {error && (
          <div className="border-border bg-destructive/10 text-destructive border-t p-2 text-xs sm:p-3 sm:text-sm">
            <p>
              <strong>Error:</strong>{" "}
              {error.message || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="border-border bg-muted/50 border-t p-3 sm:p-4"
        >
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about Parker..."
              className="border-input bg-background text-foreground focus:ring-primary flex-grow rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none sm:rounded-lg sm:px-4 sm:py-2.5 sm:text-base"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary rounded-md p-2 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-lg sm:p-2.5"
              disabled={isLoading || !input.trim()} // Disable if loading or input is empty/whitespace
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
