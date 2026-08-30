import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button, Label, Reveal, Section } from "@/components/ui";
import { BUYERS } from "@/content/site";

export const metadata: Metadata = {
  title: "For buyers",
  description:
    "Three capture tiers — egocentric video, synchronized IMU, multi-view stereo — priced per approved hour, with a pilot batch before scale.",
};

export default function BuyersPage() {
  return (
    <>
      <PageHeader
        eyebrow={BUYERS.eyebrow}
        headline={BUYERS.headline}
        intro={BUYERS.intro}
      />

      {/* ------------------------------------------------------------ tiers */}
      <Section tone="paper">
        <Label index="01">{BUYERS.tiers.label}</Label>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {BUYERS.tiers.items.map((tier, i) => (
            <Reveal key={tier.tier} delay={i * 0.08}>
              <article
                className={`flex h-full flex-col border p-8 transition-colors duration-500 ${
                  i === 2
                    ? "border-transparent bg-ink text-paper"
                    : "border-ink/15 bg-transparent hover:border-ink/40"
                }`}
              >
                <p className="u-label opacity-45">{tier.tier}</p>
                <h2 className="font-didone text-[1.75rem] leading-[1.04] tracking-[-0.01em] mt-6">
                  {tier.title}
                </h2>
                <p className="mt-4 leading-relaxed opacity-65">{tier.body}</p>
                <ul className="mt-8 space-y-3 border-t border-current/12 pt-8">
                  {tier.specs.map((spec) => (
                    <li key={spec} className="flex items-start gap-3 text-sm">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${i === 2 ? "text-signal-soft" : "text-signal"}`}
                        strokeWidth={2}
                      />
                      <span className="opacity-80">{spec}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ terms */}
      <Section tone="warm">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <Label index="02">{BUYERS.terms.label}</Label>
            <Reveal>
              <h2 className="font-didone text-[clamp(2rem,3.4vw,3.1rem)] leading-[0.96] tracking-[-0.015em] mt-8 max-w-[12ch]">
                You pay for approved hours.
              </h2>
            </Reveal>
          </div>
          <ul className="border-t border-ink/10">
            {BUYERS.terms.items.map((item, i) => (
              <Reveal key={item} delay={i * 0.06}>
                <li className="flex items-start gap-6 border-b border-ink/10 py-6">
                  <span className="u-label pt-1 text-ink/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-snug tracking-[-0.01em]">
                    {item}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ------------------------------------------------------ scale + cta */}
      <Section tone="ink">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Label index="03" className="text-paper">
              {BUYERS.scale.label}
            </Label>
            <Reveal>
              <p className="font-didone text-[clamp(2rem,3.4vw,3.1rem)] leading-[0.96] tracking-[-0.015em] mt-8 max-w-[20ch] text-balance">
                {BUYERS.scale.body}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <Button href={BUYERS.cta.href} variant="onDark">
              {BUYERS.cta.label}
            </Button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
