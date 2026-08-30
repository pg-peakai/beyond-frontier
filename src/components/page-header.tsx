import { TopNav } from "@/components/top-nav";
import { RevealLines } from "@/components/ui";

/**
 * Sub-page opener, built from the hero's vocabulary: cream ground, faint graph
 * paper, the same embedded nav, a didone headline whose closing line turns
 * italic signal-green, and a hairline meter rule to close it off.
 */
export function PageHeader({
  eyebrow,
  headline,
  intro,
  meter = "Est. 2026 — India",
}: {
  eyebrow: string;
  headline: readonly string[];
  intro?: readonly string[];
  meter?: string;
}) {
  return (
    <header className="relative isolate overflow-hidden bg-canvas text-ink">
      <div aria-hidden className="u-grid absolute inset-0 -z-10 opacity-45" />
      {/* the ground fades out at the foot so the first section reads continuous */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(to_bottom,transparent,var(--color-paper))]"
      />

      <TopNav />

      <div className="u-container pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="mb-9 flex items-center gap-2" aria-hidden>
          <span className="h-px w-16 bg-signal/50" />
          <span className="size-[5px] bg-signal" />
        </div>

        <p className="u-label text-ink/45">{eyebrow}</p>

        <RevealLines
          lines={headline}
          className="font-didone mt-7 max-w-[20ch] text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.96] tracking-[-0.015em]"
          // Same optical trick as the hero: the italic accent line carries more
          // left side bearing, so it gets pulled back into alignment.
          accentClassName="-ml-[0.17em] text-signal italic"
        />

        {intro && (
          <div className="mt-9 max-w-xl space-y-5">
            {intro.map((p) => (
              <p
                key={p}
                className="text-[1.0625rem] leading-relaxed text-ink/55"
              >
                {p}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="u-container relative z-10 flex items-center justify-between border-t border-ink/10 py-5">
        <span className="u-label text-ink/35">Scroll</span>
        <span className="u-label text-ink/35">{meter}</span>
      </div>
    </header>
  );
}
