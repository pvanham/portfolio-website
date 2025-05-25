// src/app/page.tsx
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { Metadata } from "next";
import me from "@/assets/IMG_0689.jpg"; // Your profile picture
import { Bot, ArrowRight, Download, MessageSquare } from "lucide-react"; // Icons

export const metadata: Metadata = {
  // Updated title to be more descriptive
  title: "Parker Van Ham - Computer Scientist & Full-Stack Developer",
  description:
    "Welcome to Parker Van Ham's portfolio. Explore projects, skills, and get in touch.",
};

export default function Home() {
  return (
    // Main container with background image and padding
    <section className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat px-4 py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto space-y-20 md:space-y-28">
        {/* Hero Section */}
        <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Text content on the left */}
          <div className="space-y-6 text-center md:text-left">
            <H1 className="font-extrabold tracking-tight">
              Hi, I&apos;m Parker 👋
            </H1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Driven by a passion for developing innovative software solutions,
              I am a Computer Science student at WPI (graduating Aug 2025) with
              a strong foundation in full-stack development and a variety of
              programming languages. Actively working to learn more about AI,
              machine learning, and their applications; I am eager to apply my
              skills to real-world challenges and contribute to impactful
              projects.
            </p>
            {/* Call-to-action buttons moved here for better flow */}
            <div className="flex flex-col justify-center space-y-3 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:justify-start">
              <Link
                href="/projects"
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                View My Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/resume"
                className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex items-center justify-center rounded-lg border px-6 py-3 text-base font-semibold shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                My Resume
                <Download className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Image on the right */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <Image
                src={me}
                alt="A photo of me"
                height={320} // Slightly increased size
                width={320} // Slightly increased size
                className="border-primary/50 aspect-square rounded-full border-4 object-cover shadow-xl" // Enhanced border
                priority // Load image faster as it's LCP
              />
              {/* Decorative element behind image */}
              <div className="bg-secondary/30 absolute -right-4 -bottom-4 -z-10 h-32 w-32 rounded-full md:h-40 md:w-40"></div>
              <div className="bg-accent/30 absolute -top-4 -left-4 -z-10 h-24 w-24 rotate-12 transform rounded-lg md:h-32 md:w-32"></div>
            </div>
          </div>
        </section>

        {/* Chatbot Section - Redesigned for more emphasis */}
        <section className="bg-card/80 rounded-xl p-8 text-center shadow-2xl backdrop-blur-sm md:p-12">
          <div className="mx-auto max-w-2xl">
            <Bot className="text-primary mx-auto mb-4 h-12 w-12" />
            <H2 className="mb-3 font-semibold">
              Ask My AI Chatbot Anything About Me
            </H2>
            <p className="text-muted-foreground md:text-lg">
              Curious about my skills, project details, or experience? Click the{" "}
              <Bot className="inline h-5 w-5 align-text-bottom" /> icon in the
              navigation bar to interact with my AI assistant. It can quickly
              find relevant information from this website and even guide you to
              the right pages.
            </p>
          </div>
        </section>

        {/* "Get In Touch" section as a final CTA, distinct from initial buttons */}
        <section className="py-12 text-center">
          <H2>Ready to Connect?</H2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-lg md:text-xl">
            I&apos;m excited about new opportunities and collaborations.
            Let&apos;s discuss how my skills can contribute to your team or
            project.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-lg px-8 py-3 text-lg font-semibold shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Get In Touch
              <MessageSquare className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
