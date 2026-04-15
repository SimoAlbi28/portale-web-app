"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function ExploreButton() {
  const [warp, setWarp] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("apps");
    if (!target) return;

    setWarp(true);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = window.__lenis__;
    if (lenis && !reduced) {
      lenis.scrollTo(target, {
        duration: 1.8,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        offset: -20,
      });
    } else {
      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }

    setTimeout(() => setWarp(false), 1400);
  };

  return (
    <>
      <a
        href="#apps"
        data-cursor="hover"
        onClick={handleClick}
        className="rounded-full px-6 py-3 text-sm md:text-base font-semibold bg-gradient-to-r from-cyan-300 to-violet-300 text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-shadow"
      >
        Esplora le app
      </a>

      <AnimatePresence>
        {warp && (
          <>
            {/* white flash */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="pointer-events-none fixed inset-0 z-[90] bg-cyan-200"
            />
            {/* warp streaks */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scaleY: 0.3 }}
              animate={{ opacity: [0, 1, 0], scaleY: [0.3, 1, 0.6] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none fixed inset-0 z-[85] mix-blend-screen"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(34,211,238,0.0) 0px, rgba(34,211,238,0.3) 1px, rgba(168,85,247,0.2) 2px, rgba(236,72,153,0.0) 6px)",
                backgroundSize: "100% 40px",
                filter: "blur(1px)",
                transformOrigin: "center",
              }}
            />
            {/* radial flash */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="pointer-events-none fixed inset-0 z-[88]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.8), rgba(34,211,238,0.3) 35%, transparent 60%)",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
