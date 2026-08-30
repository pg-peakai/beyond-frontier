import Link from "next/link";
import { BRAND, NAV } from "@/content/site";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="group relative overflow-hidden bg-ink pt-24 text-paper">
      <div className="u-container">
        <div className="grid gap-12 border-b border-paper/10 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-didone max-w-sm text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.04] tracking-[-0.015em]">
              {BRAND.tagline}
            </p>
            <Link
              href="/contact"
              className="u-label mt-8 inline-flex items-center gap-2 bg-signal-soft px-8 py-4 tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-paper"
            >
              Start a conversation <span aria-hidden>&rarr;</span>
            </Link>
          </div>

          <div>
            <p className="u-label text-paper/40">Site</p>
            <ul className="mt-5 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="u-label text-paper/40">Contact</p>
            <ul className="mt-5 space-y-2.5 text-sm text-paper/70">
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="transition-colors hover:text-paper"
                >
                  {BRAND.email}
                </a>
              </li>
              <li className="max-w-[22ch] leading-relaxed">{BRAND.location}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-4 py-8 text-xs text-paper/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="u-label">Operators, not brokers</p>
        </div>
      </div>

      {/* Oversized wordmark, sized to sit fully inside the viewport. */}
      <div
        aria-hidden
        className="pointer-events-none mt-4 select-none leading-[0.78]"
      >
        <span className="u-footer-mark block translate-y-[8%] text-center text-[14vw] font-medium tracking-[-0.05em] whitespace-nowrap opacity-40 transition-opacity duration-700 group-hover:opacity-100">
          {BRAND.name}
        </span>
      </div>
    </footer>
  );
}
