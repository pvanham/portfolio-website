"use client";

/** Contact form with BotID, honeypot, timing check, Zod validation via server action, and success/error feedback. */

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { sendContactEmail, type FormState } from "@/app/actions";
import { CONTACT_PURPOSES } from "@/lib/constants";
import { Loader2 } from "lucide-react";

const initialState: FormState = {
  message: "",
};

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
  const loadedAtRef = useRef<number>(0);

  useEffect(() => {
    loadedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (state.message.includes("successfully")) {
      formRef.current?.reset();
      loadedAtRef.current = Date.now();
    }
  }, [state]);

  const handleSubmit = (formData: FormData) => {
    const elapsed = Date.now() - loadedAtRef.current;
    formData.set("_timing", String(elapsed));
    formAction(formData);
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="border-border bg-background/50 space-y-6 rounded-lg border p-6 shadow-sm"
    >
      {/* Honeypot — invisible to real users, bots will auto-fill */}
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>
        <input
          type="text"
          name="website"
          id="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

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
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-2 px-3 py-2 shadow-sm sm:text-sm"
        />
        {state.fieldErrors?.name && (
          <p id="name-error" className="text-destructive mt-1 text-sm">
            {state.fieldErrors.name}
          </p>
        )}
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
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-2 px-3 py-2 shadow-sm sm:text-sm"
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="text-destructive mt-1 text-sm">
            {state.fieldErrors.email}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="purpose"
          className="text-foreground block text-sm font-medium"
        >
          Purpose of Message
        </label>
        <select
          name="purpose"
          id="purpose"
          required
          defaultValue={state.fields?.purpose ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.purpose)}
          aria-describedby={
            state.fieldErrors?.purpose ? "purpose-error" : undefined
          }
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-2 px-3 py-2 shadow-sm sm:text-sm"
        >
          <option value="" disabled>
            Select a reason for reaching out...
          </option>
          {CONTACT_PURPOSES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {state.fieldErrors?.purpose && (
          <p id="purpose-error" className="text-destructive mt-1 text-sm">
            {state.fieldErrors.purpose}
          </p>
        )}
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
          aria-invalid={Boolean(state.fieldErrors?.subject)}
          aria-describedby={
            state.fieldErrors?.subject ? "subject-error" : undefined
          }
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-2 px-3 py-2 shadow-sm sm:text-sm"
        />
        {state.fieldErrors?.subject && (
          <p id="subject-error" className="text-destructive mt-1 text-sm">
            {state.fieldErrors.subject}
          </p>
        )}
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
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={
            state.fieldErrors?.message ? "message-error" : undefined
          }
          className="bg-background text-foreground focus:border-primary focus:ring-primary border-input mt-1 block w-full rounded-md border-2 px-3 py-2 shadow-sm sm:text-sm"
        />
        {state.fieldErrors?.message && (
          <p id="message-error" className="text-destructive mt-1 text-sm">
            {state.fieldErrors.message}
          </p>
        )}
      </div>
      <div>
        <SubmitButton />
      </div>
      <div role="alert" aria-live="polite">
        {state.message && (
          <p
            className={`mt-3 text-center text-sm ${state.issues ? "text-destructive" : "text-green-500"}`}
          >
            {state.message}
          </p>
        )}
        {state.issues && (
          <ul className="text-destructive list-inside list-disc space-y-1 text-sm">
            {state.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}
