// src/app/projects/page.tsx
import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { H3 } from "@/components/ui/H3";
import { Metadata } from "next";
import Image from "next/image";
import { FileText, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects - Parker Van Ham",
  description:
    "A showcase of key projects by Parker Van Ham, demonstrating skills in software development, data analysis, and user-centered design.",
};

// Data for Z3 Wellness App
const z3WellnessData = {
  title: "Z³-Wellness Sleep App",
  role: "Full-Stack Developer & Researcher",
  imageUrl: "/sleep_app_pic.png", // image path
  imageAlt: "Mockup or screenshot of the Z3 Wellness App dashboard",
  overview:
    "The Z³-Wellness application is a web-based platform designed for college students to monitor and improve their sleep and overall wellness patterns. This Major Qualifying Project involved continuing development from previous WPI teams, focusing on enhancing usability and functionality based on user feedback.",
  contributions: [
    "As part of a collaborative team, I played a key role in a comprehensive user study to identify usability issues, which directly informed the application's redesign.",
    "Contributed significantly to a full backend overhaul, transitioning to a CRUD methodology with organized models, use cases, controllers, routers, and repositories for improved maintainability and scalability. This included adding historical data queries and optimizing frequently used queries with database views.",
    "Actively involved in frontend development, including UI redesign, reformatting components using TypeScript, improving mobile responsiveness, and implementing a new navigation bar and customizable dashboard graphs.",
    "Worked on critical bug fixes, updated outdated dependencies, and ensured consistent coding practices and documentation across the codebase.",
    "Helped implement calendar integration (Outlook and Google) for stress level tracking associated with scheduled events.",
    "Contributed to database schema improvements, including removing redundant ID fields and optimizing data entry processes with triggers.",
  ],
  technologies: [
    "Frontend: React, TypeScript, JavaScript, HTML, CSS",
    "Backend: Node.js (implied from server.js), Express (implied by CRUD structure for web app)",
    "Database: PostgreSQL",
    "Authentication & Analytics: Firebase",
    "Tools: Git, Qualtrics (for user study)",
  ],
  reportLink:
    "https://digital.wpi.edu/concern/student_works/2z10wv496?locale=zh",
  reportNote: "(Note: Report is primarily in Chinese)",
  // Placeholder for individual project page link
  // detailsPageLink: "/projects/z3-wellness"
};

// Data for El Parque Redevelopment Project
const elParqueData = {
  title: "El Parque Redevelopment Project, Panama",
  role: "Data Analyst & Community Researcher",
  imageUrl: "/el_parque_pic.png", // Placeholder image path
  imageAlt: "Photo or map of El Parque in Ciudad del Saber, Panama",
  overview:
    "This Global Projects Program initiative, in partnership with Fundación Ciudad del Saber (City of Knowledge) in Panama City, aimed to evaluate and recommend improvements for 'El Parque,' a significant public green space. The project focused on understanding visitor demographics, usage patterns, and community needs to inform the park's ongoing development plan.",
  contributions: [
    "Co-authored sections of the final report, including 'The Importance of Green Spaces' and methodology for 'Surveys'.",
    "Authored the 'Suggested Improvements' section based on survey findings and the specific recommendation for 'Water Access'.",
    "As part of the team, designed and distributed community surveys using various methods (fliers with QR codes, in-person intercepts, email lists via Typeform) to gather visitor feedback and demographic data.",
    "Analyzed quantitative and qualitative data from 173 survey responses to identify key trends, popular services, and areas for improvement within the park.",
    "Contributed to the development of four main prioritized recommendations for Ciudad del Saber: improving lighting, upgrading and adding bathrooms, increasing drinking water access, and enhancing communication with the park community.",
    "Delivered a final proposal to local stakeholders outlining data-driven insights and actionable recommendations.",
  ],
  skillsDemonstrated: [
    "Data Analysis",
    "Community-Based Research",
    "Survey Design & Implementation (Typeform)",
    "Qualitative & Quantitative Data Collection",
    "Stakeholder Communication",
    "Proposal Writing",
  ],
  reportLink:
    "https://digital.wpi.edu/concern/student_works/br86b6951?locale=en",
  // Placeholder for individual project page link
  // detailsPageLink: "/projects/el-parque"
};

