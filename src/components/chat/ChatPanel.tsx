"use client";

/**
 * The panel shell.
 *
 * Two modalities: on mobile a true modal sheet (scrim, focus trap, scroll lock,
 * drag to dismiss); on desktop a non-modal panel docked to the right edge, where
 * the page stays scrollable and clicking it does not dismiss the chat.
 */

import type { ChatStatus, UIMessage } from "ai";
import { Bot, Trash2, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { CHAT_PANEL_ID, useChatUI } from "@/components/chat/ChatProvider";
import { ChatThread } from "@/components/chat/ChatThread";
import { IconButton } from "@/components/ui/IconButton";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useVisualViewport } from "@/lib/hooks/useVisualViewport";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

const DISMISS_DISTANCE_PX = 120;
const DISMISS_VELOCITY = 600;

export interface ChatPanelProps {
  messages: UIMessage[];
  status: ChatStatus;
  error: Error | undefined;
  onSend: (text: string) => void;
  onStop: () => void;
  onRegenerate: () => void;
  onClear: () => void;
  onClearError: () => void;
}

/**
 * Mounted only while the panel is open, so transient UI such as the clear
 * confirmation starts fresh on every open without reset effects.
 */
function ChatPanelSurface({
  messages,
  status,
  error,
  onSend,
  onStop,
  onRegenerate,
  onClear,
  onClearError,
}: ChatPanelProps) {
  const { close } = useChatUI();
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const dragControls = useDragControls();

  const panelRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const viewportRect = useVisualViewport(isMobile);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      // Trapping focus is only correct for the modal (mobile) presentation; on
      // desktop the rest of the page stays interactive by design.
      if (!isMobile || event.key !== "Tab" || !panelRef.current) return;

      const focusable = [
        ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      // Focusing the input on mobile would immediately raise the keyboard and
      // swallow the panel, so anchor focus on the panel itself there.
      if (isMobile) {
        panelRef.current?.focus();
      } else {
        composerRef.current?.focus();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  const handleConfirmClear = useCallback(() => {
    setIsConfirmingClear(false);
    onClear();
    composerRef.current?.focus();
  }, [onClear]);

  const hidden = reduceMotion
    ? { opacity: 0 }
    : isMobile
      ? { opacity: 0, y: "100%" }
      : { opacity: 0, x: "100%" };
  const visible = reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 };

  return (
    <>
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          aria-hidden="true"
          className="fixed inset-0 z-[var(--z-chat-scrim)] bg-black/60"
        />
      )}

      <motion.div
        ref={panelRef}
        id={CHAT_PANEL_ID}
        role="dialog"
        aria-modal={isMobile ? true : undefined}
        aria-labelledby="chat-panel-title"
        tabIndex={-1}
        initial={hidden}
        animate={visible}
        exit={hidden}
        transition={{ duration: reduceMotion ? 0.12 : 0.24, ease: "easeOut" }}
        drag={isMobile ? "y" : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (
            info.offset.y > DISMISS_DISTANCE_PX ||
            info.velocity.y > DISMISS_VELOCITY
          ) {
            close();
          }
        }}
        style={
          viewportRect
            ? {
                top: viewportRect.top,
                left: viewportRect.left,
                width: viewportRect.width,
                height: viewportRect.height,
                right: "auto",
                bottom: "auto",
              }
            : undefined
        }
        className="bg-background border-border fixed inset-0 z-[var(--z-chat-panel)] flex flex-col outline-none sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[27.5rem] sm:border-l sm:shadow-2xl"
      >
        {isMobile && (
          <div
            onPointerDown={(event) => dragControls.start(event)}
            className="flex touch-none justify-center pt-2.5 pb-1"
            aria-hidden="true"
          >
            <span className="bg-border h-1.5 w-12 rounded-full" />
          </div>
        )}

        <div className="border-border flex items-center justify-between gap-2 border-b px-3 py-2">
          <div className="flex min-w-0 items-center gap-2.5 pl-1">
            <Bot className="text-primary h-5 w-5 shrink-0" />
            <h2
              id="chat-panel-title"
              className="text-foreground truncate font-semibold"
            >
              Portfolio Assistant
            </h2>
          </div>
          <div className="flex items-center">
            {messages.length > 0 && (
              <IconButton
                label="Clear conversation"
                onClick={() => setIsConfirmingClear(true)}
              >
                <Trash2 className="h-[18px] w-[18px]" />
              </IconButton>
            )}
            <IconButton label="Close chat" onClick={close}>
              <X className="h-[18px] w-[18px]" />
            </IconButton>
          </div>
        </div>

        {isConfirmingClear && (
          <div className="border-border bg-muted/40 flex items-center justify-between gap-3 border-b px-4 py-2">
            <p className="text-foreground text-sm">Clear this conversation?</p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmingClear(false)}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md px-2 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="text-primary hover:text-primary/80 focus-visible:ring-ring rounded-md px-2 py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <ChatThread
          messages={messages}
          status={status}
          error={error}
          onRegenerate={onRegenerate}
          onSuggestion={onSend}
        />

        <ChatComposer
          status={status}
          hasError={Boolean(error)}
          onSend={onSend}
          onStop={onStop}
          onClearError={onClearError}
          textareaRef={composerRef}
        />
      </motion.div>
    </>
  );
}

export function ChatPanel(props: ChatPanelProps) {
  const { isOpen } = useChatUI();

  return (
    <AnimatePresence>
      {isOpen && <ChatPanelSurface key="chat-panel" {...props} />}
    </AnimatePresence>
  );
}
