import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Parker Van Ham",
  description:
    "Get in touch with Parker Van Ham. Discuss opportunities, projects, or ideas.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <header className="mb-10 text-center md:mb-12">
        <H1>Get In Touch</H1>
        <p className="text-muted-foreground mt-3 text-lg sm:mt-4 sm:text-xl">
          I&apos;m always open to discussing new opportunities, projects, or
          ideas. Feel free to reach out through any of the channels below or use
          the contact form.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <section className="bg-card border-border rounded-xl border p-6 shadow-sm">
            <H2>My Profiles</H2>
            <p className="text-muted-foreground mt-2">
              Connect with me on various platforms:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2">
              <li>
                <a
                  href="https://www.linkedin.com/in/parker-van-ham-8545ab220"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/pvanham"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://wpi.joinhandshake.com/profiles/bd3v4z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Handshake
                </a>
              </li>
              <li>
                <a
                  href="https://profile.indeed.com/p/parkerv-kpk1504"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Indeed
                </a>
              </li>
            </ul>
          </section>
          <section className="bg-card border-border rounded-xl border p-6 shadow-sm">
            <H2>Direct Contact Information</H2>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Personal Email:</strong>{" "}
                <a
                  href="mailto:parkervanham@gmail.com"
                  className="text-primary hover:underline"
                >
                  parkervanham@gmail.com
                </a>
              </li>
              <li>
                <strong>School Email:</strong>{" "}
                <a
                  href="mailto:prvanham@wpi.edu"
                  className="text-primary hover:underline"
                >
                  prvanham@wpi.edu
                </a>
              </li>
            </ul>
          </section>
        </div>
        <section className="bg-card border-border rounded-xl border p-6 shadow-sm">
          <H2 className="text-center">Send Me a Message</H2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
}
