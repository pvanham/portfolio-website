"use client";

/** Citations for an answer, linking back into the pages they came from. */

import Link from "next/link";
import { useChatUI } from "@/components/chat/ChatProvider";
import type { ChatSource } from "@/lib/chat-sources";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

const CHIP_CLASS =
  "border-border bg-secondary/40 text-muted-foreground rounded-full border px-2.5 py-1 text-xs";

export function SourceChips({ sources }: { sources: ChatSource[] }) {
  const { close } = useChatUI();
  const isMobile = useIsMobile();

  if (sources.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="text-muted-foreground text-xs font-medium">Sources</span>
      {sources.map((source) =>
        source.href ? (
          <Link
            key={source.id}
            href={source.href}
            // The mobile panel covers the page, so get out of the way once the
            // visitor chooses to go read the thing being cited.
            onClick={isMobile ? close : undefined}
            className={`${CHIP_CLASS} hover:border-primary/50 hover:text-primary focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:outline-none`}
          >
            {source.label}
          </Link>
        ) : (
          <span key={source.id} className={CHIP_CLASS}>
            {source.label}
          </span>
        ),
      )}
    </div>
  );
}
