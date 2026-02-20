"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";

interface ProjectCardProps {
  title: string;
  role: string;
  image: StaticImageData;
  imageAlt: string;
  overview: string;
  technologies: string[];
  onClick: () => void;
}

export function ProjectCard({
  title,
  role,
  image,
  imageAlt,
  overview,
  technologies,
  onClick,
}: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-card border-border hover:border-primary/50 group flex h-full w-full cursor-pointer flex-col rounded-xl border text-left shadow-md transition-all hover:shadow-xl"
    >
      <div className="bg-muted flex aspect-video flex-shrink-0 items-center justify-center overflow-hidden rounded-t-xl">
        <Image
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div>
          <h3 className="text-foreground text-lg font-bold">{title}</h3>
          <span className="text-primary text-sm font-medium">{role}</span>
        </div>
        <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
          {overview}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="bg-secondary/50 text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 4 && (
            <span className="text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              +{technologies.length - 4} more
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
