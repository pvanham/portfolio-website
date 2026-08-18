"use client";

/**
 * Message input. Stays enabled while a response streams — disabling it would
 * strip focus from the element the visitor is typing in — and swaps send for
 * stop instead.
 */

import type { ChatStatus } from "ai";
import { ArrowUp, Square } from "lucide-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { IconButton } from "@/components/ui/IconButton";

/** Matches MAX_MESSAGE_CHARS on the server so truncation never surprises anyone. */
const MAX_CHARS = 2000;
const COUNTER_VISIBLE_AT = MAX_CHARS - 200;
const MAX_HEIGHT_PX = 160;

interface ChatComposerProps {
  status: ChatStatus;
  hasError: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  onClearError: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export function ChatComposer({
  status,
  hasError,
  onSend,
  onStop,
  onClearError,
  textareaRef,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [textareaRef, value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || isBusy) return;
    setValue("");
    onSend(trimmed);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    if (hasError) onClearError();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-background border-t p-3"
    >
      <div className="border-input bg-muted/50 focus-within:border-primary flex items-end gap-2 rounded-2xl border px-3 py-1.5 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={MAX_CHARS}
          placeholder="Ask about Parker..."
          aria-label="Ask a question about Parker"
          autoComplete="off"
          enterKeyHint="send"
          // 16px at mobile widths keeps iOS Safari from zooming on focus.
          className="text-foreground placeholder:text-muted-foreground max-h-40 flex-1 resize-none bg-transparent py-2 text-base leading-relaxed focus:outline-none sm:text-sm"
        />
        {isBusy ? (
          <IconButton
            label="Stop generating"
            onClick={onStop}
            className="text-foreground hover:bg-secondary my-0.5 h-10 w-10"
          >
            <Square className="h-4 w-4" />
          </IconButton>
        ) : (
          <IconButton
            label="Send message"
            type="submit"
            disabled={value.trim().length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground my-0.5 h-10 w-10"
          >
            <ArrowUp className="h-5 w-5" />
          </IconButton>
        )}
      </div>

      {value.length >= COUNTER_VISIBLE_AT && (
        <p className="text-muted-foreground mt-1.5 text-right text-xs">
          {value.length} / {MAX_CHARS}
        </p>
      )}
    </form>
  );
}
