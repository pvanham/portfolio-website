"use client";

import { TypeAnimation } from "react-type-animation";
import { cn } from "@/lib/utils";

interface TypewriterRolesProps {
  className?: string;
}

export function TypewriterRoles({ className }: TypewriterRolesProps) {
  return (
    <TypeAnimation
      sequence={[
        "Full-Stack Developer",
        2000,
        "AI Engineer",
        2000,
        "Problem Solver",
        2000,
      ]}
      wrapper="span"
      speed={40}
      repeat={Infinity}
      className={cn(
        "text-primary font-mono text-xl md:text-2xl",
        className
      )}
    />
  );
}
