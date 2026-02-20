import Image from "next/image";
import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { Metadata } from "next";

interface SkillItem {
  name: string;
  icon?: string;
}

interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

export const metadata: Metadata = {
  title: "Skills",
  description:
    "A detailed overview of the technical skills of Parker Van Ham, including Java, Python, TypeScript, React, Next.js, Langchain, and AI/ML concepts.",
};

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const skillsData: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: [
      { name: "Java", icon: `${DEVICON}/java/java-original.svg` },
      { name: "Python", icon: `${DEVICON}/python/python-original.svg` },
      { name: "JavaScript", icon: `${DEVICON}/javascript/javascript-original.svg` },
      { name: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg` },
      { name: "C", icon: `${DEVICON}/c/c-original.svg` },
      { name: "HTML", icon: `${DEVICON}/html5/html5-original.svg` },
      { name: "CSS", icon: `${DEVICON}/css3/css3-original.svg` },
      { name: "SQL", icon: `${DEVICON}/azuresqldatabase/azuresqldatabase-original.svg` },
    ],
  },
  {
    title: "Frameworks & Tools",
    skills: [
      { name: "React", icon: `${DEVICON}/react/react-original.svg` },
      { name: "Next.js", icon: `${DEVICON}/nextjs/nextjs-original.svg` },
      { name: "Tailwind CSS", icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg` },
      { name: "Node.js", icon: `${DEVICON}/nodejs/nodejs-original.svg` },
      { name: "Express", icon: `${DEVICON}/express/express-original.svg` },
      { name: "MongoDB", icon: `${DEVICON}/mongodb/mongodb-original.svg` },
      { name: "Git", icon: `${DEVICON}/git/git-original.svg` },
      { name: "Microsoft Office" },
      { name: "Oracle", icon: `${DEVICON}/oracle/oracle-original.svg` },
      { name: "SolidWorks" },
    ],
  },
  {
    title: "Concepts & Methodologies",
    skills: [
      { name: "Object-Oriented Programming (OOP)" },
      { name: "Full-Stack Development" },
      { name: "Agile/Scrum Methodologies" },
      { name: "Web Development" },
      { name: "Database Systems & Management" },
      { name: "Retrieval-Augmented Generation (RAG)" },
    ],
  },
];

export default function SkillsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <header className="mb-10 text-center md:mb-12">
        <H1 className="text-foreground">Technical Skills</H1>
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
            </section>
          </AnimateIn>
        ))}
      </div>
    </main>
  );
}
