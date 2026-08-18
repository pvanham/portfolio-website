"use client";

/**
 * UI-only chat state, shared by every entry point.
 *
 * Deliberately imports nothing from the AI SDK: this provider lives in the root
 * layout, so anything it pulls in lands in the initial bundle. The conversation
 * itself lives in ChatSession, inside the lazily loaded chunk.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const CHAT_PANEL_ID = "chat-panel";

export interface PendingQuestion {
  /** Distinguishes repeat asks of the same text so each one still sends. */
  id: number;
  text: string;
}

interface ChatContextValue {
  isOpen: boolean;
  /** Stays true after the first open so the loaded chunk can remain mounted. */
  hasOpened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  askChat: (text: string) => void;
  pendingQuestion: PendingQuestion | null;
  consumePending: () => void;
  /** Warms the panel chunk on hover/focus so the first open is instant. */
  prefetch: () => void;
  registerPrefetch: (loader: () => void) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [pendingQuestion, setPendingQuestion] =
    useState<PendingQuestion | null>(null);

  const triggerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const nextIdRef = useRef(0);
  const prefetchRef = useRef<(() => void) | null>(null);

  const open = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
      return;
    }
    open();
  }, [close, isOpen, open]);

  const askChat = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      nextIdRef.current += 1;
      setPendingQuestion({ id: nextIdRef.current, text: trimmed });
      open();
    },
    [open],
  );

  const consumePending = useCallback(() => setPendingQuestion(null), []);

  const registerPrefetch = useCallback((loader: () => void) => {
    prefetchRef.current = loader;
  }, []);

  const prefetch = useCallback(() => prefetchRef.current?.(), []);

  // Return focus to whatever opened the panel. Deferred a frame because
  // triggers such as the floating launcher re-appear only after the close
  // render commits.
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      const trigger = triggerRef.current;
      requestAnimationFrame(() => trigger?.focus());
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const value = useMemo<ChatContextValue>(
    () => ({
      isOpen,
      hasOpened,
      open,
      close,
      toggle,
      askChat,
      pendingQuestion,
      consumePending,
      prefetch,
      registerPrefetch,
    }),
    [
      askChat,
      close,
      consumePending,
      hasOpened,
      isOpen,
      open,
      pendingQuestion,
      prefetch,
      registerPrefetch,
      toggle,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatUI() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatUI must be used within a ChatProvider");
  }
  return context;
}
