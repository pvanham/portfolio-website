/** Homepage — hero section, chatbot preview, project grid, skills overview, and contact form. */

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Bot, ArrowRight, ChevronDown } from "lucide-react";
import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { H3 } from "@/components/ui/H3";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { TypewriterRoles } from "@/components/TypewriterRoles";
import { HomeChatPrompt } from "@/components/chat/HomeChatPrompt";
import { ProjectGrid } from "@/components/ProjectGrid";
import ContactForm from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { projects } from "@/data/projects";
import { skillsData } from "@/data/skills";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import me from "@/assets/me.png";

const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"));

export const metadata: Metadata = {
  title: SITE_TITLE,
  description:
    "Welcome to Parker Van Ham's portfolio. Explore projects, skills, and get in touch.",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <section
        id="home"
        className="bg-background relative overflow-hidden px-4 sm:px-6 lg:px-8"
      >
        <HeroCanvas />
        <div className="bg-background/45 absolute inset-0" />
        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
          <div className="relative">
            <Image
              src={me}
              alt="A photo of Parker Van Ham"
              height={160}
              width={160}
              className="border-primary/40 mx-auto mb-8 aspect-square rounded-full border-4 object-cover shadow-2xl"
              placeholder="blur"
              priority
            />
            <div className="bg-primary/15 absolute -right-6 -bottom-2 -z-10 h-28 w-28 rounded-full blur-2xl" />
            <div className="bg-accent/20 absolute -top-6 -left-6 -z-10 h-24 w-24 rotate-12 rounded-lg blur-xl" />
          </div>

          <H1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Hi, I&apos;m Parker
          </H1>

          <div className="mt-4 h-8">
            <TypewriterRoles className="text-primary" />
          </div>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg md:text-xl">
            I&apos;m a software engineer with a strong foundation in full-stack
            development and a broad range of programming languages. I&apos;m
            actively expanding my knowledge in AI and its real-world
            applications, and I&apos;m eager to apply my skills to impactful
            projects.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="#projects"
              className="focus-visible:ring-ring from-primary hover:from-primary/90 inline-flex items-center justify-center rounded-lg bg-gradient-to-r to-teal-400 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:to-teal-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              View My Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <ChevronDown
            className="text-muted-foreground mt-12 h-6 w-6 animate-bounce"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Live AI assistant */}
      <div className="bg-muted/30 relative z-10 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <section
              aria-labelledby="assistant-heading"
              className="bg-card/80 border-border overflow-hidden rounded-xl border shadow-2xl backdrop-blur-sm"
            >
              <div className="border-border from-primary/10 to-background flex items-center gap-3 border-b bg-gradient-to-r px-5 py-3">
                <Bot className="text-primary h-5 w-5" />
                <span className="text-foreground text-sm font-semibold">
                  Portfolio Assistant
                </span>
              </div>

              <div className="p-5 md:p-8">
                <H2
                  id="assistant-heading"
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  Ask about my work
                </H2>
                <p className="text-muted-foreground mt-3">
                  This assistant answers from a knowledge base of my projects,
                  skills, and experience, and cites the pages it pulled from.
                  Ask it anything.
                </p>
                <div className="mt-6">
                  <HomeChatPrompt />
                </div>
              </div>
            </section>
          </AnimateIn>
        </div>
      </div>

      {/* Projects */}
      <section
        id="projects"
        className="border-border relative z-10 border-t py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center md:mb-16">
            <H2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Projects
            </H2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-lg sm:mt-4 sm:text-xl">
              Here are some of the key projects I&apos;ve worked on, showcasing
              my skills in full-stack development, user research, data analysis,
              and collaborative problem-solving.
            </p>
          </header>
          <ProjectGrid projects={projects} />
        </div>
      </section>

      {/* Skills */}
      <section
        id="skills"
        className="border-border relative z-10 border-t py-20 md:py-28"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10 text-center md:mb-12">
            <H2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Technical Skills
            </H2>
            <p className="text-muted-foreground mt-3 text-lg sm:mt-4 sm:text-xl">
              A summary of my technical proficiencies across various domains.
            </p>
          </header>
          <div className="space-y-6 md:space-y-8">
            {skillsData.map((category, i) => (
              <AnimateIn key={category.title} delay={i * 0.1}>
                <section
                  aria-labelledby={category.title
                    .replace(/\s+/g, "-")
                    .toLowerCase()}
                  className="bg-card border-border rounded-xl border p-6 shadow-sm"
                >
                  <H3
                    id={category.title.replace(/\s+/g, "-").toLowerCase()}
                    className="text-primary border-border mb-6 border-b pb-2 text-2xl"
                  >
                    {category.title}
                  </H3>
                  <ul className="flex flex-wrap gap-3">
                    {category.skills.map((skill) => (
                      <li
                        key={skill.name}
                        className="bg-secondary/40 border-border text-foreground hover:bg-secondary/70 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                      >
                        {skill.icon && (
                          <Image
                            src={skill.icon}
                            alt=""
                            width={20}
                            height={20}
                            className="h-5 w-5"
                            unoptimized
                          />
                        )}
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </section>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-border relative z-10 border-t py-20 md:py-28"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10 text-center md:mb-12">
            <H2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get In Touch
            </H2>
            <p className="text-muted-foreground mt-3 text-lg sm:mt-4 sm:text-xl">
              I&apos;m always open to discussing new opportunities, projects, or
              ideas. Connect through a profile below or send a message with the
              contact form.
            </p>
          </header>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
                <H3 className="text-2xl">My Profiles</H3>
                <p className="text-muted-foreground mt-2">
                  Connect with me on various platforms:
                </p>
                <ul className="mt-4 list-inside list-disc space-y-2">
                  <li>
                    <a
                      href="https://www.linkedin.com/in/parker-van-ham-8545ab220"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/pvanham"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wpi.joinhandshake.com/profiles/bd3v4z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Handshake
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://profile.indeed.com/p/parkerv-kpk1504"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Indeed
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
              <H3 className="text-center text-2xl">Send Me a Message</H3>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
