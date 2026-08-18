"use client";

/**
 * Defers the chat chunk (AI SDK, markdown renderer) until it is needed, then
 * keeps it mounted so the conversation survives closing and reopening.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { ChatPanelSkeleton } from "@/components/chat/ChatPanelSkeleton";
import { useChatUI } from "@/components/chat/ChatProvider";

export default function ChatLoader() {
  const { isOpen, hasOpened, registerPrefetch } = useChatUI();
  const [Session, setSession] = useState<ComponentType | null>(null);
  const requestedRef = useRef(false);

  const load = useCallback(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    void import("@/components/chat/ChatSession").then((module) => {
      setSession(() => module.default);
    });
  }, []);

  useEffect(() => registerPrefetch(load), [load, registerPrefetch]);

  useEffect(() => {
    if (hasOpened) load();
  }, [hasOpened, load]);

  useEffect(() => {
    if (typeof window.requestIdleCallback !== "function") return;
    const handle = window.requestIdleCallback(() => load());
    return () => window.cancelIdleCallback(handle);
  }, [load]);

  if (!Session) {
    return isOpen ? <ChatPanelSkeleton /> : null;
  }

  return <Session />;
}
