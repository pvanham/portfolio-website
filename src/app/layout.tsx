/** Root layout — sets fonts, metadata, and global shell (Navbar, ChatbotUI, Footer). */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChatStateProvider>
          <Navbar />
          <main>{children}</main>
          <ChatbotUI />
          <Footer />
        </ChatStateProvider>
      </body>
    </html>
  );
}
