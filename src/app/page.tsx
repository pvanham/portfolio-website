/** Homepage — hero section, chatbot preview, project grid, skills overview, and contact form. */

import Image from "next/image";
import Link from "next/link";
import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { TypewriterRoles } from "@/components/TypewriterRoles";
import { ChatCTAButton } from "@/components/ChatCTAButton";
import { ProjectGrid } from "@/components/ProjectGrid";
import ContactForm from "@/components/ContactForm";
import { projects } from "@/data/projects";
import { skillsData } from "@/data/skills";
import me from "@/assets/me.png";
import type { Metadata } from "next";
import { Bot, ArrowRight, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Parker Van Ham - Computer Scientist & Full-Stack Developer",
  description:
    "Welcome to Parker Van Ham's portfolio. Explore projects, skills, and get in touch.",
};

export default function HomePage() {
  return (
    <>
      <section
        id="home"
        className="relative bg-[image:var(--hero-bg)] bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-background/50" />
        <AnimateIn className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
          <div className="relative">
            <Image
              src={me}
              alt="A photo of me"
              height={160}
              width={160}
              className="border-primary/40 mx-auto mb-8 aspect-square rounded-full border-4 object-cover shadow-2xl"
              priority
            />
            <div className="bg-primary/15 absolute -right-6 -bottom-2 -z-10 h-28 w-28 rounded-full blur-2xl" />
            <div className="bg-accent/20 absolute -top-6 -left-6 -z-10 h-24 w-24 rotate-12 rounded-lg blur-xl" />
          </div>

          <H1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Hi, I&apos;m Parker
          </H1>

          <div className="mt-4 h-8">
            <TypewriterRoles className="text-primary" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            I&apos;m a software engineer with a strong foundation in full-stack
            development and a broad range of programming languages. I&apos;m
            actively expanding my knowledge in AI and its real-world
            applications, and I&apos;m eager to apply my skills to impactful
            projects.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="#projects"
              className="focus-visible:ring-ring from-primary hover:from-primary/90 inline-flex items-center justify-center rounded-lg bg-gradient-to-r to-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:to-cyan-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:to-teal-400 dark:hover:to-teal-500"
            >
              View My Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <ChevronDown className="mt-12 h-6 w-6 animate-bounce text-muted-foreground" />
        </AnimateIn>
      </section>

      {/* Chatbot mock preview */}
      <div className="bg-muted/30 relative z-10 py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <section className="bg-card/80 overflow-hidden rounded-xl shadow-2xl backdrop-blur-sm">
              <div className="border-border from-primary/10 to-background flex items-center gap-3 border-b bg-gradient-to-r px-5 py-3">
                <Bot className="text-primary h-5 w-5" />
                <span className="text-foreground text-sm font-semibold">
                  Portfolio Assistant
                </span>
              </div>

              <div className="space-y-4 p-5 md:p-8">
                {/* Mock user bubble */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground max-w-[80%] rounded-2xl rounded-br-none px-4 py-2.5 shadow-sm">
                    What projects has Parker built?
                  </div>
                </div>

                {/* Mock bot bubble */}
                <div className="flex items-end gap-2">
                  <Bot className="text-primary h-5 w-5 flex-shrink-0 opacity-50" />
                  <div className="bg-muted text-foreground max-w-[80%] rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm">
                    Parker has built several projects including the
                    Z&#179;-Wellness Sleep App, this portfolio website with a
                    RAG-powered chatbot, and more. Would you like details on any
                    of them?
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Curious about my skills, project details, or experience? Ask
                    my AI assistant anything.
                  </p>
                  <ChatCTAButton />
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
            <H1>My Projects</H1>
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
            <H1 className="text-foreground">Technical Skills</H1>
            <p className="text-muted-foreground mt-3 text-lg sm:mt-4 sm:text-xl">
              A summary of my technical proficiencies across various domains.
            </p>
          </header>
          <div className="space-y-6 md:space-y-8">
            {skillsData.map((category, i) => (
              <AnimateIn key={category.title} delay={i * 0.1}>
                <div
                  aria-labelledby={category.title
                    .replace(/\s+/g, "-")
                    .toLowerCase()}
                  className="bg-card border-border rounded-xl border p-6 shadow-sm"
                >
                  <H2
                    id={category.title.replace(/\s+/g, "-").toLowerCase()}
                    className="text-primary border-border mb-6 border-b pb-2"
                  >
                    {category.title}
                  </H2>
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
                </div>
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
            <H1>Get In Touch</H1>
            <p className="text-muted-foreground mt-3 text-lg sm:mt-4 sm:text-xl">
              I&apos;m always open to discussing new opportunities, projects, or
              ideas. Feel free to reach out through any of the channels below or
              use the contact form.
            </p>
          </header>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
                <H2>My Profiles</H2>
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
              <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
                <H2>Direct Contact Information</H2>
                <ul className="mt-4 space-y-2">
                  <li>
                    <strong>Personal Email:</strong>{" "}
                    <a
                      href="mailto:parkervanham@gmail.com"
                      className="text-primary hover:underline"
                    >
                      parkervanham@gmail.com
                    </a>
                  </li>
                  <li>
                    <strong>School Email:</strong>{" "}
                    <a
                      href="mailto:prvanham@wpi.edu"
                      className="text-primary hover:underline"
                    >
                      prvanham@wpi.edu
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
              <H2 className="text-center">Send Me a Message</H2>
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
