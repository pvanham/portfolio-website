// src/components/ContactForm.tsx
"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setStatusMessage("Sending your message...");

    // **IMPORTANT:** Replace this with your actual form submission logic.
    // This could be an API call to your backend or a third-party service.
    // Example using Formspree (you'd need to set up a Formspree endpoint):
    //
    // const formData = new FormData(event.currentTarget);
    // try {
    //   const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
    //     method: "POST",
    //     body: formData,
    //     headers: {
    //       'Accept': 'application/json'
    //     }
    //   });
    //   if (response.ok) {
    //     setStatus("success");
    //     setStatusMessage("Your message has been sent successfully!");
    //     setName("");
    //     setEmail("");
    //     setSubject("");
    //     setMessage("");
    //   } else {
    //     const data = await response.json();
    //     setStatus("error");
    //     setStatusMessage(data.errors?.map((e: any) => e.message).join(", ") || "Oops! There was a problem submitting your form.");
    //   }
    // } catch (error) {
    //   setStatus("error");
    //   setStatusMessage("Oops! There was a problem submitting your form.");
    // }

    // Simulate API call for now
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Replace with actual success/error handling based on API response
    const isSuccess = Math.random() > 0.2; // Simulate success/failure
    if (isSuccess) {
      setStatus("success");
      setStatusMessage("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      setStatus("error");
      setStatusMessage(
        "Oops! There was a problem sending your message. Please try again or contact me directly via email.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border space-y-6 rounded-lg border p-6 shadow-sm"
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-sm"
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-sm"
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
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-sm"
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex w-full items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>
      </div>
      {statusMessage && (
        <p
          className={`mt-3 text-sm ${status === "error" ? "text-destructive" : "text-foreground"}`}
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}
