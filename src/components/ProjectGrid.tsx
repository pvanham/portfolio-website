/** Responsive grid of project cards linking to detail pages. */

import { ProjectCard } from "@/components/ProjectCard";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { ProjectData } from "@/data/projects";

interface ProjectGridProps {
  projects: ProjectData[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {projects.map((project, i) => (
        <AnimateIn key={project.slug} delay={i * 0.1} className="h-full">
          <ProjectCard
            slug={project.slug}
            title={project.title}
            role={project.role}
            image={project.image}
            imageAlt={project.imageAlt}
            overview={project.overview}
            technologies={project.technologies}
            status={project.status}
          />
        </AnimateIn>
      ))}
    </div>
  );
}
