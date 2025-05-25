// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Your Studio Name", // Added a placeholder for studio name
  description: "Create an account to manage your dance studio activities.",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-50 to-purple-100 p-4">
      {/* Optional: Add a logo or heading above the sign-up component */}
      {/* <img src="/your-logo.png" alt="Studio Logo" className="mb-8 h-16 w-auto" /> */}
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Join Us!</h1> */}
      <SignUp
        path="/sign-up" // Ensures Clerk knows the base path for this component
        routing="path" // Specifies that Clerk should use path-based routing
        signInUrl="/sign-in" // Provides a link to your sign-in page
        // Example of basic appearance customization:
        // appearance={{
        //   elements: {
        //     formButtonPrimary:
        //       "bg-pink-600 hover:bg-pink-700 text-sm normal-case",
        //     card: "shadow-xl rounded-lg",
        //     headerTitle: "text-2xl font-semibold text-gray-700",
        //     socialButtonsBlockButton: "border-gray-300 hover:bg-gray-100",
        //   },
        // }}
      />
    </main>
  );
}
