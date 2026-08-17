/** /projects/[slug] — statically generated project detail page. */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import { getProjectBySlug, projects } from "@/data/projects";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Project not found" };
  }

  const url = `${SITE_URL}/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.overview,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.overview,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.overview,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
