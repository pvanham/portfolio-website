// src/app/projects/page.tsx
import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { H3 } from "@/components/ui/H3";
import { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";
import pic1 from "@/assets/site_screenshot.png";
import pic2 from "../../../public/sleep_app_pic.png";
import pic3 from "../../../public/el_parque_pic.png";

import pic4 from "../../../public/bwh_pic.jpg";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the project portfolio of Parker Van Ham, including work on the Z³ Wellness Sleep App, the El Parque Redevelopment Project, and more.",
};

// Data for Z3 Wellness App (remains the same)
const z3WellnessData = {
  title: "Z³-Wellness Sleep App",
  role: "Full-Stack Developer & Researcher",
  imageUrl: "/placeholders/z3-app-dashboard.png",
  imageAlt: "Mockup or screenshot of the Z3 Wellness App dashboard",
  overview:
    "The Z³-Wellness application is a web-based platform designed for college students to monitor and improve their sleep and overall wellness patterns. This Major Qualifying Project involved continuing development from previous WPI teams, focusing on enhancing usability and functionality based on user feedback.",
  contributions: [
    "Actively involved in frontend development, including UI redesign, reformatting components using TypeScript, improving mobile responsiveness, and implementing a new navigation bar and customizable dashboard graphs.",
    "Contributed to a full backend overhaul, transitioning to a CRUD methodology with organized models, use cases, controllers, routers, and repositories for improved maintainability and scalability. This included adding historical data queries and optimizing frequently used queries with database views.",
    "As part of a collaborative team, I played a key role in a comprehensive user study to identify usability issues, which directly informed the application's redesign.",
    "Worked on critical bug fixes, updated outdated dependencies, and ensured consistent coding practices and documentation across the codebase.",
    "Helped implement calendar integration (Outlook and Google) for stress level tracking associated with scheduled events.",
    "Contributed to database schema improvements, including removing redundant ID fields and optimizing data entry processes with triggers.",
  ],
  technologies: [
    "Frontend: React, TypeScript, JavaScript, HTML, CSS",
    "Backend: Node.js, Express",
    "Database: PostgreSQL",
    "Authentication & Analytics: Firebase",
    "Tools: Git, Qualtrics (for user study)",
  ],
  reportLink:
    "https://digital.wpi.edu/concern/student_works/2z10wv496?locale=zh",
};

