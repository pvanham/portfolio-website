// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define routes that are public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  "/", // Your homepage
  "/sign-in(.*)", // Matches /sign-in and /sign-in/*
  "/sign-up(.*)", // Matches /sign-up and /sign-up/*
  "/api/webhooks(.*)", // Example for public API routes like webhooks
  // Add any other public pages, like /about, /contact, etc.
]);

// Define routes that are part of the authentication flow
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// Define your role-specific dashboard paths
const dashboardRedirects: Record<string, string> = {
  owner: "/owner-dashboard",
  teacher: "/teacher-dashboard",
  client: "/client-portal",
};

// Make the handler function async to use await
export default clerkMiddleware(async (auth, req) => {
  // Call the auth() function passed by clerkMiddleware and await its result
  // This should provide the object containing userId, sessionClaims, etc.
  const authResult = await auth(); // Store the result first
  // console.log(
  //   "Middleware - Raw Auth Result:",
  //   JSON.stringify(authResult, null, 2),
  // ); // Log the whole auth object
  const { userId, sessionClaims } = authResult;
  // console.log(
  //   "Middleware - Raw sessionClaims:",
  //   JSON.stringify(sessionClaims, null, 2),
  // ); // Log just sessionClaims

  const currentPath = req.nextUrl.pathname;

  // Safely access publicMetadata and then role with a type assertion
  // This tells TypeScript: "If publicMetadata exists, treat it as an object
  // that might have a 'role' property of type string."
  const publicMetadata = sessionClaims?.public_metadata as
    | { role?: string | undefined }
    | undefined;
  const role = publicMetadata?.role;
  //console.log("Middleware - Extracted role:", role);

  // 1. If the user is signed in and trying to access an auth route (e.g., /sign-in)
  if (userId && isAuthRoute(req)) {
    const redirectUrl =
      role && dashboardRedirects[role]
        ? dashboardRedirects[role]
        : "/dashboard";
    console.log(
      `Middleware: User ${userId} on auth route ${currentPath}, redirecting to ${redirectUrl}`,
    );
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // 2. If the route is not public and the user is not signed in, redirect to sign-in
  if (!isPublicRoute(req) && !userId) {
    console.log(
      `Middleware: User not signed in, accessing private route ${currentPath}. Redirecting to sign-in.`,
    );
    // Construct the sign-in URL, ensuring NEXT_PUBLIC_CLERK_SIGN_IN_URL is set
    const signInUrlString =
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
    const signInUrl = new URL(signInUrlString, req.url);
    signInUrl.searchParams.set("redirect_url", req.nextUrl.href); // Pass the full URL to return to
    return NextResponse.redirect(signInUrl);
  }

  // 3. If the user is signed in and on the generic /dashboard, redirect them based on role
  // This handles the NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL and NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
  if (userId && currentPath === "/dashboard") {
    if (role && dashboardRedirects[role]) {
      console.log(
        `Middleware: User ${userId} on /dashboard with role ${role}, redirecting to ${dashboardRedirects[role]}`,
      );
      return NextResponse.redirect(new URL(dashboardRedirects[role], req.url));
    }
    console.log(
      `Middleware: User ${userId} on /dashboard, no specific role redirect. Path: ${currentPath}`,
    );
  }

  // 4. If the user is signed in, has a role, but is on the wrong dashboard, redirect them (optional enhancement)
  if (userId) {
    const userSpecificDashboard = role ? dashboardRedirects[role] : undefined;

    if (userSpecificDashboard && currentPath !== userSpecificDashboard) {
      const isAnotherDashboardPath =
        Object.values(dashboardRedirects).includes(currentPath);
      if (isAnotherDashboardPath) {
        console.log(
          `Middleware: User ${userId} (role: ${role}) on wrong dashboard ${currentPath}, redirecting to ${userSpecificDashboard}`,
        );
        return NextResponse.redirect(new URL(userSpecificDashboard, req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
