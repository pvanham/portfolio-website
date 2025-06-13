// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Bot, Menu, X } from "lucide-react";
import { useChatState } from "@/components/ChatContext";

export default function Navbar() {
  const { toggleChat } = useChatState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/skills", label: "Skills" },
    { href: "/resume", label: "Resume" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-background sticky top-0 z-50 shadow-md">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-foreground hover:text-primary text-xl font-bold transition-colors"
          onClick={closeMenu}
        >
          Parker Van Ham
        </Link>

        {/* Desktop Navigation Links - Hidden on small screens */}
        <nav className="hidden space-x-4 text-sm font-medium sm:flex sm:text-base">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right-side Icons */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleChat}
            className="text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Toggle AI Chatbot"
          >
            <Bot size={24} />
          </button>

          {/* Hamburger Menu Button - Only visible on small screens */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground focus:ring-ring rounded-md p-2 focus:ring-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Conditionally rendered */}
        {isMenuOpen && (
          <nav className="mt-2 flex w-full flex-col items-start space-y-2 sm:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary hover:bg-accent w-full rounded-md p-2 transition-colors"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
