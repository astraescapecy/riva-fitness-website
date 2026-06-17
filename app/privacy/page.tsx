import type { Metadata } from "next";
import Link from "next/link";
import { RivaLogo } from "@/components/riva-logo";

export const metadata: Metadata = {
  title: "Privacy Policy — Riva Fitness",
};

export default function PrivacyPage() {
  return (
    <main className="page">
      <Link href="/" className="back">
        ← Back
      </Link>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <RivaLogo size={56} />
      </div>
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: June 2026</p>

      <article className="card prose">
        <p>
          Riva Fitness (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a
          fitness app for recording activities, exploring routes, and connecting
          with athletes. This policy explains what we collect and why.
        </p>

        <h2>Waitlist</h2>
        <p>
          When you join the early-access waitlist, we collect your email address
          via Klaviyo to send launch updates and invitations. You can unsubscribe
          at any time.
        </p>

        <h2>What we collect (app)</h2>
        <ul>
          <li>Account and profile information you provide</li>
          <li>Location and activity data when you record workouts</li>
          <li>Optional Strava connection data (your own routes only)</li>
          <li>Device tokens for notifications, if enabled</li>
        </ul>

        <h2>How we use data</h2>
        <p>
          We use your data to operate the app, show your activities and routes,
          power social features you opt into, and improve Riva Fitness. We do not
          sell your personal data.
        </p>

        <h2>Contact</h2>
        <p>
          Questions:{" "}
          <a href="mailto:support@riva.fitness">support@riva.fitness</a>
        </p>
      </article>
    </main>
  );
}
