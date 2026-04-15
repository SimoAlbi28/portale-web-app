"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [lensMode, setLensMode] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40, mass: 0.4 });
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 25, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 25, mass: 0.6 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches || reduced.matches) {
      document.body.classList.remove("has-custom-cursor");
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        frame.current = null;
      });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const lens = target.closest('[data-cursor="lens"]');
      const hoverable = target.closest(
        'a, button, [role="button"], [data-cursor="hover"], [data-cursor="lens"]'
      );
      setLensMode(!!lens);
      setHover(!!hoverable);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      {/* dot — hidden when in lens mode */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300"
        animate={{
          opacity: hover && !lensMode ? 0 : lensMode ? 1 : 1,
          scale: hover && !lensMode ? 0 : lensMode ? 0.7 : 1,
        }}
        transition={{ duration: 0.15 }}
        style={{ x: springX, y: springY }}
      />
      {/* lens / ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: lensMode ? 0 : hover ? 90 : 32,
          height: lensMode ? 0 : hover ? 90 : 32,
          opacity: lensMode ? 0 : 1,
          borderWidth: hover ? 1.5 : 1,
          borderColor: hover ? "rgba(236,72,153,0.95)" : "rgba(34,211,238,0.7)",
          backgroundColor: hover
            ? "rgba(236,72,153,0.06)"
            : "rgba(34,211,238,0)",
          boxShadow: hover
            ? "0 0 30px rgba(236,72,153,0.55), inset 0 0 20px rgba(236,72,153,0.25)"
            : "0 0 18px rgba(34,211,238,0.4)",
          backdropFilter: hover
            ? "blur(0.5px) saturate(2.2) contrast(1.25) brightness(1.15)"
            : "blur(0px) saturate(1) contrast(1) brightness(1)",
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        style={{
          x: ringX,
          y: ringY,
          borderStyle: "solid",
          WebkitBackdropFilter: "inherit",
        }}
      />
    </>
  );
}
