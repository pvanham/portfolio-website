// src/components/Navbar.tsx
"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle"; // Assuming ThemeToggle is in the same directory
import { Bot } from "lucide-react";
import { useChatState } from "@/components/ChatContext"; // Import the custom hook

export default function Navbar() {
  const { toggleChat } = useChatState(); // Get toggleChat from context
  return (
    <header className="bg-background sticky top-0 z-50 shadow-md">
      {/* Increased z-index to z-50 and added shadow-md */}
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Used container for consistent width, items-center for vertical alignment, adjusted padding */}
        <nav className="space-x-4 text-sm font-medium sm:text-base">
          {/* Adjusted font size for responsiveness */}
          <Link
            href="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="text-foreground hover:text-primary transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/skills"
            className="text-foreground hover:text-primary transition-colors"
          >
            Skills
          </Link>
          <Link
            href="/resume"
            className="text-foreground hover:text-primary transition-colors"
          >
            Resume
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center">
          {" "}
          {/* Ensured ThemeToggle is vertically aligned if navbar height increases */}
          <ThemeToggle />
          {/* Optional: Add your AI Chatbot toggle icon here as well if it's part of the navbar */}
          <button
            onClick={toggleChat} // Use toggleChat from context
            className="text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-full p-2 focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Toggle AI Chatbot"
          >
            <Bot size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
