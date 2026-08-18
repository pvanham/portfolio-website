"use client";

/**
 * Surfaces the RAG retrieval the assistant performs.
 *
 * Retrieval can take a few seconds across several tool calls, so showing the
 * queries turns dead waiting time into visible progress.
 */

import { ChevronDown, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { isRetrieveOutput } from "@/lib/chat-sources";
import type { ToolPart } from "@/lib/chat-tool-parts";
import { cn } from "@/lib/utils";

function readQuery(input: unknown): string | null {
  if (
    typeof input === "object" &&
    input !== null &&
    "query" in input &&
    typeof input.query === "string" &&
    input.query.length > 0
  ) {
    return input.query;
  }
  return null;
}

export function RetrievalSteps({ parts }: { parts: ToolPart[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (parts.length === 0) return null;

  const isActive = parts.some(
    (part) =>
      part.state === "input-streaming" || part.state === "input-available",
  );
  const failed = parts.some((part) => part.state === "output-error");

  const sourceIds = new Set<string>();
  for (const part of parts) {
    if (part.state === "output-available" && isRetrieveOutput(part.output)) {
      for (const source of part.output.sources) {
        sourceIds.add(source.id);
      }
    }
  }

  const queries = parts
    .map((part) => readQuery(part.input))
    .filter((query) => query !== null);
  const showQueries = isActive || isExpanded;

  let summary: string;
  if (isActive) {
    summary = "Searching Parker's knowledge base";
  } else if (failed) {
    summary = "Search failed";
  } else if (sourceIds.size === 0) {
    summary = "No matching passages found";
  } else {
    summary = `Searched ${sourceIds.size} source${sourceIds.size === 1 ? "" : "s"}`;
  }

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        aria-expanded={showQueries}
        disabled={isActive}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-default"
      >
        {isActive ? (
          <Loader2 className="text-primary h-3.5 w-3.5 animate-spin" />
        ) : (
          <Search className="h-3.5 w-3.5" />
        )}
        <span>{summary}</span>
        {!isActive && queries.length > 0 && (
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              isExpanded && "rotate-180",
            )}
            aria-hidden="true"
          />
        )}
      </button>

      {showQueries && queries.length > 0 && (
        <ul className="border-border text-muted-foreground mt-1.5 space-y-1 border-l pl-3 text-xs">
          {queries.map((query, index) => (
            <li key={`${query}-${index}`} className="truncate">
              {query}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
