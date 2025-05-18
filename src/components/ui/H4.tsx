import { cn } from "@/lib/utils";

export function H4(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={cn("text-lg font-medium tracking-tight", props.className)}
    />
  );
}
