/** Styled h2 heading primitive with class merging. */

import { cn } from "@/lib/utils";

export function H2(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={cn("text-2xl font-semibold tracking-tight", props.className)}
    />
  );
}
