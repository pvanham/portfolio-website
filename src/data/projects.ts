import type { StaticImageData } from "next/image";
import pic1 from "@/assets/image.png";
import pic2 from "@/assets/sleep_app_pic.png";
import pic3 from "@/assets/el_parque_pic.png";
import pic4 from "@/assets/bwh_pic.jpg";
import pic5 from "@/assets/sous_pic.png";
import pic6 from "@/assets/cnc_router_pic.png";
import pic7 from "@/assets/teetimebot_pic.png";
import pic8 from "@/assets/cnc_storefront_pic.png";

export interface ProjectData {
  slug: string;
  title: string;
  role: string;
  image: StaticImageData;
  imageAlt: string;
  overview: string;
  contributions: string[];
  technologies: string[];
  status?: "in-progress";
  link?: { label: string; href: string };
}

/**
 * Canonical project list used by the homepage grid and /projects/[slug] pages.
 * Ordered strongest-first: shipped client work, then depth-of-engineering
 * projects, then academic and non-engineering work.
 */
export const projects: ProjectData[] = [
  {
    slug: "buy-a-cnc-router",
    title: "Buy a CNC Router — Industrial CNC Storefront",
    role: "Sole Developer",
    image: pic8,
    imageAlt:
      "Buy a CNC Router storefront hero section showing the Short Cut 203 router, its $11,000 price, and a 'Shop the Short Cut 203' call-to-action",
    overview:
      'A Next.js storefront built for Industrial CNC, a CNC router manufacturer, to sell its "Short Cut 203" router directly online while funneling interest in its other four Pro Series models back to the manufacturer\'s main site. It combines a fixed-price purchase-order checkout with a "request a quote" alternative, automated email notifications, and structured data engineered specifically to pass Google Merchant Center\'s approval requirements. Product content (descriptions, specs, testimonials, videos) is pulled from the manufacturer\'s existing legacy pages.',
    contributions: [
      "Built a Next.js 16 (App Router) storefront with React 19, TypeScript, and Tailwind CSS 4, using Server Actions instead of API routes for every form submission, with pricing and SKU resolution kept authoritative on the server.",
      "Designed a dual-conversion checkout system offering both a 'Place Order' (purchase-order/invoice) flow and a 'Get a Quote' flow, each backed by its own typed Server Action, field validation, honeypot-based bot filtering, and a shared modal UI deep-linkable via query parameters.",
      "Implemented transactional email delivery with Resend, hand-building a branded HTML/plain-text email layout system that renders order and quote details into email-client-safe markup with reply-to routing back to the customer.",
      "Implemented JSON-LD Product/Offer and Organization structured data.",
      "Configured HTTP security headers (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) and authored the full set of e-commerce legal pages (privacy policy, terms of service, shipping policy, return policy).",
      "Iterated the payment strategy across several commits, moving from invoice-only ordering toward a Square Payment Link integration to keep pace with Google Merchant Center's checkout policy requirements.",
    ],
    technologies: [
      "Next.js 16 (App Router) & React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Server Actions",
      "Resend (transactional email)",
      "Python (data-extraction scripting)",
      "JSON-LD / Schema.org",
      "lucide-react",
      "Square",
    ],
    link: {
      label: "View Live Site",
      href: "https://cncrouters.industrialcnc.com/",
    },
  },
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
    slug: "tee-time-bot",
    title: "TeeTimeBot — Automated Tee-Time Booking Assistant",
    role: "Sole Developer",
    status: "in-progress",
    image: pic7,
    imageAlt:
      "TeeTimeBot mobile app settings screen showing a booking bot toggle, preferred tee-time window, course selection, and player count",
    overview:
      "A scheduled booking assistant that reserves a private golf club member's tee times on his behalf, built around a fixed release deadline and an irreversible action — once a reservation goes through, it is a real booking. A TypeScript service handles authentication, timing, and safety-checked checkout, while a companion Next.js PWA lets the client set his preferences and toggle the bot on and off from his iPhone. It runs on the client's own account and credentials with his consent, reserving only what he is already entitled to book as a member, and reports the outcome of every scheduled run by push notification.",
    contributions: [
      "Built an offline integration test harness — a mocked reservation API plus a scenario runner covering roughly 15 cases, including a real production incident diagnosed from live logs, reproduced, and turned into a permanent regression test — because the live booking flow can only be exercised against real reservations.",
      "Implemented safety invariants throughout the checkout pipeline: a hard configuration gate that runs the full flow in dry-run mode and logs exactly what it would have sent, a rule that the cart must hold exactly one item immediately before checkout, and mandatory cart re-reads after any operation that could silently alter its state.",
      "Built a multi-stage HTTP automation service in TypeScript that signs in with the client's own club credentials, bridges an SSO handoff to the club's third-party reservation platform, and completes a full availability search → cart → checkout flow using a custom cookie-jar implementation for session continuity across roughly 10 chained requests.",
      "Engineered the run around a fixed release deadline, since availability is short-lived once bookings open: connections are kept warm ahead of the window, the service synchronizes to the server's clock by sampling its response timestamps (accurate to tens of milliseconds), and a hedged parallel request keeps a single slow response from costing the run.",
      "Designed DST-safe scheduling logic that runs on a fixed-UTC cron job but computes the correct Eastern-time wake moment year-round using calendar-date arithmetic rather than host-clock arithmetic.",
      "Built a mobile-first Next.js 16 (App Router) + React 19 PWA with JWT-based session auth (signed httpOnly cookies), a debounced autosaving settings form for booking preferences, and MongoDB-backed configuration shared directly with the automation service.",
      "Integrated real-time push notifications (ntfy.sh) so the client gets an outcome summary — booked, no matching availability, or error — after every scheduled run, without needing to open the app.",
    ],
    technologies: [
      "TypeScript & Node.js",
      "Next.js 16 (App Router) & React 19",
      "MongoDB Atlas",
      "Tailwind CSS",
      "PWA (@ducanh2912/next-pwa)",
      "JWT Auth (jose)",
      "Scheduled Cron Jobs (Render)",
      "Vercel",
      "ntfy.sh (Push Notifications)",
    ],
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
      "Developed a fully responsive UI with Tailwind CSS, including a custom dark theme.",
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
    slug: "industrial-cnc-router-leads",
    title: "Industrial CNC Router Promotions",
    role: "Full-Stack Developer (Sole Developer)",
    image: pic6,
    imageAlt:
      "Industrial CNC Router Promotions landing page hero section showing tiered router pricing cards and a call-to-action for pricing and info",
    overview:
      "A conversion-focused marketing landing page for an Industrial CNC promotional ad campaign, built to turn visitors into qualified sales leads. It presents tiered product promotions, feature breakdowns, customer testimonials, and financing information, all funneling into a validated lead-capture form that emails inquiries directly to the sales inbox. The site was built with the Next.js App Router and styled with Tailwind CSS to match the client's existing brand identity.",
    contributions: [
      "Built a single-page Next.js 16 App Router marketing site composed of eight discrete, independently testable section components (Header, Hero, TSlotPromotion, AutomateShop, FeaturedPromotion, Testimonials, LeadForm, Footer).",
      "Implemented a server-validated lead capture form using React 19's useActionState hook wired to a Next.js Server Action (submitLead), covering required-field and email-format validation with per-field inline error messages.",
      "Integrated the Resend email API to deliver lead notifications as HTML emails with the visitor's address set as replyTo, so the sales team can respond directly from their inbox.",
      "Added a hidden honeypot field to the lead form to silently discard bot submissions without alerting the submitter or sending false-positive emails.",
      "Configured custom HTTP security headers (X-Content-Type-Options, Referrer-Policy, Permissions-Policy) in next.config.ts to harden the deployed site.",
      "Set up dynamic SEO and Open Graph metadata that resolves the canonical site URL automatically from Vercel's VERCEL_PROJECT_PRODUCTION_URL environment variable at build time.",
      "Styled the UI with Tailwind CSS v4's @theme inline token system, defining custom brand color variables and a repeating background texture, plus a reduced-motion-aware fade-up entrance animation.",
      "Loaded and applied two Google fonts (Anton for display headings, Lato for body copy) via next/font/google with tuned font-weight subsets for performance.",
    ],
    technologies: [
      "Next.js 16 (App Router)",
      "React 19 & TypeScript",
      "Tailwind CSS 4",
      "Next.js Server Actions",
      "Resend (transactional email)",
      "lucide-react",
      "next/font (Google Fonts)",
      "Vercel",
    ],
    link: {
      label: "View Live Site",
      href: "https://cncrouterpromotions.industrialcnc.com/",
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
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}
