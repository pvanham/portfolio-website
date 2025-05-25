// app/owner-dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs"; // UserButton is a client component but can be used in Server Components
import { LayoutDashboard, Users, BarChart3, Settings } from "lucide-react"; // Example icons

export default async function OwnerDashboardPage() {
  // Await the auth() call to get the resolved authentication state
  const { userId, sessionClaims } = await auth(); // Get auth info from the session

  // If no user is signed in, redirect to sign-in
  if (!userId) {
    redirect("/sign-in");
  }

  // Check for the owner role from publicMetadata
  // Add a type assertion for publicMetadata
  const publicMetadata = sessionClaims?.public_metadata as
    | { role?: string | undefined }
    | undefined;
  const role = publicMetadata?.role;

  if (role !== "owner") {
    // If not an owner, redirect them.
    // Your middleware should also handle this, but this is an explicit server-side check.
    console.warn(
      `User ${userId} with role ${role} attempted to access owner dashboard.`,
    );
    if (role === "teacher") redirect("/teacher-dashboard");
    else if (role === "client") redirect("/client-portal");
    else redirect("/dashboard"); // Fallback to generic dashboard
  }

  const user = await currentUser(); // Get full user details

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-900">
      <header className="bg-background/80 border-border/40 sticky top-0 z-40 border-b shadow-sm backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-primary h-6 w-6" />
            <h1 className="text-foreground text-xl font-bold">
              Owner Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden text-sm sm:inline">
              Welcome, {user?.firstName || user?.username || "Owner"}!
            </span>
            {/* Removed signOutOptions prop. Sign-out redirect will use global Clerk config (e.g., NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL) */}
            <UserButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-foreground text-3xl font-semibold">
            Studio Overview
          </h2>
          <p className="text-muted-foreground">
            Manage your studio, staff, clients, and see insights.
          </p>
        </div>

        {/* Placeholder for content cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card rounded-lg p-6 shadow-lg transition-shadow hover:shadow-xl">
            <Users className="text-primary mb-3 h-8 w-8" />
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              Manage Users
            </h3>
            <p className="text-muted-foreground text-sm">
              Oversee clients, teachers, and other staff members.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg transition-shadow hover:shadow-xl">
            <BarChart3 className="text-primary mb-3 h-8 w-8" />
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              View Reports
            </h3>
            <p className="text-muted-foreground text-sm">
              Access financial statements, attendance records, and growth
              metrics.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg transition-shadow hover:shadow-xl">
            <Settings className="text-primary mb-3 h-8 w-8" />
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              Studio Settings
            </h3>
            <p className="text-muted-foreground text-sm">
              Configure payment gateways, branding, and operational parameters.
            </p>
          </div>
        </div>
        {/* Add more owner-specific content and components here */}
      </main>
    </div>
  );
}
