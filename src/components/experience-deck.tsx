"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HOME } from "@/content/site";
import { Label } from "@/components/ui";
import { cn } from "@/lib/cn";

const { experience } = HOME;
const CARDS = experience.cards;

/**
 * Geometry, in percentages of the row.
 * Spread mirrors the reference: the deck steps out by OFFSET, then the cards
 * sit on an even GAP. The hit area is a small box over the middle of the
 * stack — the edges and the gaps between cards deliberately do not trigger it.
 */
/* Spread wants a real gap between cards, per the reference (~80px on a
   wider canvas). Four cards plus three of those gaps has to fit the row, so
   the card gives up a little width to buy it. */
const CARD_W = 21.5;
const GAP = 4.5;
/** Closed stack steps right and descends, so each card peeks out bottom-right.
    STACK_LEFT insets it from the edge so the artwork behind stays visible. */
const STACK_LEFT = 7;
const STACK_X = 2.2;
const STACK_Y = 12;
const HIT_CLOSED = { left: "12.5%", top: "30%", width: "11%", height: "45%" };
const HIT_OPEN = { left: "0%", top: "0%", width: "100%", height: "100%" };

/**
 * Deck is parked for now. Flip to `true` to bring the cards and their hover
 * interaction back — everything below is kept intact. The row itself still
 * renders so the section keeps its height and the copy holds its position.
 */
const SHOW_CARDS = false;

/**
 * The deck rests as a square stack on the left and fans out across the row when
 * pointed at, clearing the copy out of its way.
 *
 * Driven by state rather than `:hover` so the open and closed positions are one
 * source of truth and the stagger can key off the same flag.
 */
const TIMELINE = experience.timeline;
/** How long each stop holds before the run advances. */
const STEP_MS = 1800;

/**
 * Progressive timeline: the rail fills to the current stop, stops behind it read
 * as done and those ahead as pending, and only the current one shows its detail.
 * Pointing at a stop jumps straight to it and holds there until the pointer
 * leaves, so the run is scrubbable rather than something you wait out.
 */
