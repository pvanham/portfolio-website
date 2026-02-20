import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="text-foreground font-bold">Parker Van Ham</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Computer Scientist & Full-Stack Developer
            </p>
          </div>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/parker-van-ham-8545ab220"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/pvanham"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="border-border mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Parker Van Ham
          </p>
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
