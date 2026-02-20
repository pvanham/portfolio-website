"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { ProjectData } from "@/components/ProjectModal";

interface ProjectGridProps {
  projects: ProjectData[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selected, setSelected] = useState<ProjectData | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <AnimateIn key={project.slug} delay={i * 0.1} className="h-full">
            <ProjectCard
              title={project.title}
              role={project.role}
              image={project.image}
              imageAlt={project.imageAlt}
              overview={project.overview}
              technologies={project.technologies}
              onClick={() => setSelected(project)}
            />
          </AnimateIn>
        ))}
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
