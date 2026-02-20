import Image from "next/image";
import Link from "next/link";
import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { TypewriterRoles } from "@/components/TypewriterRoles";
import { ChatCTAButton } from "@/components/ChatCTAButton";
import { ProjectGrid } from "@/components/ProjectGrid";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";
import type { ProjectData } from "@/components/ProjectModal";
import me from "@/assets/me.png";
import pic1 from "@/assets/image.png";
import pic2 from "../../public/sleep_app_pic.png";
import pic3 from "../../public/el_parque_pic.png";
import pic4 from "../../public/bwh_pic.jpg";
import {
  Bot,
  ArrowRight,
  Download,
  ChevronDown,
  DownloadCloud,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Parker Van Ham - Computer Scientist & Full-Stack Developer",
  description:
    "Welcome to Parker Van Ham's portfolio. Explore projects, skills, and get in touch.",
};

interface SkillItem {
  name: string;
  icon?: string;
}

interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

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

const skillsData: SkillCategory[] = [
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

const resumePdfUrl = "/Parker_Van_Ham_Resume.pdf";

export default function Home() {
  return (
    <>
      <section
        id="home"
        className="relative bg-[url('/background4.png')] bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
      >
        <div className="dark:bg-background/30 absolute inset-0 bg-black/60" />
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

          <H1 className="dark:text-foreground text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-7xl">
            Hi, I&apos;m Parker
          </H1>

          <div className="mt-4 h-8">
            <TypewriterRoles className="dark:text-primary text-cyan-300" />
          </div>

          <p className="dark:text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">
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
            <Link
              href="#resume"
              className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex items-center justify-center rounded-lg border px-6 py-3 text-base font-semibold shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              My Resume
              <Download className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <ChevronDown className="dark:text-muted-foreground mt-12 h-6 w-6 animate-bounce text-white/70" />
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

      {/* Resume */}
      <section
        id="resume"
        className="border-border relative z-10 border-t py-20 md:py-28"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10 text-center md:mb-12">
            <H1>My Resume</H1>
            <p className="text-muted-foreground mt-3 text-lg sm:mt-4 sm:text-xl">
              Click the button below to view online, or download a PDF copy.
            </p>
          </header>
          <div className="mb-10 flex justify-center md:mb-12">
            <a
              href={resumePdfUrl}
              download="Parker_Van_Ham_Resume.pdf"
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <DownloadCloud className="mr-2 h-5 w-5" />
              Download Resume (PDF)
            </a>
          </div>
          <details className="group">
            <summary className="border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground mx-auto flex max-w-md cursor-pointer list-none flex-col items-center gap-1 rounded-lg border px-6 py-4 text-center shadow-sm transition-colors [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
                View Online
                <ChevronDown className="text-muted-foreground h-5 w-5 transition-transform group-open:rotate-180" />
              </span>
              <span className="text-muted-foreground text-sm font-normal">
                Click to view — no download required
              </span>
            </summary>
            <div className="mt-6">
              <div className="border-border mx-auto aspect-[8.5/11] w-full max-w-4xl overflow-hidden rounded-lg border shadow-lg">
                <object
                  data={resumePdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  aria-label="Parker Van Ham's Resume PDF"
                >
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      It appears your browser does not support embedding PDFs
                      directly.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      No worries! You can still download it using the button
                      above.
                    </p>
                    <a
                      href={resumePdfUrl}
                      className="text-primary hover:underline"
                    >
                      Click here to download the PDF.
                    </a>
                  </div>
                </object>
              </div>
              <p className="text-muted-foreground mt-4 text-center text-sm">
                Note: Embedded PDF viewer experience may vary by browser. For
                the best view, please download the resume.
              </p>
            </div>
          </details>
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
