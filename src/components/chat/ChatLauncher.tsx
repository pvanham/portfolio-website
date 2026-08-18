"use client";

/**
 * Persistent launcher so the assistant is discoverable on every page, not just
 * from an unlabeled glyph in the navbar.
 */

import { Bot } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CHAT_PANEL_ID, useChatUI } from "@/components/chat/ChatProvider";

export function ChatLauncher() {
  const { isOpen, open, prefetch } = useChatUI();
  const reduceMotion = useReducedMotion();

  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          key="chat-launcher"
          type="button"
          onClick={open}
          onPointerEnter={prefetch}
          onFocus={prefetch}
          // Matches the visible text so voice control users can say what they see.
          aria-label="Ask about Parker"
          aria-expanded={false}
          aria-controls={CHAT_PANEL_ID}
          initial={hidden}
          animate={{ opacity: 1, scale: 1 }}
          exit={hidden}
          transition={{ duration: 0.18 }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring fixed right-4 bottom-4 z-[var(--z-chat-launcher)] inline-flex h-14 min-w-14 items-center justify-center gap-2 rounded-full px-4 shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Bot className="h-6 w-6 shrink-0" />
          <span className="hidden text-sm font-semibold sm:inline">
            Ask about Parker
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
