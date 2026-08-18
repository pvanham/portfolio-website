"use client";

/**
 * Renders assistant markdown. Memoized on the text so finished messages are not
 * re-parsed on every streamed chunk of the message still in flight.
 */

import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  // Model output can contain links; never let one replace the current page.
  a: ({ children, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

export const ChatMarkdown = memo(function ChatMarkdown({
  text,
}: {
  text: string;
}) {
  return (
    <div className="prose prose-invert prose-sm prose-a:text-primary prose-a:font-medium prose-strong:text-foreground prose-code:text-primary prose-code:before:content-none prose-code:after:content-none max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
});
