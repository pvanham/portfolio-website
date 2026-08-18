/** Narrowing helpers for the retrieval tool parts carried on a chat message. */

import {
  getToolName,
  isToolUIPart,
  type DynamicToolUIPart,
  type ToolUIPart,
  type UIMessage,
  type UITools,
} from "ai";

export type ToolPart = ToolUIPart<UITools> | DynamicToolUIPart;

const RETRIEVE_TOOL_NAME = "retrieve";

export function getRetrievalParts(parts: UIMessage["parts"]): ToolPart[] {
  return parts.filter(
    (part): part is ToolPart =>
      isToolUIPart(part) && getToolName(part) === RETRIEVE_TOOL_NAME,
  );
}
