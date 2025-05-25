// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import {
  SignedIn,
  SignedOut,
  UserButton, // For signed-in users to manage their account/sign out
  SignInButton, // Simple button to trigger sign-in modal
  SignUpButton, // Simple button to trigger sign-up modal
  useUser, // Hook to access user information, including roles
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const role = isSignedIn
    ? (user?.publicMetadata?.role as string | undefined)
    : undefined;

  // Define navigation links for different states/roles
  const commonLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const ownerLinks = [
    { href: "/owner-dashboard", label: "Owner Dashboard" },
    { href: "/manage-classes", label: "Classes" },
    { href: "/manage-staff", label: "Staff" },
    { href: "/reports", label: "Reports" },
  ];

  const teacherLinks = [
    { href: "/teacher-dashboard", label: "Teacher Dashboard" },
    { href: "/my-schedule", label: "My Schedule" },
    { href: "/attendance", label: "Attendance" },
  ];

  const clientLinks = [
    { href: "/client-portal", label: "Client Portal" },
    { href: "/my-enrollments", label: "My Enrollments" },
    { href: "/make-payment", label: "Payments" },
  ];

  let currentNavLinks: { href: string; label: string }[] = [];

  if (isSignedIn) {
    if (role === "owner") {
      currentNavLinks = ownerLinks;
    } else if (role === "teacher") {
      currentNavLinks = teacherLinks;
    } else if (role === "client") {
      currentNavLinks = clientLinks;
    } else {
      // Fallback for signed-in users with no specific role or an unknown role
      // You might want a generic dashboard link here or just common links
      currentNavLinks = [{ href: "/dashboard", label: "Dashboard" }];
    }
  } else {
    currentNavLinks = commonLinks;
  }

  return (
    <header className="bg-background/80 border-border/40 sticky top-0 z-50 border-b shadow-md backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-primary text-2xl font-bold transition-opacity hover:opacity-80"
          aria-label="Tabixell Home"
        >
          Tabixell
        </Link>

        <nav className="hidden items-center space-x-4 text-sm font-medium sm:text-base md:flex">
          {currentNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary rounded-md px-2 py-1 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button - Placeholder for future implementation */}
        {/* <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div> */}

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="default" size="sm">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8", // Example to make avatar smaller
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
      {/* Mobile Menu - Placeholder for future implementation */}
      {/* <div className="md:hidden border-t border-border/40">
        <nav className="flex flex-col space-y-1 p-4">
          {currentNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-base"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div> */}
    </header>
  );
}
