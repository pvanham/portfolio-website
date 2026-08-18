/**
 * Maps Upstash Vector `source` metadata onto citation chips.
 *
 * The ingest script derives `source` from the content filename, so
 * `project-<slug>.txt` lines up with `slug` in the canonical project list and
 * can link straight into the project detail route.
 */

import { projects } from "@/data/projects";

export interface ChatSource {
  id: string;
  label: string;
  href?: string;
}

export interface RetrieveOutput {
  context: string;
  sources: ChatSource[];
}

const PROJECT_SOURCE_PREFIX = "project-";

const STATIC_SOURCES: Record<string, { label: string; href?: string }> = {
  about_parker: { label: "About Parker", href: "/" },
  Resume: { label: "Résumé" },
  home: { label: "Home", href: "/" },
  skills: { label: "Skills", href: "/#skills" },
  contact: { label: "Contact", href: "/contact" },
};

/** Project titles carry a subtitle after an em dash that is too long for a chip. */
function shortTitle(title: string): string {
  return title.split("—")[0].trim();
}

export function resolveSource(stem: string): ChatSource {
  if (stem.startsWith(PROJECT_SOURCE_PREFIX)) {
    const slug = stem.slice(PROJECT_SOURCE_PREFIX.length);
    const project = projects.find((candidate) => candidate.slug === slug);
    if (project) {
      return {
        id: stem,
        label: shortTitle(project.title),
        href: `/projects/${slug}`,
      };
    }
  }

  const staticSource = STATIC_SOURCES[stem];
  if (staticSource) {
    return { id: stem, ...staticSource };
  }

  return { id: stem, label: stem.replace(/[-_]/g, " ") };
}

function isChatSource(value: unknown): value is ChatSource {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "label" in value &&
    typeof value.label === "string"
  );
}

/** Narrows an untyped tool part payload coming back through the message stream. */
export function isRetrieveOutput(value: unknown): value is RetrieveOutput {
  return (
    typeof value === "object" &&
    value !== null &&
    "context" in value &&
    typeof value.context === "string" &&
    "sources" in value &&
    Array.isArray(value.sources) &&
    value.sources.every(isChatSource)
  );
}
