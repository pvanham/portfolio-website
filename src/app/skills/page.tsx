import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";

interface SkillItem {
  name: string;
  // add proficiency, years of experience, or a short note
  // note?: string;
}

interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

const skillsData: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: [
      { name: "Java" },
      { name: "Python" },
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "C" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "SQL" },
    ],
  },
  {
    title: "Frameworks & Tools",
    skills: [
      { name: "React" },
      { name: "Node.js" },
      { name: "Express" },
      { name: "MongoDB" },
      { name: "Git" },
      { name: "Microsoft Office" },
      { name: "Oracle" },
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
    ],
  },
];

export default function SkillsPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <header className="mb-10 text-center md:mb-12">
        <H1 className="text-foreground">Technical Skills</H1>
        <p className="text-muted-foreground mt-3 text-lg sm:mt-4 sm:text-xl">
          A summary of my technical proficiencies across various domains.
        </p>
      </header>

      <div className="space-y-10 md:space-y-12">
        {skillsData.map((category) => (
          <section
            key={category.title}
            aria-labelledby={category.title.replace(/\s+/g, "-").toLowerCase()}
          >
            <H2
              id={category.title.replace(/\s+/g, "-").toLowerCase()}
              className="text-primary border-border mb-4 border-b pb-2"
            >
              {category.title}
            </H2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {category.skills.map((skill) => (
                <li key={skill.name} className="text-foreground py-1 text-base">
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Optional: Section for "Currently Learning" or "Interests" */}
      {/* <section className="mt-12 md:mt-16">
        <h2 className="text-2xl font-semibold text-primary mb-4 pb-2 border-b border-border sm:text-3xl">
          Currently Exploring
        </h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>[Placeholder: e.g., Advanced AI/ML Concepts]</li>
          <li>[Placeholder: e.g., Cloud Platform (AWS/Azure/GCP)]</li>
        </ul>
      </section>
      */}
    </main>
  );
}
