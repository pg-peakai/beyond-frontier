"use client";

import { useEffect, useRef, useState } from "react";
import { HOME } from "@/content/site";

type Ring = [number, number][];

const { network } = HOME;
const SITES = network.sites;

const RAD = Math.PI / 180;
/** Northward tilt, so the northern hemisphere reads as the top of the sphere. */
const TILT = 16 * RAD;

/** Degrees of longitude per second. The globe never stops. */
const SPIN = 15;
/**
 * How long each window stays up. Varied across the 5-7s brief on purpose: a
 * fixed dwell divides evenly into the rotation period, so the same handful of
 * sites would come up every revolution and the rest would never show.
 */
const DWELLS = [6000, 5400, 6600, 5800, 7000, 6200];
/** Cross-fade at each end of a window's life. */
const FADE = 400;
/**
 * A new window is handed to a site that has just rotated into view on the
 * leading limb, so it has the whole dwell to drift across the disc.
 */
const ENTERING_FRONT = 0.25;

/** Sites eligible to carry a capture window. Falls back to every site. */
const STOPS = (() => {
  const all = SITES.map((site, index) => ({ site, index }));
  const marked = all.filter((s) => s.site.featured);
  return marked.length ? marked : all;
})();

/**
 * Orthographic projection. `front` is the cosine of angular distance from the
 * centre of the disc: <= 0 is the far side, 1 is dead centre.
 */
function project(lon: number, lat: number, spin: number) {
  const phi = lat * RAD;
  const delta = lon * RAD - spin;
  const cosPhi = Math.cos(phi);
  const front =
    Math.sin(TILT) * Math.sin(phi) + Math.cos(TILT) * cosPhi * Math.cos(delta);
  if (front <= 0) return null;
  return {
    x: cosPhi * Math.sin(delta),
    y: -(
      Math.cos(TILT) * Math.sin(phi) -
      Math.sin(TILT) * cosPhi * Math.cos(delta)
    ),
    front,
  };
}

/**
 * Same projection, but it also returns points on the far side rather than
 * discarding them, so a ring that straddles the limb can still be closed.
 */
