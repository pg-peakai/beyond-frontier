"use client";

import { useEffect, useRef } from "react";

/**
 * Plays only while its row is hovered, and rewinds on the way out — so the clip
 * always starts from the top and nothing decodes while it is out of sight.
 * The row is the hover target rather than the video itself, matching how the
 * rest of the row (mark, image, background band) reacts.
 */
export function HoverVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const row = video?.closest("article");
    if (!video || !row) return;

    const play = () => {
      // No seek here: seeking a video that has not buffered yet stalls the
      // play() that follows. `stop` already leaves it rewound.
      void video.play().catch(() => {});
    };
    const stop = () => {
      video.pause();
      video.currentTime = 0;
    };

    row.addEventListener("mouseenter", play);
    row.addEventListener("mouseleave", stop);
    return () => {
      row.removeEventListener("mouseenter", play);
      row.removeEventListener("mouseleave", stop);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    />
  );
}