// Data for El Parque Redevelopment Project (remains the same)
const elParqueData = {
  title: "El Parque Redevelopment Project, Panama",
  role: "Data Analyst & Community Researcher",
  imageUrl: "/placeholders/el-parque-overview.png",
  imageAlt: "Photo or map of El Parque in Ciudad del Saber, Panama",
  overview:
    "This Global Projects Program initiative, in partnership with Fundación Ciudad del Saber (City of Knowledge) in Panama City, aimed to evaluate and recommend improvements for 'El Parque,' a significant public green space. The project focused on understanding visitor demographics, usage patterns, and community needs to inform the park's ongoing development plan.",
  contributions: [
    "Designed and distributed community surveys using various methods (fliers with QR codes, in-person intercepts, email lists via Typeform) to gather visitor feedback and demographic data.",
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
};

// Data for THIS Portfolio Website
const portfolioWebsiteData = {
  title: "This Portfolio Website",
  role: "Full-Stack Developer (Sole Developer)",
  imageUrl: "/placeholders/portfolio-website-mockup.png",
  imageAlt: "A mockup showing the portfolio website on different devices",
  overview:
    "A personal portfolio website built from scratch to serve as a central hub for my projects, skills, and professional resume. The primary goal was to create a modern, performant, and visually appealing site while also integrating an advanced AI chatbot capable of answering questions about my professional background.",
  contributions: [
    "Designed and implemented the entire application using a modern tech stack centered around Next.js and React with TypeScript.",
    "Developed a fully responsive UI with Tailwind CSS, including a custom theme with light and dark modes.",
    "Engineered and integrated an AI chatbot from the ground up, leveraging the Vercel AI SDK for streaming UI updates.",
    "Built a Retrieval Augmented Generation (RAG) pipeline using Langchain.js to enable the chatbot to answer questions based on website content.",
    "Set up a vector database using AstraDB to store and retrieve contextual information for the chatbot.",
    "Utilized Google Gemini for both high-quality text embeddings and for generating conversational responses.",
    "Managed project dependencies, resolved version conflicts (e.g., between Langchain community packages and the Vercel AI SDK), and debugged complex type errors.",
  ],
  technologies: [
    "Frontend: Next.js, React, TypeScript, Tailwind CSS, Vercel AI SDK",
    "Backend: Next.js API Routes (Edge Runtime)",
    "AI/ML: Langchain.js, Google Gemini (Embeddings & LLM)",
    "Database: AstraDB (Vector Store)",
    "Deployment: Vercel",
  ],
  repoLink: "https://github.com/pvanham/portfolio-website",
};

// NEW: Data for the Brigham and Women's Hospital Application
const bwhData = {
  title: "Hospital System Application",
  role: "Frontend Developer",
  imageAlt: "Photo of Brigham and Women's Hospital",
  overview:
    "As part of a 10-person team for my Software Engineering course, I contributed to the design and development of a comprehensive hospital service management application for Brigham and Women’s Hospital.",
  contributions: [
    "Implemented a user-friendly meal delivery request system from the ground up.",
    "Developed a dynamic search function to quickly locate hospital services and personnel.",
    "Contributed to the creation of an interactive map feature for easy navigation within the hospital.",
    "Oversaw the main dashboard's development, ensuring a consistent and intuitive UI design across all features.",
  ],
  technologies: [
    "Java",
    "JavaFX",
    "JFoenix",
    "Scenebuilder",
    "CSS",
    "Apache Derby",
  ],
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
        {/* Section for This Portfolio Website */}
        <section className="border-border grid items-start gap-8 border-t pt-16 md:grid-cols-2 md:gap-12">
          <div className="md:order-2">
            <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden rounded-lg shadow-lg">
              <Image src={pic1} alt="A photo of this website" />
            </div>
          </div>
          <div className="space-y-4 md:order-1">
            <H2>{portfolioWebsiteData.title}</H2>
            <H3 className="text-primary">{portfolioWebsiteData.role}</H3>
            <p className="text-muted-foreground">
              {portfolioWebsiteData.overview}
            </p>

            <details className="group">
              <summary className="text-primary flex cursor-pointer list-none items-center font-medium hover:underline">
                Key Contributions & Features
                <span className="ml-1 transition-transform duration-200 group-open:rotate-90">
                  &#9656;
                </span>
              </summary>
              <ul className="text-foreground mt-2 list-inside list-disc space-y-1 pl-4">
                {portfolioWebsiteData.contributions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </details>

            <div>
              <h4 className="text-foreground mt-3 mb-1 font-semibold">
                Technologies Used:
              </h4>
              <p className="text-muted-foreground text-sm">
                {portfolioWebsiteData.technologies.join(", ")}
              </p>
            </div>

            {portfolioWebsiteData.repoLink && (
              <div className="pt-2">
                <a
                  href={portfolioWebsiteData.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center font-medium hover:underline"
                >
                  <ExternalLink size={18} className="mr-2" />
                  View Source Code on GitHub
                </a>
              </div>
            )}
          </div>
        </section>
        {/* Z3 Wellness Sleep App Section */}
        <section className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <div className="md:order-1">
            <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden rounded-lg shadow-lg">
              <Image src={pic2} alt="A photo of the Z3 Wellness App" />
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
              </a>
            </div>
          </div>
        </section>

        {/* El Parque Redevelopment Project Section */}
        <section className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <div className="md:order-2">
            <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden rounded-lg shadow-lg">
              <Image src={pic3} alt="A photo of El Parque" />
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
            </div>
          </div>
        </section>

        {/* NEW: BWH Hospital App Section */}
        <section className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <div className="md:order-1">
            <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden rounded-lg shadow-lg">
              <Image src={pic4} alt={bwhData.imageAlt} />
            </div>
          </div>
          <div className="space-y-4 md:order-1">
            <H2>{bwhData.title}</H2>
            <H3 className="text-primary">{bwhData.role}</H3>
            <p className="text-muted-foreground">{bwhData.overview}</p>
            <details className="group">
              <summary className="text-primary flex cursor-pointer list-none items-center font-medium hover:underline">
                Key Contributions
                <span className="ml-1 transition-transform duration-200 group-open:rotate-90">
                  &#9656;
                </span>
              </summary>
              <ul className="text-foreground mt-2 list-inside list-disc space-y-1 pl-4">
                {bwhData.contributions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </details>
            <div>
              <h4 className="text-foreground mt-3 mb-1 font-semibold">
                Technologies Used:
              </h4>
              <p className="text-muted-foreground text-sm">
                {bwhData.technologies.join(", ")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
