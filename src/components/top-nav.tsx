import Link from "next/link";
import { BRAND, NAV_CTA, NAV_LEFT, NAV_RIGHT } from "@/content/site";
import { cn } from "@/lib/cn";

/** Outlined gold button. Every nav item uses it — left and right alike — so
    the row reads as one nav rather than two. */
export const navLinkClass =
  "u-gold-host border border-gold/35 px-4 py-2.5 leading-none transition-colors duration-300 hover:border-ink hover:bg-ink";
export const navLinkLabel = "u-label u-gold text-[0.68rem] tracking-[0.18em]";

/**
 * The wordmark and links, embedded at the top of a screen rather than in a
 * fixed bar. Shared by the hero and every sub-page header so the whole site
 * opens the same way.
 */
export function TopNav({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "u-container relative z-10 pt-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10 md:pt-5",
        className,
      )}
    >
      <nav className="hidden items-center gap-3 md:flex md:justify-start">
        {NAV_LEFT.map((item) => (
          <Link key={item.href} href={item.href} className={navLinkClass}>
            <span className={navLinkLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link
        href="/"
        className="font-didone block text-center text-[1.4rem] leading-[0.94] tracking-[0.05em] uppercase md:text-[1.6rem]"
      >
        {BRAND.name.split(" ").map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </Link>

      <nav className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-0 md:flex-nowrap md:justify-end">
        {NAV_RIGHT.map((item) => (
          <Link key={item.href} href={item.href} className={navLinkClass}>
            <span className={navLinkLabel}>{item.label}</span>
          </Link>
        ))}
        <Link href={NAV_CTA.href} className={navLinkClass}>
          <span className={cn(navLinkLabel, "inline-flex items-center gap-2")}>
            {NAV_CTA.label} <span aria-hidden>&rarr;</span>
          </span>
        </Link>
      </nav>
    </div>
  );
}
