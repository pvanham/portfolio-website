// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Your Studio Name", // Added a placeholder for studio name
  description: "Sign in to access your dance studio account.",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 p-4">
      {/* Optional: Add a logo or heading above the sign-in component */}
      {/* <img src="/your-logo.png" alt="Studio Logo" className="mb-8 h-16 w-auto" /> */}
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back!</h1> */}
      <SignIn
        path="/sign-in" // Ensures Clerk knows the base path for this component
        routing="path" // Specifies that Clerk should use path-based routing for multi-step flows
        signUpUrl="/sign-up" // Provides a link to your sign-up page
        // Example of basic appearance customization:
        // appearance={{
        //   elements: {
        //     formButtonPrimary:
        //       "bg-purple-600 hover:bg-purple-700 text-sm normal-case",
        //     card: "shadow-xl rounded-lg",
        //     headerTitle: "text-2xl font-semibold text-gray-700",
        //     socialButtonsBlockButton: "border-gray-300 hover:bg-gray-100",
        //   },
        // }}
      />
    </main>
  );
}
