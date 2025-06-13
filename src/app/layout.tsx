import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ChatStateProvider } from "@/components/ChatContext";
import ChatbotUI from "@/components/ChatbotUI";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Parker Van Ham",
    default: "Parker Van Ham - Computer Scientist & Full-Stack Developer",
  },
  description:
    "The professional portfolio of Parker Van Ham, a Computer Science student at WPI specializing in full-stack development and AI. Explore projects, skills, and get in touch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <ChatStateProvider>
            {" "}
            {/* Wrap components that need chat state */}
            <Navbar /> {/* Navbar will now use the context */}
            <main className="mx-auto max-w-4xl px-3 py-10">{children}</main>
            <ChatbotUI /> {/* ChatbotUI will also use the context */}
            <Footer />
          </ChatStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
