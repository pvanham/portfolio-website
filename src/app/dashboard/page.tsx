// app/dashboard/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react"; // Using lucide-react for a loading spinner

// Define your role-specific dashboard paths here as well for client-side consistency
// This should match the 'dashboardRedirects' in your middleware.ts
const roleDashboardPaths: Record<string, string> = {
  owner: "/owner-dashboard",
  teacher: "/teacher-dashboard",
  client: "/client-portal",
};

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything until Clerk is loaded
    if (!isLoaded) {
      return;
    }

    // If the user is signed in, attempt to redirect based on role
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role as string | undefined;
      const targetPath = role ? roleDashboardPaths[role] : undefined;

      if (targetPath) {
        router.replace(targetPath); // Use replace to avoid adding /dashboard to history
      } else {
        // Fallback for signed-in users with no specific/mapped role
        // This could be a generic authenticated user page or an error/info page
        // For now, we'll log it. Your middleware should ideally prevent this.
        console.warn(
          "User is signed in but has no mapped role or is already on /dashboard without further redirect.",
        );
        // router.replace('/user-profile'); // Example: redirect to a generic profile page
      }
    } else if (isLoaded && !isSignedIn) {
      // If Clerk is loaded but the user is not signed in, redirect to sign-in page
      // This should also be handled by middleware, but acts as a client-side fallback.
      router.replace("/sign-in");
    }
  }, [user, isLoaded, isSignedIn, router]);

  // Display a loading indicator while Clerk is loading or redirection is happening
  return (
    <div className="from-background dark:from-background flex min-h-screen flex-col items-center justify-center bg-gradient-to-br via-purple-50/20 to-indigo-50/20 p-4 text-center dark:via-purple-900/10 dark:to-indigo-900/10">
      <Loader2 className="text-primary mb-6 h-12 w-12 animate-spin" />
      <h1 className="text-foreground mb-2 text-2xl font-semibold">
        Loading Your Dashboard...
      </h1>
      <p className="text-muted-foreground">
        Please wait while we prepare your personalized experience.
      </p>
      {/* You could add a subtle branding element here if desired */}
    </div>
  );
}
