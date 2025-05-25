// app/client-portal/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  UserCircle,
  CalendarDays,
  CreditCard,
  MessageSquare,
} from "lucide-react"; // Example icons

export default async function ClientPortalPage() {
  // Await the auth() call to get the resolved authentication state
  const { userId, sessionClaims } = await auth();

  // If no user is signed in, redirect to sign-in
  if (!userId) {
    redirect("/sign-in");
  }

  // Check for the client role from publicMetadata
  // Add a type assertion for publicMetadata
  const publicMetadata = sessionClaims?.public_metadata as
    | { role?: string | undefined }
    | undefined;
  const role = publicMetadata?.role;

  if (role !== "client") {
    // If not a client, redirect them.
    console.warn(
      `User ${userId} with role ${role} attempted to access client portal.`,
    );
    if (role === "owner") redirect("/owner-dashboard");
    else if (role === "teacher") redirect("/teacher-dashboard");
    else redirect("/dashboard"); // Fallback
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-900 dark:to-purple-900">
      <header className="bg-background/80 border-border/40 sticky top-0 z-40 border-b shadow-sm backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <UserCircle className="text-primary h-6 w-6" />
            <h1 className="text-foreground text-xl font-bold">Client Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden text-sm sm:inline">
              Hi, {user?.firstName || user?.username || "Client"}!
            </span>
            <UserButton /> {/* Corrected UserButton usage */}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-foreground text-3xl font-semibold">
            Your Account
          </h2>
          <p className="text-muted-foreground">
            Manage your enrollments, payments, and profile.
          </p>
        </div>

        {/* Placeholder for content cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card rounded-lg p-6 shadow-lg transition-shadow hover:shadow-xl">
            <CalendarDays className="text-primary mb-3 h-8 w-8" />
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              My Enrollments
            </h3>
            <p className="text-muted-foreground text-sm">
              View and manage your class registrations and schedule.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg transition-shadow hover:shadow-xl">
            <CreditCard className="text-primary mb-3 h-8 w-8" />
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              Billing & Payments
            </h3>
            <p className="text-muted-foreground text-sm">
              View invoices, make payments, and update payment methods.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg transition-shadow hover:shadow-xl">
            <MessageSquare className="text-primary mb-3 h-8 w-8" />
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              Messages
            </h3>
            <p className="text-muted-foreground text-sm">
              Check for updates and communicate with the studio.
            </p>
          </div>
        </div>
        {/* Add more client-specific content and components here */}
      </main>
    </div>
  );
}
