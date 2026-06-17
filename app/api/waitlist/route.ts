import { NextResponse } from "next/server";
import { isValidEmail, subscribeToWaitlist } from "@/lib/klaviyo-subscribe";

export async function POST(request: Request) {
  const privateKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const publicKey =
    process.env.KLAVIYO_PUBLIC_API_KEY ??
    process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY;
  const listId =
    process.env.KLAVIYO_LIST_ID ?? process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID;

  if (!listId?.trim() || (!publicKey?.trim() && !privateKey?.trim())) {
    console.error("Waitlist misconfigured: missing Klaviyo env vars");
    return NextResponse.json(
      { error: "Signups aren't live yet. Check back soon." },
      { status: 503 },
    );
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    await subscribeToWaitlist(email, {
      publicApiKey: publicKey,
      privateApiKey: privateKey,
      listId,
    });
  } catch (error) {
    console.error("Waitlist subscribe failed:", error);
    return NextResponse.json(
      { error: "Could not join the waitlist. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message:
      "You're on the list. We'll email you when Riva Fitness opens early access.",
  });
}
