"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { BRAND, NAV, NAV_CTA, NAV_LEFT, NAV_RIGHT } from "@/content/site";
import { cn } from "@/lib/cn";

const linkClass =
  "u-label text-[0.72rem] tracking-[0.2em] transition-opacity duration-300 hover:opacity-100";

/** Wordmark stacks: "Peak Robotics" sets as two centred lines. */
const wordmarkLines = BRAND.name.split(" ");

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-ink transition-colors duration-500",
        scrolled && !open ? "bg-canvas/80 backdrop-blur-xl" : "bg-transparent",
        open && "text-paper",
      )}
    >
      <div className="u-container flex items-center justify-between py-6 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8">
        {/* left cluster */}
        <nav className="hidden items-center gap-12 md:flex">
          {NAV_LEFT.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                linkClass,
                pathname === item.href ? "opacity-100" : "opacity-70",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* centred wordmark */}
        <Link
          href="/"
          className="font-didone text-[1.35rem] leading-[0.94] tracking-[0.06em] uppercase md:text-center md:text-[1.55rem]"
        >
          {wordmarkLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Link>

        {/* right cluster */}
        <nav className="hidden items-center justify-end gap-12 md:flex">
          {NAV_RIGHT.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                linkClass,
                pathname === item.href ? "opacity-100" : "opacity-70",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href={NAV_CTA.href} className={cn(linkClass, "text-signal")}>
            {NAV_CTA.label} <span aria-hidden>→</span>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid size-10 place-items-center md:hidden"
        >
          {open ? (
            <X className="size-5" strokeWidth={1.5} />
          ) : (
            <Menu className="size-5" strokeWidth={1.5} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-ink text-paper md:hidden"
          >
            <div className="u-container flex flex-col py-6">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-didone border-b border-paper/10 py-4 text-2xl tracking-[0.04em] uppercase"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={NAV_CTA.href}
                onClick={() => setOpen(false)}
                className="u-label mt-7 bg-signal py-4 text-center tracking-[0.2em] text-white"
              >
                {NAV_CTA.label} <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