function projectRaw(lon: number, lat: number, spin: number) {
  const phi = lat * RAD;
  const delta = lon * RAD - spin;
  const cosPhi = Math.cos(phi);
  return {
    x: cosPhi * Math.sin(delta),
    y: -(
      Math.cos(TILT) * Math.sin(phi) -
      Math.sin(TILT) * cosPhi * Math.cos(delta)
    ),
    front:
      Math.sin(TILT) * Math.sin(phi) +
      Math.cos(TILT) * cosPhi * Math.cos(delta),
  };
}

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const ringsRef = useRef<Ring[] | null>(null);
  /** Set by the draw effect so the land fetch can trigger one repaint. */
  const redrawRef = useRef<(() => void) | null>(null);
  /** Mirrors `active` so the frame loop can compare without re-subscribing. */
  const activeRef = useRef(STOPS[0].index);
  const [active, setActive] = useState(STOPS[0].index);

  useEffect(() => {
    let cancelled = false;
    fetch("/globe-land.json")
      .then((r) => r.json())
      .then((d: { rings: Ring[] }) => {
        if (cancelled) return;
        ringsRef.current = d.rings;
        // The first frame paints before this resolves; repaint now rather than
        // waiting on rAF, which is paused while the tab is in the background.
        redrawRef.current?.();
      })
      .catch(() => {
        /* globe degrades to ocean + graticule + sites */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const v = (name: string, fallback: string) =>
      css.getPropertyValue(name).trim() || fallback;
    const sea = v("--color-globe-sea", "#bcd7ea");
    const seaDeep = v("--color-globe-sea-deep", "#4c86ad");
    const land = v("--color-globe-land", "#e8d6b0");
    const landEdge = v("--color-globe-land-edge", "#7a6b52");
    const pin = v("--color-globe-pin", "#21c46a");

    let frame = 0;
    let start: number | null = null;
    let cycle = -1;
    let windowStart = 0;
    let nextHandover = 0;
    let cardOpacity = 1;
    let size = 0;
    let radius = 0;
    /** Last angle drawn, so a resize can repaint without waiting for a frame. */
    let lastSpin = STOPS[0].site.lon * RAD;

    const draw = (spin: number) => {
      lastSpin = spin;
      const cx = size / 2;
      const cy = size / 2;
      ctx.clearRect(0, 0, size, size);

      // ocean, lit from the upper left so the sphere reads as a sphere
      const sphere = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.4,
        radius * 0.1,
        cx,
        cy,
        radius,
      );
      sphere.addColorStop(0, sea);
      sphere.addColorStop(0.65, sea);
      sphere.addColorStop(1, seaDeep);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphere;
      ctx.fill();
      ctx.strokeStyle = seaDeep;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1;
      ctx.stroke();

      const to = (p: { x: number; y: number }) =>
        [cx + p.x * radius, cy + p.y * radius] as const;

      const trace = (points: [number, number][]) => {
        ctx.beginPath();
        let open = false;
        for (const [plon, plat] of points) {
          const p = project(plon, plat, spin);
          if (!p) {
            open = false;
            continue;
          }
          const [x, y] = to(p);
          if (open) ctx.lineTo(x, y);
          else {
            ctx.moveTo(x, y);
            open = true;
          }
        }
      };

      // graticule
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = landEdge;
      for (let lat = -60; lat <= 60; lat += 30) {
        const pts: [number, number][] = [];
        for (let l = -180; l <= 180; l += 3) pts.push([l, lat]);
        trace(pts);
        ctx.stroke();
      }
      for (let l = -180; l < 180; l += 30) {
        const pts: [number, number][] = [];
        for (let lat = -90; lat <= 90; lat += 3) pts.push([l, lat]);
        trace(pts);
        ctx.stroke();
      }

      /**
       * Land is one closed path per ring. Points on the far side are pulled out
       * onto the limb instead of being dropped — dropping them left the path as
       * several open fragments, and fill() closed each one with a straight line,
       * which is what threw the shifting wedges across the disc.
       */
      const traceLand = (ring: Ring) => {
        let visible = false;
        ctx.beginPath();
        for (let i = 0; i < ring.length; i++) {
          const p = projectRaw(ring[i][0], ring[i][1], spin);
          let { x, y } = p;
          if (p.front > 0) visible = true;
          else {
            const m = Math.hypot(x, y) || 1;
            x /= m;
            y /= m;
          }
          const px = cx + x * radius;
          const py = cy + y * radius;
          if (i) ctx.lineTo(px, py);
          else ctx.moveTo(px, py);
        }
        ctx.closePath();
        return visible;
      };

      const rings = ringsRef.current;
      if (rings) {
        ctx.save();
        // belt and braces: nothing land-related escapes the sphere
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.strokeStyle = landEdge;
        ctx.fillStyle = land;
        for (const ring of rings) {
          if (!traceLand(ring)) continue;
          ctx.globalAlpha = 0.95;
          ctx.fill();
          ctx.globalAlpha = 0.4;
          ctx.stroke();
        }
        ctx.restore();
      }

      // capture sites
      let activePoint: readonly [number, number] | null = null;
      for (let i = 0; i < SITES.length; i++) {
        const s = SITES[i];
        const p = project(s.lon, s.lat, spin);
        if (!p) continue;
        const [x, y] = to(p);
        if (i === activeRef.current) activePoint = [x, y];

        ctx.fillStyle = pin;
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // shaded limb, for volume
      const shade = ctx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.35,
        radius * 0.2,
        cx,
        cy,
        radius,
      );
      shade.addColorStop(0, "rgba(0,0,0,0)");
      shade.addColorStop(0.72, "rgba(0,0,0,0)");
      shade.addColorStop(1, "rgba(20,26,22,0.28)");
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = shade;
      ctx.fill();

      // Card and readout are driven imperatively — a setState per frame would
      // re-render the whole section 60 times a second.
      const card = cardRef.current;
      if (card) {
        if (activePoint) {
          const [x, y] = activePoint;
          const w = card.offsetWidth;
          const h = card.offsetHeight;
          const left = Math.min(Math.max(x - w / 2, 4), size - w - 4);
          const top = Math.min(Math.max(y - h - 16, 4), size - h - 4);
          card.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
          card.style.opacity = String(Math.max(cardOpacity, 0));
        } else {
          card.style.opacity = "0";
        }
      }
      if (readoutRef.current) {
        const s = SITES[activeRef.current];
        const lng = ((((spin / RAD) % 360) + 540) % 360) - 180;
        readoutRef.current.textContent = `LAT ${s.lat.toFixed(1)}° · LNG ${lng.toFixed(1)}°`;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = rect.width;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = size / 2 - 2;
      // Setting width clears the canvas; repaint now rather than waiting on rAF,
      // which is paused while the tab is in the background.
      draw(lastSpin);
    };
    resize();
    redrawRef.current = () => draw(lastSpin);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    /** Cycle number each site last held a window, to keep the rotation varied. */
    const lastShown = new Map<number, number>();

    /**
     * Hands the window to a site that has just cleared the leading limb, so it
     * spends the whole dwell drifting across the face rather than exiting.
     * Among those, the one shown longest ago wins, so every site gets a turn.
     */
    const pickEntering = (spin: number, cycleNo: number) => {
      let best = -1;
      let bestSeen = Infinity;
      let bestX = -Infinity;
      for (const { site, index } of STOPS) {
        if (index === activeRef.current) continue;
        const p = project(site.lon, site.lat, spin);
        if (!p || p.front < ENTERING_FRONT) continue;
        // x > 0 is the leading half — the side sites rotate in from.
        if (p.x <= 0) continue;
        const seen = lastShown.get(index) ?? -Infinity;
        if (seen < bestSeen || (seen === bestSeen && p.x > bestX)) {
          bestSeen = seen;
          bestX = p.x;
          best = index;
        }
      }
      if (best === -1) {
        // Nothing entering: take whatever sits furthest from the far side.
        let front = 0;
        for (const { site, index } of STOPS) {
          if (index === activeRef.current) continue;
          const p = project(site.lon, site.lat, spin);
          if (p && p.front > front) {
            front = p.front;
            best = index;
          }
        }
      }
      if (best === -1) return activeRef.current;
      lastShown.set(best, cycleNo);
      return best;
    };

    const tick = (t: number) => {
      // The ResizeObserver can miss the settle after hydration (and is not
      // delivered at all while the tab never renders), which leaves the backing
      // store at whatever width was measured on mount. Cheap to just check.
      const width = canvas.getBoundingClientRect().width;
      if (width > 0 && Math.abs(width - size) > 0.5) resize();

      if (start === null) {
        start = t;
        cycle = -1;
        windowStart = 0;
        nextHandover = 0;
      }
      if (still) {
        draw(STOPS[0].site.lon * RAD);
        return;
      }

      const elapsed = t - start;
      const spin = ((elapsed / 1000) * SPIN * RAD) % (Math.PI * 2);

      if (elapsed >= nextHandover) {
        cycle += 1;
        windowStart = nextHandover;
        nextHandover += DWELLS[cycle % DWELLS.length];
        const picked = pickEntering(spin, cycle);
        if (picked !== activeRef.current) {
          activeRef.current = picked;
          setActive(picked);
        }
      }

      // Fade in as the window opens, out as it hands over.
      const phase = elapsed - windowStart;
      const span = nextHandover - windowStart;
      cardOpacity = Math.min(phase / FADE, (span - phase) / FADE, 1);

      draw(spin);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      redrawRef.current = null;
    };
  }, []);

  const site = SITES[active];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[25rem]">
      <canvas ref={canvasRef} className="size-full" aria-hidden />
      <span className="sr-only">
        Rotating globe marking {SITES.length} capture sites. Currently showing{" "}
        {site.city}.
      </span>

      <span
        ref={readoutRef}
        className="u-label absolute -top-1 right-0 border border-signal-soft/50 px-2.5 py-1.5 text-[0.6rem] tracking-[0.14em] text-paper/60 tabular-nums"
      />

      {/* Live card — repositioned each frame over the fronted site. */}
      <div
        ref={cardRef}
        className="absolute top-0 left-0 w-[9.5rem] border-2 border-signal-soft bg-ink/90 opacity-0 will-change-transform"
      >
        <div className="u-label flex items-center gap-1.5 px-2 py-1 text-[0.55rem] tracking-[0.18em] text-signal-soft">
          <span className="size-1.5 rounded-full bg-signal-soft" aria-hidden />
          LIVE
        </div>
        {site.video ? (
          <video
            key={site.video}
            src={site.video}
            className="h-[4.5rem] w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div className="h-[4.5rem] bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.10)_0_2px,transparent_2px_6px)]" />
        )}
        <p className="flex items-baseline gap-1.5 px-2 py-1 text-paper">
          <span className="u-label text-[0.5rem] text-paper/45">
            {site.country}
          </span>
          <span className="text-[0.75rem] font-medium tracking-tight">
            {site.city}
          </span>
        </p>
      </div>
    </div>
  );
}
