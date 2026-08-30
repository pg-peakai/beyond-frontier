"use client";

import { motion } from "motion/react";

export function Marquee({
  items,
  speed = 38,
}: {
  items: readonly string[];
  speed?: number;
}) {
  const track = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex w-max gap-10 will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-10 text-2xl tracking-[-0.03em] whitespace-nowrap md:text-4xl"
          >
            {item}
            <span className="size-1.5 rounded-full bg-signal" aria-hidden />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
