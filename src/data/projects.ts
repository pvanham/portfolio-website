import type { ProjectData } from "@/components/ProjectModal";
import pic1 from "@/assets/image.png";
import pic1Alt from "@/assets/site_screenshot.png";
import pic2 from "@/assets/sleep_app_pic.png";
import pic3 from "@/assets/el_parque_pic.png";
import pic4 from "@/assets/bwh_pic.jpg";
import pic5 from "@/assets/sous_pic.png";
import pic6 from "@/assets/tabixell_pic.png";

/**
 * Canonical project list used by both the homepage and the
 * dedicated /projects page. The /projects page uses `pic1Alt`
 * (a smaller screenshot) for the portfolio entry.
 */
export const projects: ProjectData[] = [
  {
    slug: "sous",
    title: "Sous",
    role: "Full-Stack Developer",
    status: "in-progress",
    image: pic5,
    imageAlt:
      "Sous kitchen scheduling dashboard showing weekly schedule grid, shift assignments, and AI assistant panel",
    overview:
      "An AI-powered staff scheduling platform for high-volume kitchens that combines a constraint-optimization solver with a conversational AI assistant to automate and streamline shift planning. Managers interact with a natural-language chat interface to generate, review, and refine schedules while the system enforces labor rules, availability, and coverage requirements behind the scenes. This project is actively in development — next steps include further refining the AI assistant and building an accompanying mobile app for on-the-go staff management.",
    contributions: [
      "Architected a full-stack Next.js 16 (App Router) application with a strict three-layer architecture — React UI, Server Actions, and Mongoose services — supporting multi-organization and multi-location data scoping.",
      "Built an agentic AI chat assistant using the Vercel AI SDK and GPT-4o with a custom tool registry, enabling managers to query schedule health, propose shift swaps, and trigger schedule generation through natural-language conversation.",
      "Engineered an OR-Tools CP-SAT constraint solver microservice in Python (FastAPI) that optimally assigns staff to station-time slots under hard and soft constraints including hour limits, clopening prevention, manager coverage, and fairness balancing.",
      "Designed an async task pipeline that bridges the Next.js app and the Python solver, with background job polling, real-time status updates in the chat UI, and a proposal-based approval workflow for generated schedules.",
      "Implemented a visual schedule builder with weekly grid views, drag-friendly shift editing, labor requirement configuration, and a dashboard featuring live metrics on coverage, labor hours, and staffing ratios.",
      "Integrated Clerk authentication with role-based access control, Stripe billing with checkout and customer portal flows, and Clerk/Stripe webhook handlers for event-driven state synchronization.",
    ],
    technologies: [
      "Next.js 16 & React 19",
      "TypeScript",
      "Tailwind CSS & shadcn/ui",
      "MongoDB & Mongoose",
      "OpenAI GPT-4o (Vercel AI SDK)",
      "OR-Tools CP-SAT (Python / FastAPI)",
      "Clerk Authentication",
      "Stripe Billing",
      "TanStack Query",
    ],
    link: {
      label: "View Source Code on GitHub",
      href: "https://github.com/pvanham/Sous",
    },
  },
  {
    slug: "tabixell-studio-manager",
    title: "Tabixell Studio Manager",
    role: "Full-Stack Developer",
    status: "in-progress",
    image: pic6,
    imageAlt:
      "Studio Manager dashboard showing class overview, student counts, and upcoming schedule for a studio owner",
    overview:
      "A multi-tenant SaaS platform for education and activity studios — such as dance schools, music academies, and martial arts dojos — to manage classes, enrollments, scheduling, billing, and accounting. The app serves three distinct user roles (owner, teacher, and client/parent) with dedicated dashboards, role-gated routing, and a double-entry accounting engine. This project is actively in development — planned work includes Stripe payment integration with automatic ledger posting, an owner accounting dashboard with P&L and balance-sheet views, attendance tracking, a client billing portal, and email/in-app notifications.",
    contributions: [
      "Architected a multi-tenant data model in MongoDB with studio-scoped isolation, a hybrid ID strategy (Mongoose ObjectIds for domain entities, Clerk string IDs for users), and partial unique indexes to enforce business invariants like one active enrollment per student per class.",
      "Built a role-based access system with three distinct dashboards (owner, teacher, client) enforced at the middleware layer via Clerk session claims, with automatic redirects and 401/403 API responses for unauthorized access.",
      "Engineered an invitation-based onboarding flow where studio owners invite teachers and parents via tokenized links, with a Svix-verified Clerk webhook automatically creating user profiles, assigning roles, and linking users to the correct studio on sign-up.",
      "Designed and implemented a double-entry accounting kernel supporting atomic journal entry posting via MongoDB transactions, Zod-validated balanced ledger lines, idempotency keys to prevent duplicate postings, and full reversal support with audit-trail linking.",
      "Developed a class scheduling system with recurring time-slot definitions and a conflict-detection engine that validates date-range and time-slot overlaps before allowing new enrollments.",
      "Implemented a 3-layer client data-fetching architecture (API routes → typed fetch wrappers → TanStack React Query hooks) with Zod validation, optimistic UI patterns, and skeleton loading states across all dashboards.",
      "Created a responsive UI with shadcn/ui components, dark mode support via next-themes, and polished dashboard views including teacher payroll with YTD earnings, client class browsing with search/filter, and owner-level user management with pending invitation tracking.",
    ],
    technologies: [
      "Next.js 15 (App Router)",
      "React 19",
      "TypeScript",
      "MongoDB & Mongoose",
      "Clerk Authentication",
      "TanStack React Query",
      "Tailwind CSS v4 & shadcn/ui",
      "Zod",
    ],
    link: {
      label: "View Source Code on GitHub",
      href: "https://github.com/pvanham/studio-manager",
    },
  },
  {
    slug: "portfolio-website",
    title: "This Portfolio Website",
    role: "Full-Stack Developer",
    image: pic1,
    imageAlt: "A screenshot of this portfolio website",
    overview:
      "A personal portfolio website built from scratch to serve as a dynamic, interactive hub for my professional work. The primary goal was to create a modern, performant, and visually unique site that actively demonstrates my skills through an integrated AI chatbot powered by RAG technology.",
    contributions: [
      "Designed and implemented the entire application using a modern tech stack centered on Next.js and React with TypeScript.",
      "Developed a fully responsive UI with Tailwind CSS, including a custom theme with light and dark modes.",
      "Engineered and integrated an AI chatbot from the ground up, leveraging the Vercel AI SDK for streaming UI updates.",
      "Built a Retrieval Augmented Generation (RAG) pipeline using an agentic tool-calling pattern via the Vercel AI SDK, enabling the chatbot to answer questions based on website content.",
      "Set up a hybrid vector index using Upstash Vector with built-in embedding generation and BM25 keyword search for accurate retrieval.",
      "Utilized OpenAI's GPT-4o-mini for conversational responses with real-time streaming via the Vercel AI SDK's streamText and useChat.",
      "Implemented rate limiting with Upstash Redis and request validation with Zod to protect public API endpoints.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vercel AI SDK",
      "Upstash Vector",
      "Upstash Redis",
      "OpenAI",
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

/**
 * The /projects page uses a different hero image for the portfolio
 * entry (a smaller site screenshot instead of the full-size one).
 */
export const projectsPageList: ProjectData[] = projects.map((p) =>
  p.slug === "portfolio-website" ? { ...p, image: pic1Alt } : p,
);
