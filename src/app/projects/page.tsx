import { H1 } from "@/components/ui/H1";
import { ProjectGrid } from "@/components/ProjectGrid";
import type { Metadata } from "next";
import type { ProjectData } from "@/components/ProjectModal";
import pic1 from "@/assets/site_screenshot.png";
import pic2 from "../../../public/sleep_app_pic.png";
import pic3 from "../../../public/el_parque_pic.png";
import pic4 from "../../../public/bwh_pic.jpg";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the project portfolio of Parker Van Ham, including work on the Z³ Wellness Sleep App, the El Parque Redevelopment Project, and more.",
};

const projects: ProjectData[] = [
  {
    slug: "portfolio-website",
    title: "This Portfolio Website",
    role: "Full-Stack Developer (Sole Developer)",
    image: pic1,
    imageAlt: "A screenshot of this portfolio website",
    overview:
      "A personal portfolio website built from scratch to serve as a dynamic, interactive hub for my professional work. The primary goal was to create a modern, performant, and visually unique site that actively demonstrates my skills through an integrated AI chatbot powered by advanced RAG technology.",
    contributions: [
      "Designed and implemented the entire application using a modern tech stack centered on Next.js and React with TypeScript.",
      "Developed a fully responsive UI with Tailwind CSS, including a custom theme with light and dark modes.",
      "Engineered and integrated an AI chatbot from the ground up, leveraging the Vercel AI SDK for streaming UI updates.",
      "Built a Retrieval Augmented Generation (RAG) pipeline using Langchain.js to enable the chatbot to answer questions based on website content.",
      "Set up a vector database using AstraDB to store and retrieve contextual information for the chatbot.",
      "Utilized OpenAI's GPT-4o-mini for conversational responses and text-embedding-3-small for generating high-quality embeddings.",
      "Managed project dependencies, resolved version conflicts (e.g., between Langchain community packages and the Vercel AI SDK), and debugged complex type errors (e.g., enforcing strict types to avoid 'any' usage).",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vercel AI SDK",
      "Langchain.js",
      "OpenAI",
      "AstraDB",
    ],
    link: {
      label: "View Source Code on GitHub",
      href: "https://github.com/pvanham/portfolio-website",
    },
  },
  {
    slug: "z3-wellness",
    title: "Z³-Wellness Sleep App",
    role: "Full-Stack Developer & Researcher",
    image: pic2,
    imageAlt: "Screenshot of the Z3 Wellness App",
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
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Firebase",
      "Git",
    ],
    link: {
      label: "View Full Report",
      href: "https://digital.wpi.edu/concern/student_works/2z10wv496?locale=zh",
    },
  },
  {
    slug: "el-parque",
    title: "El Parque Redevelopment Project, Panama",
    role: "Data Analyst & Community Researcher",
    image: pic3,
    imageAlt: "Photo of El Parque in Ciudad del Saber, Panama",
    overview:
      "This Global Projects Program initiative, in partnership with Fundación Ciudad del Saber (City of Knowledge) in Panama City, aimed to evaluate and recommend improvements for 'El Parque,' a significant public green space. The project focused on understanding visitor demographics, usage patterns, and community needs to inform the park's ongoing development plan.",
    contributions: [
      "Designed and distributed community surveys using various methods (fliers with QR codes, in-person intercepts, email lists via Typeform) to gather visitor feedback and demographic data.",
      "Analyzed quantitative and qualitative data from 173 survey responses to identify key trends, popular services, and areas for improvement within the park.",
      "Contributed to the development of four main prioritized recommendations for Ciudad del Saber: improving lighting, upgrading and adding bathrooms, increasing drinking water access, and enhancing communication with the park community.",
      "Delivered a final proposal to local stakeholders outlining data-driven insights and actionable recommendations.",
    ],
    technologies: [
      "Data Analysis",
      "Survey Design",
      "Typeform",
      "Stakeholder Communication",
      "Proposal Writing",
    ],
    link: {
      label: "View Full Report",
      href: "https://digital.wpi.edu/concern/student_works/br86b6951?locale=en",
    },
  },
  {
    slug: "hospital-system",
    title: "Hospital System Application",
    role: "Frontend Developer",
    image: pic4,
    imageAlt: "Photo of Brigham and Women's Hospital",
    overview:
      "As part of a 10-person team for my Software Engineering course, I contributed to the design and development of a comprehensive hospital service management application for Brigham and Women's Hospital.",
    contributions: [
      "Implemented a user-friendly meal delivery request system from the ground up, allowing staff to manage patient dietary needs efficiently.",
      "Developed a dynamic search function to enable users to quickly locate hospital services, departments, and personnel.",
      "Contributed to the creation of an interactive map feature to help with navigation within the large hospital complex.",
      "Helped oversee the main dashboard development and ensure consistent UI design.",
    ],
    technologies: [
      "Java",
      "JavaFX",
      "JFoenix",
      "Scenebuilder",
      "CSS",
      "Apache Derby",
    ],
  },
];

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <header className="mb-12 text-center md:mb-16">
        <H1>My Projects</H1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-lg sm:mt-4 sm:text-xl">
          Here are some of the key projects I&apos;ve worked on, showcasing my
          skills in full-stack development, user research, data analysis, and
          collaborative problem-solving.
        </p>
      </header>

      <ProjectGrid projects={projects} />
    </main>
  );
}
