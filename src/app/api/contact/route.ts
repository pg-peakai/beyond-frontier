import { NextResponse } from "next/server";

type Payload = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields, humans don't.
  if (str(body.company_website)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look right." },
      { status: 400 },
    );
  }

  const enquiry = {
    name,
    email,
    organisation: str(body.organisation),
    hours: str(body.hours),
    intent: str(body.intent) || "other",
    message,
    receivedAt: new Date().toISOString(),
  };

  // TODO: replace with the real sink — Resend / HubSpot / Slack webhook / DB.
  // Kept as a log so the form is wired end to end in the draft.
  console.info("[contact] enquiry", enquiry);

  return NextResponse.json({ ok: true });
}
