"use client";

import { FormEvent, useState } from "react";
import { isValidEmail } from "@/lib/klaviyo-subscribe";

type Status = "idle" | "loading" | "success" | "error";

const SUCCESS_MESSAGE =
  "You're on the list. We'll email you when Riva Fitness opens early access.";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const trimmed = email.trim().toLowerCase();
    if (!isValidEmail(trimmed)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Could not join the waitlist. Please try again.",
        );
      }

      setStatus("success");
      setMessage(data.message ?? SUCCESS_MESSAGE);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not join the waitlist. Please try again.",
      );
    }
  }

  return (
    <div className="card">
      <form className="waitlist-form" onSubmit={onSubmit}>
        <label htmlFor="email">Email for early access</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={status === "loading" || status === "success"}
        />
        <button
          className="btn"
          type="submit"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? "Joining…" : "Get early access"}
        </button>
      </form>

      {message ? (
        <p
          className={`message ${status === "success" ? "success" : "error"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