function Timeline() {
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  /**
   * Mirrors `held` so an interval tick already queued when the pointer arrives
   * cannot advance past the stop being pointed at — the effect does not re-run
   * until after the event handler returns.
   */
  const heldRef = useRef(false);

  const hold = (i: number) => {
    heldRef.current = true;
    setHeld(true);
    setStep(i);
  };
  const release = () => {
    heldRef.current = false;
    setHeld(false);
  };

  useEffect(() => {
    if (held) return;
    // Reduced motion: no auto-run. Hovering a stop still scrubs to it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (heldRef.current) return;
      setStep((s) => (s + 1) % TIMELINE.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [held]);

  const fill = (step / (TIMELINE.length - 1)) * 80;

  return (
    <div className="relative mt-20 lg:mx-auto lg:max-w-5xl">
      <p className="u-label tracking-[0.2em] text-ink/60 lg:text-center">
        {experience.rail}
      </p>

      {/* Three grid rows: times, the rail with its nodes, then labels. */}
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {TIMELINE.map((stop, i) => (
          <p
            key={`t-${stop.time}`}
            className={cn(
              "hidden text-center font-mono text-lg tracking-[0.08em] tabular-nums transition-colors duration-500 lg:block",
              i === step
                ? "text-success-ink"
                : i < step
                  ? "text-success-ink/75"
                  : "text-ink/45",
            )}
          >
            {stop.time}
          </p>
        ))}

        <div className="relative col-span-2 my-1 hidden h-2.5 sm:col-span-3 lg:col-span-5 lg:block">
          <span
            aria-hidden
            className="absolute inset-x-[10%] top-1/2 h-px -translate-y-1/2 bg-ink/20"
          />
          <span
            aria-hidden
            style={{ width: `${fill}%` }}
            className="absolute left-[10%] top-1/2 h-px -translate-y-1/2 bg-success transition-[width] duration-500 ease-out"
          />
          <div className="relative grid h-full grid-cols-5">
            {TIMELINE.map((stop, i) => (
              <button
                key={`d-${stop.time}`}
                type="button"
                aria-label={stop.title}
                onMouseEnter={() => hold(i)}
                onMouseLeave={release}
                onFocus={() => hold(i)}
                onBlur={release}
                className="group relative mx-auto grid size-6 -translate-y-[7px] place-items-center"
              >
                {/* waves off the live node */}
                {i === step && (
                  <>
                    <span
                      aria-hidden
                      className="u-pulse absolute size-2.5 rounded-full bg-success"
                    />
                    <span
                      aria-hidden
                      className="u-pulse u-pulse-late absolute size-2.5 rounded-full bg-success"
                    />
                  </>
                )}
                <span
                  className={cn(
                    "relative size-2.5 rounded-full transition-all duration-500",
                    i <= step
                      ? "bg-success"
                      : "bg-white ring-1 ring-ink/30 ring-inset",
                    i === step && "ring-4 ring-success/25",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {TIMELINE.map((stop, i) => (
          <div key={stop.time} className="lg:text-center">
            <p
              className={cn(
                "font-mono text-lg tracking-[0.08em] tabular-nums lg:hidden",
                i === step ? "text-success-ink" : "text-ink/45",
              )}
            >
              {stop.time}
            </p>
            <p
              className={cn(
                "mt-2 text-sm font-medium transition-colors duration-500 lg:mt-0",
                i <= step ? "text-ink" : "text-ink/55",
              )}
            >
              {stop.title}
            </p>
            {/* Always rendered so the row keeps its height as the run moves. */}
            <p
              className={cn(
                "u-label mt-2 text-[0.6rem] leading-[1.6] tracking-[0.12em] text-ink/65 transition-opacity duration-500",
                i === step ? "opacity-100" : "opacity-0",
              )}
            >
              {stop.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperienceDeck() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Copy. With the deck parked it runs in normal flow from the left edge so
          the timeline can follow it; when the cards are back it floats over the
          row to their right, and the timeline is skipped. */}
      <div
        className={cn(
          "z-10 flex flex-col transition-opacity duration-500",
          SHOW_CARDS
            ? "pointer-events-none absolute inset-y-0 right-0 w-full justify-center lg:w-[57%] lg:-translate-y-10"
            : "relative w-full lg:pl-[19%]",
          open ? "opacity-0" : "opacity-100",
        )}
      >
        <Label className="text-ink/70">{experience.label}</Label>
        <h2 className="font-didone mt-11 max-w-[16ch] text-[clamp(2.2rem,4.2vw,4rem)] leading-[0.94] tracking-[-0.02em]">
          <span className="block">{experience.headline}</span>
          <span className="block text-signal italic">
            {experience.headlineAccent}
          </span>
        </h2>

        {/* Body left, action alongside it. */}
        <div className="mt-11 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-ink/80">
            {experience.body}
          </p>
          <Link
            href={experience.cta.href}
            className="u-label pointer-events-auto shrink-0 self-start bg-signal px-8 py-4 tracking-[0.18em] text-paper transition-colors duration-300 hover:bg-ink"
          >
            {experience.cta.label} <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>

      {!SHOW_CARDS && <Timeline />}

      {/* Cards. The row is full width so they have somewhere to spread to. */}
      <div
        className={cn(
          "pointer-events-none relative z-20 w-full",
          SHOW_CARDS
            ? "h-[19rem] sm:h-[21rem] lg:h-auto lg:aspect-[100/47]"
            : "hidden",
        )}
      >
        {SHOW_CARDS &&
          CARDS.map((card, i) => (
            <article
              key={card.code}
              style={{
                // closed: a tight stack stepping down and to the right
                left: open
                  ? `${i * (CARD_W + GAP)}%`
                  : `${STACK_LEFT + i * STACK_X}%`,
                top: open ? 0 : `${i * STACK_Y}px`,
                width: `${CARD_W}%`,
                transitionDelay: `${(open ? i : CARDS.length - 1 - i) * 45}ms`,
                zIndex: CARDS.length - i,
              }}
              className="absolute min-w-[8rem] transition-[left,top] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <div className="relative aspect-[11/20] overflow-hidden bg-[#efeee9] shadow-[0_20px_44px_-26px_rgba(0,0,0,0.5)]">
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={`${card.code} — ${card.title}`}
                    fill
                    sizes="(min-width: 1024px) 24vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col border border-ink/25 p-3">
                    <p className="u-label text-[0.5rem] tracking-[0.18em] text-ink/50">
                      {card.code}
                    </p>
                    <div
                      aria-hidden
                      className="mt-3 flex-1 border border-ink/15 bg-[repeating-linear-gradient(115deg,rgba(11,11,12,0.06)_0_2px,transparent_2px_7px)]"
                    />
                    <p className="font-didone mt-3 text-[0.95rem] leading-[1.05] font-semibold text-ink">
                      {card.title}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
      </div>

      {/* Hit area: covers the closed stack, then the whole row once open, so the
          pointer can follow the cards out without the deck collapsing. */}
      {SHOW_CARDS && (
        <div
          data-deck
          role="presentation"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          style={open ? HIT_OPEN : HIT_CLOSED}
          className="absolute z-30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      )}
    </div>
  );
}
