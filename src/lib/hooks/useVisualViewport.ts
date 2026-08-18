"use client";

/**
 * Reports the visual viewport rectangle while active.
 *
 * iOS Safari pins `position: fixed` to the *layout* viewport, but the on-screen
 * keyboard only shrinks the *visual* viewport and then scrolls the page, which
 * pushes fixed elements out of sight. Reading offsetTop/offsetLeft/width/height
 * lets a panel position itself inside the area the user can actually see.
 */

import { useSyncExternalStore } from "react";

export interface ViewportRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Cached so getSnapshot stays referentially stable between real changes. */
let cachedRect: ViewportRect | null = null;

function getSnapshot(): ViewportRect | null {
  const viewport = window.visualViewport;
  if (!viewport) return null;

  if (
    cachedRect === null ||
    cachedRect.top !== viewport.offsetTop ||
    cachedRect.left !== viewport.offsetLeft ||
    cachedRect.width !== viewport.width ||
    cachedRect.height !== viewport.height
  ) {
    cachedRect = {
      top: viewport.offsetTop,
      left: viewport.offsetLeft,
      width: viewport.width,
      height: viewport.height,
    };
  }

  return cachedRect;
}

function getServerSnapshot(): ViewportRect | null {
  return null;
}

function subscribe(onStoreChange: () => void) {
  const viewport = window.visualViewport;
  if (!viewport) return () => {};

  viewport.addEventListener("resize", onStoreChange);
  viewport.addEventListener("scroll", onStoreChange);
  return () => {
    viewport.removeEventListener("resize", onStoreChange);
    viewport.removeEventListener("scroll", onStoreChange);
  };
}

export function useVisualViewport(active: boolean): ViewportRect | null {
  const rect = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return active ? rect : null;
}
