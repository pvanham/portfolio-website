/** Project card linking to the dedicated /projects/[slug] page. */

import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";

interface ProjectCardProps {
  slug: string;
  title: string;
  role: string;
  image: StaticImageData;
  imageAlt: string;
  overview: string;
  technologies: string[];
  status?: "in-progress";
}

export function ProjectCard({
  slug,
  title,
  role,
  image,
  imageAlt,
  overview,
  technologies,
  status,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="bg-card border-border hover:border-primary/50 focus-visible:ring-ring group flex h-full w-full flex-col rounded-xl border text-left shadow-md transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="bg-muted relative aspect-video flex-shrink-0 overflow-hidden rounded-t-xl">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder="blur"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {status === "in-progress" && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
            In Development
          </span>
        )}
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
    </Link>
  );
}
