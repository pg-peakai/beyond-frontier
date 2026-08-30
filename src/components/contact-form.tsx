"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import { CONTACT } from "@/content/site";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full border-b border-ink/20 bg-transparent py-4 text-lg tracking-[-0.01em] outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-signal";

export function ContactForm({ defaultIntent }: { defaultIntent?: string }) {
  const [intent, setIntent] = useState(
    CONTACT.intents.some((i) => i.value === defaultIntent)
      ? (defaultIntent as string)
      : CONTACT.intents[0].value,
  );
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, intent }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-ink/15 p-10"
        >
          <p className="u-label text-signal">Received</p>
          <p className="font-didone mt-5 text-[1.75rem] leading-[1.04] tracking-[-0.01em]">
            Thanks — we&apos;ll come back with a capture plan.
          </p>
          <p className="mt-3 text-ink/60">
            Expect a reply within two working days.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-8 text-sm text-ink/50 underline underline-offset-4 hover:text-ink"
          >
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-10"
        >
          <fieldset>
            <legend className="u-label text-ink/45">I&apos;m here to</legend>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {CONTACT.intents.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setIntent(option.value)}
                  aria-pressed={intent === option.value}
                  className={cn(
                    "u-label border px-5 py-3 text-[0.68rem] tracking-[0.16em] transition-colors duration-300",
                    intent === option.value
                      ? "border-transparent bg-signal text-paper"
                      : "border-ink/25 text-ink/70 hover:border-ink/60",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-8 md:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Your name"
              autoComplete="name"
              className={fieldClass}
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Work email"
              autoComplete="email"
              className={fieldClass}
            />
            <input
              name="organisation"
              placeholder="Organisation"
              autoComplete="organization"
              className={fieldClass}
            />
            <input
              name="hours"
              placeholder="Hours needed (approx.)"
              className={fieldClass}
            />
          </div>

          <textarea
            name="message"
            required
            rows={4}
            placeholder="The task, the hours, and the failure mode you're trying to fix."
            className={cn(fieldClass, "resize-none")}
          />

          {/* honeypot */}
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="pointer-events-none absolute size-0 opacity-0"
          />

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="submit"
              disabled={status === "sending"}
              className="u-label group inline-flex items-center gap-2 border border-transparent bg-signal px-8 py-4 tracking-[0.18em] text-paper transition-colors duration-300 hover:bg-ink disabled:opacity-60"
            >
              {status === "sending" ? "Sending" : "Send it"}
              {status === "sending" ? (
                <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
              ) : (
                <span aria-hidden>&rarr;</span>
              )}
            </button>
            {error && <p className="text-sm text-signal">{error}</p>}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
