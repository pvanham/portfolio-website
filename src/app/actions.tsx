// src/app/actions.tsx
"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { Resend } from "resend";
import ContactEmail from "@/components/email/ContactEmail";
import { CONTACT_PURPOSES } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  purpose: z.enum(CONTACT_PURPOSES, {
    errorMap: () => ({ message: "Please select a purpose for your message." }),
  }),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

// ── Spam-detection helpers ──────────────────────────────────────────

const SPAM_KEYWORDS = [
  "seo service",
  "seo optimization",
  "search engine optimization",
  "rank your website",
  "rank your site",
  "first page of google",
  "page 1 of google",
  "top of google",
  "google ranking",
  "link building",
  "backlink",
  "buy traffic",
  "web traffic",
  "guaranteed traffic",
  "boost your traffic",
  "digital marketing service",
  "marketing agency",
  "social media marketing",
  "smm service",
  "email marketing service",
  "email blast",
  "bulk email",
  "lead generation service",
  "generate leads",
  "guaranteed leads",
  "crypto invest",
  "bitcoin invest",
  "forex trading",
  "binary option",
  "casino",
  "gambling",
  "cheap web design",
  "affordable web design",
  "website redesign offer",
  "we noticed your website",
  "i visited your website",
  "i came across your site",
  "i found your site",
  "we can help your business",
  "grow your business online",
  "increase your sales",
  "increase your revenue",
  "boost your online presence",
  "virtual assistant service",
  "outsource",
  "offshore team",
  "white label",
  "unsubscribe",
  "opt out",
  "click here to stop",
  "remove from list",
];

function isSpamContent(subject: string, message: string): boolean {
  const combined = `${subject} ${message}`.toLowerCase();
  return SPAM_KEYWORDS.some((keyword) => combined.includes(keyword));
}

const MIN_SUBMIT_TIME_MS = 3_000;

// In-memory sliding-window rate limiter (per IP, 3 submissions / 10 min)
const submissions = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissions.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );

  if (timestamps.length >= RATE_MAX) {
    submissions.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  submissions.set(ip, timestamps);
  return false;
}

// ── Main action ─────────────────────────────────────────────────────

export async function sendContactEmail(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >;

  // 1. Honeypot — bots fill this hidden field, real users never see it
  if (fields.website) {
    // Silently "succeed" so the bot doesn't know it was caught
    return { message: "Your message has been sent successfully!" };
  }

  // 2. Timing check — real humans take more than 3 seconds to fill a form
  const elapsed = Number(fields._timing ?? 0);
  if (elapsed > 0 && elapsed < MIN_SUBMIT_TIME_MS) {
    return { message: "Your message has been sent successfully!" };
  }

  // 3. In-memory rate limiting (per IP, 3 submissions per 10 min window)
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return {
      message:
        "You've sent too many messages recently. Please try again later.",
    };
  }

  // 4. Schema validation
  const result = contactSchema.safeParse(fields);

  if (!result.success) {
    return {
      message: "Invalid form data.",
      issues: result.error.issues.map((issue) => issue.message),
      fields,
    };
  }

  const { name, email, purpose, subject, message } = result.data;

  // 5. Keyword-based spam filter
  if (isSpamContent(subject, message)) {
    console.warn(`Spam blocked from ${email}: "${subject}"`);
    return { message: "Your message has been sent successfully!" };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["parkervanham@gmail.com"],
      subject: `[${purpose}] ${subject}`,
      replyTo: email,
      react: (
        <ContactEmail
          name={name}
          email={email}
          subject={subject}
          message={message}
        />
      ),
    });

    if (error) {
      console.error("Resend error:", error);
      return { message: "Error sending email. Please try again later." };
    }

    return { message: "Your message has been sent successfully!" };
  } catch (e) {
    console.error("Catch error:", e);
    return { message: "An unexpected error occurred. Please try again." };
  }
}
