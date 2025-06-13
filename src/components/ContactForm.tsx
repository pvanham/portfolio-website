// src/components/ContactForm.tsx
"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendContactEmail, FormState } from "@/app/actions";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

const initialState: FormState = {
  message: "",
};

// A separate component for the submit button to use the useFormStatus hook
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex w-full items-center justify-center rounded-lg border border-transparent px-6 py-3 text-base font-medium shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
        </>
      ) : (
        "Send Message"
      )}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(sendContactEmail, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Reset form fields on successful submission
    if (state.message.includes("successfully")) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border-border bg-background/50 space-y-6 rounded-lg border p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="name"
          className="text-foreground block text-sm font-medium"
        >
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={state.fields?.name}
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-2 px-3 py-2 shadow-sm sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="text-foreground block text-sm font-medium"
        >
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          defaultValue={state.fields?.email}
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-2 px-3 py-2 shadow-sm sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="subject"
          className="text-foreground block text-sm font-medium"
        >
          Subject
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          required
          defaultValue={state.fields?.subject}
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-2 px-3 py-2 shadow-sm sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="text-foreground block text-sm font-medium"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          required
          defaultValue={state.fields?.message}
          className="bg-background text-foreground focus:border-primary focus:ring-primary border-input mt-1 block w-full rounded-md border-2 px-3 py-2 shadow-sm sm:text-sm"
        />
      </div>
      <div>
        <SubmitButton />
      </div>
      {/* Display form state messages */}
      {state.message && (
        <p
          className={`mt-3 text-center text-sm ${state.issues ? "text-destructive" : "text-green-600 dark:text-green-500"}`}
        >
          {state.message}
        </p>
      )}
      {/* Display validation issues */}
      {state.issues && (
        <ul className="text-destructive list-inside list-disc space-y-1 text-sm">
          {state.issues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
