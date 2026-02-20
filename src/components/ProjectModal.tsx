"use client";

import { useRef, useEffect, useCallback } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) onClose();
    },
    [onClose],
  );

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="bg-background fixed inset-0 m-auto flex max-h-[85vh] w-[90vw] max-w-3xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl backdrop:bg-black/60"
    >
      <AnimatePresence>
        {project && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative flex min-h-0 flex-1 flex-col"
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
        )}
      </AnimatePresence>
    </dialog>
  );
}
