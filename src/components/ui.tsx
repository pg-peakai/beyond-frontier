"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ Reveal */

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Reveals each line of a heading on a stagger. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  accentClassName,
  delay = 0,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  /** Applied from the second line on, so a heading can close in an accent.
      Kept a plain string: this is a client component, and a function prop
      cannot cross the server boundary. */
  accentClassName?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("block", lineClassName, i > 0 && accentClassName)}
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{
              duration: 1,
              delay: delay + i * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Label */

export function Label({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <div
      className={cn(
        "u-label flex items-center gap-3 text-current/50",
        className,
      )}
    >
      {index ? <span className="tabular-nums">{index}</span> : null}
      <span className="h-px w-8 bg-current/30" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ Button */

type ButtonProps = {
  href: string;
  children: ReactNode;
  /** `accent` on light grounds, `onDark` on ink ones, `ghost` outlined. */
  variant?: "accent" | "onDark" | "solid" | "ghost";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "accent",
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "u-label inline-flex items-center gap-2 border px-8 py-4 tracking-[0.18em] transition-colors duration-300",
        variant === "accent" &&
          "border-transparent bg-signal text-paper hover:bg-ink",
        variant === "onDark" &&
          "border-transparent bg-signal-soft text-ink hover:bg-paper",
        variant === "solid" &&
          "border-transparent bg-ink text-paper hover:bg-signal",
        variant === "ghost" &&
          "border-current/30 text-current hover:border-current hover:bg-ink hover:text-paper",
        className,
      )}
    >
      <span>{children}</span>
      <span aria-hidden>&rarr;</span>
    </Link>
  );
}

/* ----------------------------------------------------------------- Section */

export function Section({
  id,
  children,
  className,
  tone = "paper",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "paper" | "warm" | "ink";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-24 md:py-36",
        tone === "paper" && "bg-paper text-ink",
        tone === "warm" && "bg-canvas text-ink",
        tone === "ink" && "bg-ink text-paper",
        className,
      )}
    >
      <div className="u-container">{children}</div>
    </section>
  );
}
