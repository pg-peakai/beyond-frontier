import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button, Label, Reveal, Section } from "@/components/ui";
import { PARTNERS } from "@/content/site";

export const metadata: Metadata = {
  title: "For partners",
  description:
    "Factories, workshops, construction firms and training institutes: we handle rigs, consent, QC and buyer contracts. You get paid per approved hour delivered.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        eyebrow={PARTNERS.eyebrow}
        headline={PARTNERS.headline}
        intro={PARTNERS.intro}
      />

      <Section tone="paper">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <Label index="01">{PARTNERS.handled.label}</Label>
            <Reveal>
              <h2 className="font-didone text-[clamp(2rem,3.4vw,3.1rem)] leading-[0.96] tracking-[-0.015em] mt-8 max-w-[12ch]">
                You provide access. We do the rest.
              </h2>
            </Reveal>
          </div>
          <ul className="grid gap-px self-start bg-ink/10 sm:grid-cols-2">
            {PARTNERS.handled.items.map((item, i) => (
              <Reveal key={item} delay={i * 0.06} className="bg-paper">
                <li className="flex h-full items-start gap-4 p-7">
                  <span className="u-label pt-1 text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-snug tracking-[-0.02em]">
                    {item}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="ink">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <Label index="02">{PARTNERS.apply.label}</Label>
            <Reveal>
              <h2 className="font-didone text-[clamp(2rem,3.4vw,3.1rem)] leading-[0.96] tracking-[-0.015em] mt-8 max-w-[13ch]">
                Applying takes one sitting.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-[36ch] text-lg leading-relaxed text-paper/70">
                You apply on our partner intake. It opens in a new place, but it
                is the same operation on the other side.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10">
                <Button href={PARTNERS.cta.href} variant="onDark">
                  {PARTNERS.cta.label}
                </Button>
              </div>
            </Reveal>
          </div>
          <ul className="grid gap-px self-start bg-paper/10 sm:grid-cols-2">
            {PARTNERS.apply.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06} className="bg-ink">
                <li className="flex h-full flex-col gap-3 p-7">
                  <span className="u-label text-signal-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg leading-snug tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-paper/60">
                    {item.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="warm" className="py-28 md:py-40">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="font-didone text-[clamp(2rem,3.4vw,3.1rem)] leading-[0.96] tracking-[-0.015em] max-w-[15ch]">
              No disruption to production.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <Button href={PARTNERS.cta.href}>{PARTNERS.cta.label}</Button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
