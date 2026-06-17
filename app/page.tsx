import { RivaLogo } from "@/components/riva-logo";
import { VideoBackground } from "@/components/video-background";
import { WaitlistForm } from "@/components/waitlist-form";

export default function HomePage() {
  return (
    <div className="landing">
      <VideoBackground />
      <main className="page">
        <header className="hero">
          <RivaLogo size={72} priority />
          <h1>Riva Fitness</h1>
          <p className="tagline">Train smarter. Explore Cyprus. Move together.</p>
          <p className="lead">
            Record workouts, discover routes on the map, climb leaderboards, and
            connect your Strava account to import your saved routes — built for
            athletes in Cyprus.
          </p>
        </header>

        <WaitlistForm />

        <section className="card">
          <h2 style={{ margin: "0 0 12px", fontSize: "1.05rem" }}>
            Early access includes
          </h2>
          <ul className="bullets">
            <li>First invite when Riva Fitness launches on iOS</li>
            <li>Route maps, live recording, and explore for Cyprus</li>
            <li>Leaderboards, challenges, and social features</li>
            <li>Launch updates and beta access details</li>
          </ul>
        </section>

        <footer className="footer">
          <p>
            <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms</a>
          </p>
          <p>© {new Date().getFullYear()} Riva Fitness</p>
        </footer>
      </main>
    </div>
  );
}
