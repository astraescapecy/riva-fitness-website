import type { Metadata } from "next";
import Link from "next/link";
import { RivaLogo } from "@/components/riva-logo";

export const metadata: Metadata = {
  title: "Terms of Service — Riva Fitness",
};

export default function TermsPage() {
  return (
    <main className="page">
      <Link href="/" className="back">
        ← Back
      </Link>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <RivaLogo size={56} />
      </div>
      <h1>Terms of Service</h1>
      <p className="muted">Last updated: June 2026</p>

      <article className="card prose">
        <p>
          By using Riva Fitness or joining the waitlist, you agree to these terms
          and our Privacy Policy.
        </p>

        <h2>Early access</h2>
        <p>
          Waitlist signups do not guarantee access. We may invite users in
          batches during beta and launch.
        </p>

        <h2>App use</h2>
        <p>
          You are responsible for your account and for using the app safely —
          especially when recording activities outdoors. Follow local laws and
          traffic rules.
        </p>

        <h2>Third-party services</h2>
        <p>
          Optional integrations (such as Strava) are subject to those
          providers&apos; terms. Riva Fitness is not affiliated with or endorsed
          by Strava.
        </p>

        <h2>Contact</h2>
        <p>
          <a href="mailto:support@riva.fitness">support@riva.fitness</a>
        </p>
      </article>
    </main>
  );
}
