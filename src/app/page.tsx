import Image from "next/image";
import Link from "next/link";
import { CaptureSite } from "@/components/capture-site";
import { HoverVideo } from "@/components/hover-video";
import { ExperienceDeck } from "@/components/experience-deck";
import { Globe } from "@/components/globe";
import { Hero } from "@/components/hero";
import { Label, Reveal, Section } from "@/components/ui";
import { HOME } from "@/content/site";

const { network, labs } = HOME;


/** Faint resting mark in a labs row, swapped for the image on hover. */
function LabMark({ index }: { index: number }) {
  const paths = [
    "M10 10h20v20H10z M34 34h20v20H34z",
    "M10 54A44 44 0 0 1 54 10v22a22 22 0 0 0-22 22z",
    "M10 10h24v24H10z M30 30h24v24H30z",
    "M32 10a22 22 0 1 1 0 44 22 22 0 0 1 0-44z M34 34h20v20H34z",
  ];
  return (
    <svg viewBox="0 0 64 64" className="size-36 text-ink/[0.06]" aria-hidden>
      <path d={paths[index % paths.length]} fill="currentColor" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* --------------------------------------------------------- network */}
      <Section id="network" tone="ink" className="overflow-hidden">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <Label className="text-paper">{network.label}</Label>
            <h2 className="font-didone mt-9 text-[clamp(2rem,3.4vw,3.1rem)] leading-[0.96] tracking-[-0.015em]">
              <Reveal>
                <span className="block">{network.headline}</span>
              </Reveal>
              <Reveal delay={0.08}>
                <span className="block text-signal-soft italic">
                  {network.headlineAccent}
                </span>
              </Reveal>
            </h2>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-md text-[1.0625rem] leading-relaxed text-paper/70">
                {network.body}
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <Link
                href={network.cta.href}
                className="u-label mt-9 inline-block bg-signal-soft px-8 py-4 tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-paper"
              >
                {network.cta.label} <span aria-hidden>&rarr;</span>
              </Link>
            </Reveal>
          </div>

          <div>
            <Globe />
            <p className="u-label mt-8 text-center text-[0.625rem] tracking-[0.2em] text-paper/55">
              {network.meter}
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------ labs */}
      <Section
        id="labs"
        tone="paper"
        className="bg-[#efeee9] bg-[url(/paper-texture.png)] bg-cover bg-center pb-12 md:pb-[4.5rem]"
      >
        {/* Left inset runs 1.5x the container gutter on this screen. */}
        <div className="pl-2.5 md:pl-5">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-didone text-[clamp(2rem,3.4vw,3.1rem)] leading-[0.96] tracking-[-0.015em]">
              <Reveal>
                <span className="block">{labs.headline}</span>
              </Reveal>
              <Reveal delay={0.08}>
                <span className="block text-signal italic">
                  {labs.headlineAccent}
                </span>
              </Reveal>
            </h2>
            <Reveal delay={0.16}>
              <p className="u-label tracking-[0.2em] text-ink/45">{labs.meter}</p>
            </Reveal>
          </div>

          <div className="mt-16 border-t border-ink/15">
            {labs.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.06}>
                <article className="group grid items-center gap-4 border-b border-ink/10 py-10 transition-colors duration-500 hover:bg-ink/[0.035] lg:grid-cols-[20%_47%_minmax(0,1fr)] lg:gap-8 lg:py-16">
                  <div>
                    <p className="max-w-[34ch] text-base leading-snug tracking-[-0.005em] text-ink">
                      {item.body}
                    </p>
                    <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-ink/55">
                      {item.detail}
                    </p>
                    <p className="u-label mt-6 text-ink/35 lg:mt-10">
                      /0.{i + 1}
                    </p>
                  </div>
                  {/* Resting: a faint mark. Hover: the row's image or clip. */}
                  <div className="relative hidden h-[16rem] w-full overflow-hidden lg:block">
                    <span className="absolute inset-0 grid place-items-center transition-opacity duration-500 group-hover:opacity-0">
                      <LabMark index={i} />
                    </span>
                    {item.video ? (
                      <HoverVideo src={item.video} />
                    ) : (
                      item.image && (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="47vw"
                          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        />
                      )
                    )}
                  </div>
                  <h3 className="font-didone text-[clamp(1.9rem,4.5vw,4.2rem)] leading-[0.88] font-semibold tracking-[-0.035em] lg:pl-8">
                    {item.name}
                  </h3>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ experience */}
      <Section
        id="experience"
        tone="paper"
        className="overflow-hidden bg-white bg-[url(/schematic.png)] bg-cover bg-center pt-16 md:pt-20"
      >
        <ExperienceDeck />
      </Section>

      {/* ----------------------------------------------------- capture site */}
      <Section
        id="capture-site"
        tone="paper"
        className="bg-canvas"
      >
        <CaptureSite />
      </Section>
    </>
  );
}
