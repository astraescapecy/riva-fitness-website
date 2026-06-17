import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://riva.fitness"),
  title: "Riva Fitness — Get early access",
  description:
    "Train, explore routes, and connect with athletes in Cyprus. Join the Riva Fitness waitlist for early access on iOS.",
  icons: {
    icon: "/riva-logo.png",
    apple: "/riva-logo.png",
  },
  openGraph: {
    title: "Riva Fitness — Get early access",
    description:
      "Running and fitness for Cyprus. Sign up for early access to the Riva Fitness app.",
    type: "website",
    images: ["/riva-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
