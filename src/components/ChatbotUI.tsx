"use client";

/** Floating AI chatbot panel with streaming responses, localStorage persistence, and iOS keyboard handling. */

import { useChat, UIMessage } from "@ai-sdk/react";
import { Bot, Send, Loader2, X, RotateCcw } from "lucide-react";
import { FormEvent, useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useChatState } from "@/components/ChatContext";

const GREETING_MESSAGE: UIMessage = {
  id: "greeting",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hi! I'm Parker's portfolio assistant. Ask me anything about his projects, skills, or experience.",
    },
  ],
};

const getMessageText = (m: UIMessage): string =>
  m.parts
    ?.filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("") ?? "";

function isValidMessageArray(data: unknown): data is UIMessage[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (m) =>
        m &&
        typeof m === "object" &&
        "role" in m &&
        "parts" in m &&
        Array.isArray(m.parts),
    )
  );
}

export default function ChatbotUI() {
  const { isChatOpen, toggleChat: onClose } = useChatState();

  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([
    GREETING_MESSAGE,
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat_messages");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (isValidMessageArray(parsed)) {
            setInitialMessages(parsed);
          } else {
            localStorage.removeItem("chat_messages");
          }
        } catch {
          localStorage.removeItem("chat_messages");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isChatOpen]);

  // Track the full visual viewport rectangle so the chatbot stays pinned
  // to exactly what the user sees on iOS, even when the keyboard opens.
  // On iOS Safari, `position: fixed` + `inset-0` pins to the *layout*
  // viewport, but the keyboard only shrinks the *visual* viewport and iOS
  // scrolls the page — pushing fixed elements out of sight.  By reading
  // offsetTop/offsetLeft/width/height from visualViewport we can explicitly
  // position the chatbot within the visible area.
  interface ViewportRect {
    top: number;
    left: number;
    width: number;
    height: number;
  }
  const [viewportRect, setViewportRect] = useState<ViewportRect | null>(null);

  useEffect(() => {
    if (!isChatOpen) {
      setViewportRect(null);
      return;
    }

    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // Only apply on narrow (mobile) screens; desktop uses CSS sm: classes.
      if (window.innerWidth < 640) {
        setViewportRect({
          top: vv.offsetTop,
          left: vv.offsetLeft,
          width: vv.width,
          height: vv.height,
        });
      } else {
        setViewportRect(null);
      }
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [isChatOpen]);

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

  // Also scroll to bottom when the viewport resizes (keyboard open/close)
  // so the latest messages stay visible.
  useEffect(scrollToBottom, [viewportRect]);

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

  // On mobile, pin exactly to the visual viewport so the keyboard can't
  // push the chatbot out of view.  On desktop this is null and CSS handles
  // all sizing via the sm: breakpoint classes.
  const mobileStyle: React.CSSProperties | undefined = viewportRect
    ? {
        position: "fixed",
        top: `${viewportRect.top}px`,
        left: `${viewportRect.left}px`,
        width: `${viewportRect.width}px`,
        height: `${viewportRect.height}px`,
        transition: "top 0.2s ease, height 0.2s ease",
      }
    : undefined;

  return (
    <div
      className="fixed inset-0 z-[60] w-full sm:inset-auto sm:right-4 sm:bottom-4 sm:h-auto sm:w-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      style={mobileStyle}
    >
      <div className="bg-background flex h-full flex-col overflow-hidden sm:max-h-[700px] sm:h-[80vh] sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl">
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
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-primary [&_a:hover]:text-primary/80 [&_strong]:text-inherit [&_li]:text-foreground [&_p]:text-foreground">
                    <ReactMarkdown>{getMessageText(m)}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="block whitespace-pre-wrap">
                    {getMessageText(m)}
                  </span>
                )}
              </div>
              {m.role === "user" && (
                <div className="h-5 w-5" /> // Placeholder for symmetry
              )}
              {m.role === "assistant" && m.id !== "greeting" && (
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
