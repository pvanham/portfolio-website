"use client";

/**
 * Keeps a scroll container pinned to the bottom only while the user has not
 * scrolled away, so streaming text never yanks the view out from under someone
 * reading earlier messages. Growth is detected with a ResizeObserver rather
 * than a React dependency list, which keeps it accurate during token streaming.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const PIN_THRESHOLD_PX = 48;

export function useAutoScroll<
  TContainer extends HTMLElement = HTMLDivElement,
  TContent extends HTMLElement = HTMLDivElement,
>() {
  const containerRef = useRef<TContainer | null>(null);
  const contentRef = useRef<TContent | null>(null);
  const pinnedRef = useRef(true);
  const [isPinned, setIsPinned] = useState(true);

  const updatePinned = useCallback((pinned: boolean) => {
    pinnedRef.current = pinned;
    setIsPinned((previous) => (previous === pinned ? previous : pinned));
  }, []);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current;
      if (!container) return;
      updatePinned(true);
      container.scrollTo({ top: container.scrollHeight, behavior });
    },
    [updatePinned],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      updatePinned(distanceFromBottom <= PIN_THRESHOLD_PX);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [updatePinned]);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) {
        container.scrollTop = container.scrollHeight;
      }
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return { containerRef, contentRef, isPinned, scrollToBottom };
}
