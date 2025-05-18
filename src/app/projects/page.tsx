import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { H3 } from "@/components/ui/H3";
import { H4 } from "@/components/ui/H4";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Me",
  description: "Learn more about Florian Walther and his work.",
};

export default function Page() {
  return (
    <section className="space-y-6">
      <H1>Projects</H1>
      <section className="space-y-3">
        <div className="flex items-baseline space-x-3 justify-start py-0.5">
          <H2>Z3 Wellness Sleep App</H2>
          <H2>-</H2>
          <H4>Full-Stack Developer</H4>
        </div>
        <p>
          As part of my Major Qualifying Project at WPI, I collaborated with a
          team to enhance an existing sleep and wellness tracking web
          application. We conducted a user study to identify pain points,
          redesigned the frontend UI for better usability, and improved backend
          functionality and error handling. I helped restructure the codebase to
          support long-term maintainability and future development. This project
          emphasized full-stack collaboration, user-centered design, and writing
          scalable, clean code.
        </p>
      </section>
      <hr className="border-muted" />
      <section className="space-y-3">
        <div className="flex items-baseline space-x-3 justify-start py-0.5">
          <H2>El Parque Project</H2>
          <H2>-</H2>
          <H4>Data Analyst / Community Researcher</H4>
        </div>
        <p>
          During a seven-week project in Panama City, I worked with Fundación
          Ciudad del Saber to evaluate and improve a public park. I helped
          design and distribute community surveys, analyze both geographic and
          financial data, and co-develop a prioritized proposal for
          infrastructure improvements. We presented our findings to local
          stakeholders, combining data-driven recommendations with community
          feedback. This project sharpened my research, analysis, and
          cross-cultural communication skills.
        </p>
      </section>
      <hr className="border-muted" />
      <section className="space-y-3">
        <div className="flex items-baseline space-x-3 justify-start py-0.5">
          <H2>Hospital System Application</H2>
          <H2>-</H2>
          <H4>Frontend Developer</H4>
        </div>
        <p>
          As part of a 10-person software engineering team, I helped build a
          hospital service management application. I developed a meal delivery
          system, an integrated search function, and contributed to an
          interactive map feature. I also collaborated on the main dashboard and
          ensured consistency in UI design across multiple features. This
          experience taught me how to work effectively within a larger agile
          team and deliver production-quality code.
        </p>
      </section>
      <hr className="border-muted" />
      <section className="space-y-3">
        <H2>Side projects</H2>
        <p>
          In my free time, I like to work on side projects to keep my skill
          sharp and try out new tech. Here is a list of my current
          projects:{" "}
        </p>
        <ul className="list-inside list-disc">
          <li>
            <a
              href="https://smartdiary.co"
              className="text-primary hover:underline"
            >
              SmartDiary.co
            </a>{" "}
            - An AI-powered journaling app
          </li>
          <li>
            <Link
              href="https://books-ai.app"
              className="text-primary hover:underline"
            >
              Books-AI.app
            </Link>{" "}
            - An AI book recommendation app
          </li>
        </ul>
      </section>
      <hr className="border-muted" />
    </section>
  );
}
