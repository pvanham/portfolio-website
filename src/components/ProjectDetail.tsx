/** Server-rendered project article used by /projects/[slug]. */

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import type { ProjectData } from "@/data/projects";

export function ProjectDetail({ project }: { project: ProjectData }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <Link
        href="/#projects"
        className="text-muted-foreground hover:text-primary focus-visible:ring-ring mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="bg-muted relative mb-8 aspect-video overflow-hidden rounded-2xl">
        <Image
          src={project.image}
          alt={project.imageAlt}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 48rem"
          placeholder="blur"
          priority
        />
      </div>

      <header className="mb-6 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <H1>{project.title}</H1>
          {project.status === "in-progress" && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
              In Development
            </span>
          )}
        </div>
        <p className="text-primary text-sm font-semibold">{project.role}</p>
      </header>

      <p className="text-muted-foreground mb-8 text-lg">{project.overview}</p>

      <section className="mb-8">
        <H2 className="mb-3">Key Contributions</H2>
        <ul className="text-foreground list-inside list-disc space-y-1.5 text-sm">
          {project.contributions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <H2 className="mb-3">Technologies</H2>
        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="bg-secondary/50 text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      {project.link && (
        <a
          href={project.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary focus-visible:ring-ring inline-flex items-center gap-2 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <ExternalLink className="h-4 w-4" />
          {project.link.label}
        </a>
      )}
    </article>
  );
}