export default function ProjectsPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <header className="mb-12 text-center md:mb-16">
        <H1>My Projects</H1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-lg sm:mt-4 sm:text-xl">
          Here are some of the key projects I&apos;ve worked on, showcasing my
          skills in full-stack development, user research, data analysis, and
          collaborative problem-solving.
        </p>
      </header>

      <div className="space-y-16 md:space-y-20">
        {/* Z3 Wellness Sleep App Section */}
        <section className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <div className="md:order-2">
            {/* Placeholder for a compelling image or carousel */}
            <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden rounded-lg shadow-lg">
              <Image
                src={z3WellnessData.imageUrl}
                alt={z3WellnessData.imageAlt}
                width={600}
                height={338}
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-4 md:order-1">
            <H2>{z3WellnessData.title}</H2>
            <H3 className="text-primary">{z3WellnessData.role}</H3>
            <p className="text-muted-foreground">{z3WellnessData.overview}</p>

            <details className="group">
              <summary className="text-primary flex cursor-pointer list-none items-center font-medium hover:underline">
                Key Contributions & Responsibilities
                <span className="ml-1 transition-transform duration-200 group-open:rotate-90">
                  &#9656;
                </span>
              </summary>
              <ul className="text-foreground mt-2 list-inside list-disc space-y-1 pl-4">
                {z3WellnessData.contributions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </details>

            <div>
              <h4 className="text-foreground mt-3 mb-1 font-semibold">
                Technologies Used:
              </h4>
              <p className="text-muted-foreground text-sm">
                {z3WellnessData.technologies.join(", ")}
              </p>
            </div>

            <div className="pt-2">
              <a
                href={z3WellnessData.reportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center font-medium hover:underline"
              >
                <FileText size={18} className="mr-2" />
                View Full Report
                {z3WellnessData.reportNote && (
                  <span className="text-muted-foreground ml-1 text-xs">
                    {z3WellnessData.reportNote}
                  </span>
                )}
              </a>
              {/* Placeholder for link to individual project page */}
              {/* {z3WellnessData.detailsPageLink && (
                <Link href={z3WellnessData.detailsPageLink} className="inline-flex items-center text-primary hover:underline font-medium ml-4">
                  <ExternalLink size={18} className="mr-2" />
                  Project Details
                </Link>
              )} */}
            </div>
          </div>
        </section>

        {/* El Parque Redevelopment Project Section */}
        <section className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <div>
            {/* Placeholder for a compelling image or carousel */}
            <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden rounded-lg shadow-lg">
              <Image
                src={elParqueData.imageUrl}
                alt={elParqueData.imageAlt}
                width={600}
                height={338}
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-4">
            <H2>{elParqueData.title}</H2>
            <H3 className="text-primary">{elParqueData.role}</H3>
            <p className="text-muted-foreground">{elParqueData.overview}</p>

            <details className="group">
              <summary className="text-primary flex cursor-pointer list-none items-center font-medium hover:underline">
                Key Contributions & Responsibilities
                <span className="ml-1 transition-transform duration-200 group-open:rotate-90">
                  &#9656;
                </span>
              </summary>
              <ul className="text-foreground mt-2 list-inside list-disc space-y-1 pl-4">
                {elParqueData.contributions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </details>

            <div>
              <h4 className="text-foreground mt-3 mb-1 font-semibold">
                Skills Demonstrated:
              </h4>
              <p className="text-muted-foreground text-sm">
                {elParqueData.skillsDemonstrated.join(", ")}
              </p>
            </div>

            <div className="pt-2">
              <a
                href={elParqueData.reportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center font-medium hover:underline"
              >
                <FileText size={18} className="mr-2" />
                View Full Report
              </a>
              {/* {elParqueData.detailsPageLink && (
                <Link href={elParqueData.detailsPageLink} className="inline-flex items-center text-primary hover:underline font-medium ml-4">
                  <ExternalLink size={18} className="mr-2" />
                  Project Details
                </Link>
              )} */}
            </div>
          </div>
        </section>

        {/* Placeholder for Hospital System Application */}
        <section className="border-border border-t py-10">
          <div className="mb-8 text-center">
            <H2>Hospital System Application</H2>
            <H3 className="text-primary">Frontend Developer</H3>
          </div>
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <Lightbulb
              size={48}
              className="text-muted-foreground mx-auto mb-4"
            />
            <p className="text-muted-foreground">
              [This section is currently under construction. Please check back
              soon for details on my contributions to a hospital service
              management application developed as part of my Software
              Engineering course. Key contributions included implementing a meal
              delivery system, a search function, and an interactive map
              feature.]
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              (Details to be added by Parker Van Ham)
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
