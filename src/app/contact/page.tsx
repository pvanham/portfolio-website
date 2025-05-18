import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to get in touch with me.",
};

export default function Page() {
  return (
    <section className="space-y-6">
      <H1>Get In Touch</H1>
      <section className="space-y-3">
        <p>
          I&apos;m always open to discussing new opportunities, projects, or
          ideas. Feel free to reach out through any of the channels below. I am
          also currently seeking full-time employment in software engineering or
          related fields. I am especially interested in anything involving AI
          and machine learning.
        </p>
        <p>Links to my accounts:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <a
              href="https://www.youtube.com/codinginflow?sub_confirmation=1"
              className="text-primary hover:underline"
            >
              Linked-In
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/codinginflow"
              className="text-primary hover:underline"
            >
              Github
            </a>
          </li>
          <li>
            <a
              href="https://www.tiktok.com/@codinginflow"
              className="text-primary hover:underline"
            >
              Handshake
            </a>
          </li>
          <li>
            <a
              href="https://www.tiktok.com/@codinginflow"
              className="text-primary hover:underline"
            >
              Indeed
            </a>
          </li>
        </ul>
        <hr className="border-muted" />
      </section>
      <section className="space-y-3">
        <H2>Contact Information</H2>
        <ul className="list-inside list-disc space-y-1">
          <li>Personal email: parkervanham@gmail.com</li>
          <li>School email: prvanham@wpi.edu</li>
          <li>Address: 6 Hemlock rd Bow, NH USA</li>
          <li>Phone: 603-738-1695</li>
        </ul>
        <hr className="border-muted" />
      </section>
    </section>
  );
}
