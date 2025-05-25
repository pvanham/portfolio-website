// app/teacher-dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { CalendarCheck, Users, ClipboardList, BookOpen } from "lucide-react"; // Example icons

export default async function TeacherDashboardPage() {
  // Await the auth() call to get the resolved authentication state
  const authResult = await auth(); // Store the result first
  const { userId, sessionClaims } = authResult;

  // If no user is signed in, redirect to sign-in
  if (!userId) {
    redirect("/sign-in");
  }

  // Check for the teacher role from publicMetadata
  // Add a type assertion for publicMetadata
  const publicMetadata = sessionClaims?.public_metadata as
    | { role?: string | undefined }
    | undefined;
  const role = publicMetadata?.role;
  //console.log("Teacher Dashboard - Extracted role:", role);

  if (role !== "teacher") {
    // If not a teacher, redirect them.
    console.warn(
      `User ${userId} with role ${role} attempted to access teacher dashboard.`,
    );
    if (role === "owner") redirect("/owner-dashboard");
    else if (role === "client") redirect("/client-portal");
    else redirect("/dashboard"); // Fallback
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100 dark:from-teal-900 dark:to-green-900">
      <header className="bg-background/80 border-border/40 sticky top-0 z-40 border-b shadow-sm backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <CalendarCheck className="text-primary h-6 w-6" />
            <h1 className="text-foreground text-xl font-bold">
              Teacher Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden text-sm sm:inline">
              Hello, {user?.firstName || user?.username || "Teacher"}!
            </span>
            <UserButton /> {/* Corrected UserButton usage */}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-foreground text-3xl font-semibold">
            Your Teaching Hub
          </h2>
          <p className="text-muted-foreground">
            Manage your classes, students, and schedule.
          </p>
        </div>

        {/* Placeholder for content cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card rounded-lg p-6 shadow-lg transition-shadow hover:shadow-xl">
            <ClipboardList className="text-primary mb-3 h-8 w-8" />
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              My Schedule
            </h3>
            <p className="text-muted-foreground text-sm">
              View your upcoming classes and appointments.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg transition-shadow hover:shadow-xl">
            <Users className="text-primary mb-3 h-8 w-8" />
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              Student Attendance
            </h3>
            <p className="text-muted-foreground text-sm">
              Mark attendance for your classes quickly and easily.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg transition-shadow hover:shadow-xl">
            <BookOpen className="text-primary mb-3 h-8 w-8" />
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              Class Resources
            </h3>
            <p className="text-muted-foreground text-sm">
              Access teaching materials and notes for your lessons.
            </p>
          </div>
        </div>
        {/* Add more teacher-specific content and components here */}
      </main>
    </div>
  );
}
