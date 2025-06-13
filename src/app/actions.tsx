// src/app/actions.tsx
"use server";

import { z } from "zod";
import { Resend } from "resend";
import ContactEmail from "@/components/email/ContactEmail";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the schema for form data validation
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function sendContactEmail(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Validate form data against the schema
  const result = contactSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  // If validation fails, return error messages
  if (!result.success) {
    return {
      message: "Invalid form data.",
      issues: result.error.issues.map((issue) => issue.message),
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }

  const { name, email, subject, message } = result.data;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Can be this default for now
      to: ["parkervanham@gmail.com"],
      subject: `New Message from Portfolio: ${subject}`,
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
