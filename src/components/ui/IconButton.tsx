/** Icon-only button primitive that enforces a 44px touch target and an accessible label. */

import { cn } from "@/lib/utils";

interface IconButtonProps
  extends Omit<
    React.ComponentPropsWithoutRef<"button">,
    "aria-label" | "title"
  > {
  /** Used for both `aria-label` and the native tooltip, since the button has no visible text. */
  label: string;
}

export function IconButton({
  label,
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "text-muted-foreground hover:text-primary hover:bg-accent focus-visible:ring-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
