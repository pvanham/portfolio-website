"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink } from "lucide-react";
import type { StaticImageData } from "next/image";

export interface ProjectData {
  slug: string;
  title: string;
  role: string;
  image: StaticImageData;
  imageAlt: string;
  overview: string;
  contributions: string[];
  technologies: string[];
  link?: { label: string; href: string };
}

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  // Escape key handler
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  // Click on backdrop to close
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          ref={overlayRef}
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-background relative flex max-h-[85dvh] w-[90vw] max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl"
          >
            <button
              onClick={onClose}
              className="bg-background/80 text-foreground hover:bg-background absolute top-3 right-3 z-10 rounded-full p-2 shadow-md backdrop-blur-sm transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="bg-muted relative aspect-video flex-shrink-0 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  className="h-full w-full object-cover"
                  fill
                  sizes="(max-width: 768px) 90vw, 48rem"
                />
              </div>

              <div className="space-y-5 p-6 md:p-8">
              <div>
                <h2 className="text-foreground text-2xl font-bold">
                  {project.title}
                </h2>
                <span className="text-primary text-sm font-semibold">
                  {project.role}
                </span>
              </div>

              <p className="text-muted-foreground">{project.overview}</p>

              <div>
                <h3 className="text-foreground mb-2 font-semibold">
                  Key Contributions
                </h3>
                <ul className="text-foreground list-inside list-disc space-y-1.5 text-sm">
                  {project.contributions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-foreground mb-2 font-semibold">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-secondary/50 text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.link && (
                <a
                  href={project.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-2 font-medium hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {project.link.label}
                </a>
              )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
