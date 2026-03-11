import type { StaticImageData } from "next/image";

export interface SkillItem {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

const DEVICON =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

export const skillsData: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: [
      { name: "Java", icon: `${DEVICON}/java/java-original.svg` },
      { name: "Python", icon: `${DEVICON}/python/python-original.svg` },
      {
        name: "JavaScript",
        icon: `${DEVICON}/javascript/javascript-original.svg`,
      },
      {
        name: "TypeScript",
        icon: `${DEVICON}/typescript/typescript-original.svg`,
      },
      { name: "C", icon: `${DEVICON}/c/c-original.svg` },
      { name: "HTML", icon: `${DEVICON}/html5/html5-original.svg` },
      { name: "CSS", icon: `${DEVICON}/css3/css3-original.svg` },
      {
        name: "SQL",
        icon: `${DEVICON}/azuresqldatabase/azuresqldatabase-original.svg`,
      },
    ],
  },
  {
    title: "Frameworks & Tools",
    skills: [
      { name: "React", icon: `${DEVICON}/react/react-original.svg` },
      { name: "Next.js", icon: `${DEVICON}/nextjs/nextjs-original.svg` },
      {
        name: "Tailwind CSS",
        icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
      },
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
