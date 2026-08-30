import Image from "next/image";
import Link from "next/link";
import {
  CircleDollarSign,
  PackageOpen,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { HOME } from "@/content/site";
import { Label } from "@/components/ui";

const { captureSite } = HOME;

const ICONS = {
  cycle: RefreshCw,
  kit: PackageOpen,
  earn: CircleDollarSign,
  control: ShieldCheck,
};

/**
 * Capture-site pitch, set as two torn-apart movie tickets — the pitch and its
 * stub — each with notched edges and chamfered corners. The floor photo runs to
 * the first ticket's own top and right edges (negative insets cancel its
 * padding) and its feathered edge dissolves into the paper.
 */
export function CaptureSite() {
  return (
    <>
      {/* Pulled up past the section's own top padding so the ticket overlaps the
          artwork above. The section keeps its padding, so nothing above is
          shortened — the ticket simply sits on top of it. */}
      <div className="u-ticket-shadow -mt-40 md:-mt-60">
        <div className="u-ticket relative bg-ink text-paper px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
          <div className="relative">
            {/* floor photo, bled to the viewport edge */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-14 -right-6 -bottom-14 hidden w-[62%] sm:-right-10 lg:-top-16 lg:-right-14 lg:-bottom-16 lg:block"
            >
              <Image
                src="/capture-floor.png"
                alt=""
                fill
                sizes="42vw"
                className="object-cover object-right [mask-image:linear-gradient(to_right,transparent_0%,#000_40%)]"
              />

              {/* live readout, pinned over the floor */}
              <div className="absolute bottom-10 left-[26%] border border-signal-soft/60 bg-ink/80 backdrop-blur-sm">
                <p className="u-label flex items-center gap-2 px-3 py-2 text-[0.55rem] tracking-[0.18em] text-signal-soft">
                  <span
                    className="size-1.5 rounded-full bg-signal-soft"
                    aria-hidden
                  />
                  {captureSite.feed.label}
                </p>
                <dl className="space-y-1 px-3 pb-2 font-mono text-[0.6rem] tracking-[0.1em] uppercase">
                  {captureSite.feed.rows.map((row) => (
                    <div key={row.key} className="flex justify-between gap-6">
                      <dt className="text-paper/50">{row.key}:</dt>
                      <dd className="text-signal-soft tabular-nums">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* copy */}
            <div className="relative z-10 py-4 lg:w-[48%] lg:py-10">
              <Label className="text-paper">{captureSite.label}</Label>
              <h2 className="font-didone mt-8 text-[clamp(2rem,3.6vw,3.3rem)] leading-[0.96] tracking-[-0.015em]">
                <span className="block max-w-[12ch]">
                  {captureSite.headline}
                </span>
                <span className="block max-w-[14ch] text-signal-soft italic">
                  {captureSite.headlineAccent}
                </span>
              </h2>
              <p className="mt-7 max-w-md leading-relaxed text-paper/70">
                {captureSite.body}
              </p>

              <div className="mt-9 flex flex-wrap items-stretch gap-4">
                <Link
                  href={captureSite.cta.href}
                  className="u-label inline-flex items-center gap-2 bg-signal-soft px-7 py-4 tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-paper"
                >
                  {captureSite.cta.label} <span aria-hidden>&rarr;</span>
                </Link>
                <p className="flex flex-col justify-center border border-paper/25 px-5 py-3">
                  <span className="u-label flex items-center gap-2 text-[0.6rem] tracking-[0.18em] text-signal-soft">
                    <span
                      className="size-1.5 rounded-full bg-signal-soft"
                      aria-hidden
                    />
                    {captureSite.badge.title}
                  </span>
                  <span className="u-label mt-1 text-[0.6rem] leading-[1.5] tracking-[0.12em] text-paper/55">
                    {captureSite.badge.body}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* the stub, torn off */}
      <div className="u-ticket-shadow mt-5 lg:mt-6">
        <div className="u-ticket relative bg-ink text-paper px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
          <div className="relative z-10">
            <Label className="text-paper">{captureSite.stepsLabel}</Label>
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {captureSite.steps.map((step) => {
                const Icon = ICONS[step.icon];
                return (
                  <div key={step.title}>
                    <Icon className="size-6 text-paper" strokeWidth={1.5} />
                    <h3 className="u-label mt-6 text-[0.8rem] tracking-[0.1em] text-paper">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[24ch] text-base leading-snug font-medium tracking-[-0.005em] text-paper">
                      {step.body}
                    </p>
                    <span
                      aria-hidden
                      className="mt-6 block h-px w-14 bg-signal-soft/60"
                    />
                    <p className="mt-4 text-sm leading-relaxed text-paper/55">
                      {step.note.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
