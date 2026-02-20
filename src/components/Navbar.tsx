"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Menu, X } from "lucide-react";
import { useChatState } from "@/components/ChatContext";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { toggleChat } = useChatState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#projects", label: "Projects" },
    { href: "/#skills", label: "Skills" },
    { href: "/#resume", label: "Resume" },
    { href: "/#contact", label: "Contact" },
  ];

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && activeSection === "home";
    const hashFromHref = href.startsWith("/#") ? href.slice(1) : null;
    return (
      pathname === "/" && hashFromHref === `#${activeSection}`
    );
  };

  return (
    <header className="border-border/50 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-foreground hover:text-primary text-xl font-bold transition-colors"
          onClick={closeMenu}
        >
          Parker Van Ham
        </Link>

        <nav className="hidden space-x-4 text-sm font-medium sm:flex sm:text-base">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors",
                isActive(link.href)
                  ? "text-primary border-primary border-b-2 pb-0.5 font-semibold"
                  : "text-foreground hover:text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleChat}
            className="text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Toggle AI Chatbot"
          >
            <Bot size={24} />
          </button>

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

        {isMenuOpen && (
          <nav className="mt-2 flex w-full flex-col items-start space-y-2 sm:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "w-full rounded-md p-2 transition-colors",
                  isActive(link.href)
                    ? "bg-accent text-primary font-semibold"
                    : "text-foreground hover:text-primary hover:bg-accent",
                )}
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
