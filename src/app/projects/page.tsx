/** /projects — full project grid with modal detail views. */

import { H1 } from "@/components/ui/H1";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projectsPageList } from "@/data/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the project portfolio of Parker Van Ham, including work on the Z³ Wellness Sleep App, the El Parque Redevelopment Project, and more.",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <header className="mb-12 text-center md:mb-16">
        <H1>My Projects</H1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-lg sm:mt-4 sm:text-xl">
          Here are some of the key projects I&apos;ve worked on, showcasing my
          skills in full-stack development, user research, data analysis, and
          collaborative problem-solving.
        </p>
      </header>

      <ProjectGrid projects={projectsPageList} />
    </main>
  );
}
