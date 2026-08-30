import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button, Label, Reveal, Section } from "@/components/ui";
import { ABOUT } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "We're building the supply side of physical intelligence — capture operations inside real workplaces, owned end to end.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow={ABOUT.eyebrow} headline={ABOUT.headline} />

      <Section tone="paper">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <Label index="01" className="md:sticky md:top-28 md:self-start">
            The long version
          </Label>
          <div className="space-y-7">
            {ABOUT.body.map((p, i) => (
              <Reveal key={p} delay={i * 0.05}>
                <p className="max-w-2xl text-lg leading-relaxed text-ink/70 first:text-xl first:text-ink first:md:text-2xl first:md:leading-snug first:md:tracking-[-0.02em]">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="ink">
        <Label index="02" className="text-paper">
          {ABOUT.principles.label}
        </Label>
        <div className="mt-14 grid gap-px bg-paper/10 md:grid-cols-2">
          {ABOUT.principles.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07} className="bg-ink">
              <div className="flex h-full flex-col p-8 md:p-10">
                <span className="u-label text-paper/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-didone text-[1.75rem] leading-[1.04] tracking-[-0.01em] mt-8">
                  {item.title}
                </h3>
                <p className="mt-4 leading-relaxed text-paper/60">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="warm">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <Label index="03">{ABOUT.where.label}</Label>
            <Reveal>
              <p className="font-didone text-[clamp(2rem,3.4vw,3.1rem)] leading-[0.96] tracking-[-0.015em] mt-8 max-w-[16ch] text-balance">
                {ABOUT.where.body}
              </p>
            </Reveal>
          </div>
          <div className="flex flex-col justify-end gap-8">
            <Reveal delay={0.1}>
              <p className="max-w-md text-lg leading-relaxed text-ink/60">
                {ABOUT.careers}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="flex flex-wrap gap-3">
                {ABOUT.ctas.map((cta, i) => (
                  <Button
                    key={cta.href}
                    href={cta.href}
                    variant={i === 0 ? "accent" : "ghost"}
                  >
                    {cta.label}
                  </Button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
