"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HOME } from "@/content/site";
import { TopNav } from "@/components/top-nav";
import { cn } from "@/lib/cn";

const { hero } = HOME;

const ease = [0.16, 1, 0.3, 1] as const;


/**
 * Hero: full-bleed plate on the right, type on the left.
 * The plate's own ground is near-identical to --color-canvas, so it blends;
 * the scrim only has to protect the type column.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const typeOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div
      ref={ref}
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-canvas text-ink"
    >
      {/* Backdrop plate — swap public/hero-bg.png to re-art-direct.
          Phone: oversized and bottom-anchored, so the whole figure sits below
          the type. Desktop: height-fitted and bled to the right viewport edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      >
        <div className="u-container relative h-full lg:max-w-none lg:px-0">
          <Image
            src="/hero-plate.png"
            alt=""
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 1024px) 100vw, 150vw"
            className="absolute right-[-18%] bottom-0 h-auto w-[150%] max-w-none lg:right-0 lg:h-full lg:w-auto"
          />
        </div>
        {/* keeps the headline legible where the plate gets busy */}
        <div className="absolute inset-0 bg-canvas/55 lg:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,var(--color-canvas)_0%,color-mix(in_srgb,var(--color-canvas)_85%,transparent)_34%,transparent_58%)] lg:block" />
        {/* The plate has its own lettering printed across the top ("HUMANITY +
            MACHINE") which lands at exactly nav height and runs into the
            wordmark. Fading the top band lets the nav sit on clean ground
            without moving the figure. */}
        <div className="absolute inset-x-0 top-0 hidden h-44 bg-[linear-gradient(to_bottom,var(--color-canvas)_0%,var(--color-canvas)_58%,color-mix(in_srgb,var(--color-canvas)_55%,transparent)_78%,transparent_100%)] lg:block" />
      </div>

      {/* Wordmark and links sit embedded at the top of the hero rather than in
          a nav bar, and fade out on the same scroll transform as the type.
          Shared with every sub-page header so the two cannot drift apart. */}
      <motion.div style={{ opacity: typeOpacity }} className="relative z-10">
        <TopNav />
      </motion.div>

      <div className="u-container flex flex-1 items-start pt-16 pb-14 lg:items-center lg:pt-12 lg:pb-14">
        <motion.div
          style={{ opacity: typeOpacity }}
          className="relative z-10 w-full max-w-[42rem]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mb-10 flex items-center gap-2"
            aria-hidden
          >
            <span className="h-px w-16 bg-signal/50" />
            <span className="size-[5px] bg-signal" />
          </motion.div>

          <h1 className="font-didone text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.96] tracking-[-0.015em]">
            {hero.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  initial={{ y: "106%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.1, ease }}
                  className={cn(
                    "block",
                    // Optical alignment: the italic W carries ~0.17em more left
                    // side bearing than the roman I, so it reads indented.
                    i > 0 && "-ml-[0.17em] text-signal italic",
                  )}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
            className="mt-8 max-w-sm text-[1.0625rem] leading-relaxed text-ink/55"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href={hero.primary.href}
              className="u-label border border-transparent bg-signal px-8 py-4 tracking-[0.18em] text-paper transition-colors duration-300 hover:bg-ink"
            >
              {hero.primary.label} <span aria-hidden>→</span>
            </Link>
            <Link
              href={hero.secondary.href}
              className="u-label border border-ink/30 px-8 py-4 tracking-[0.18em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
            >
              {hero.secondary.label}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="u-container relative z-10 flex items-center justify-between border-t border-ink/10 py-5">
        <span className="u-label text-ink/35">Scroll</span>
        <span className="u-label text-ink/35">Est. 2026 — India</span>
      </div>
    </div>
  );
}
