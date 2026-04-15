"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useSettings } from "@/lib/settings";

type Particle = { id: number; x: number; y: number };

export function CustomCursor() {
  const { intensity } = useSettings();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [lensMode, setLensMode] = useState(false);
  const [trail, setTrail] = useState<Particle[]>([]);
  const trailId = useRef(0);
  const lastTrailAt = useRef(0);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 1500, damping: 60, mass: 0.15 });
  const springY = useSpring(mouseY, { stiffness: 1500, damping: 60, mass: 0.15 });
  const ringX = useSpring(mouseX, { stiffness: 700, damping: 38, mass: 0.25 });
  const ringY = useSpring(mouseY, { stiffness: 700, damping: 38, mass: 0.25 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches || reduced.matches || intensity === "off") {
      document.body.classList.remove("has-custom-cursor");
      setEnabled(false);
      return;
    }
    document.body.classList.add("has-custom-cursor");
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      // update position immediately for maximum reactivity
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      // throttle only the trail (state updates), not the cursor itself
      if (intensity !== "full") return;
      const now = performance.now();
      if (now - lastTrailAt.current > 18) {
        lastTrailAt.current = now;
        const id = trailId.current++;
        setTrail((prev) =>
          [...prev, { id, x: e.clientX, y: e.clientY }].slice(-14)
        );
        setTimeout(() => {
          setTrail((prev) => prev.filter((p) => p.id !== id));
        }, 500);
      }
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
  }, [mouseX, mouseY, intensity]);

  if (!enabled) return null;

  return (
    <>
      {/* trail particles */}
      {trail.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pointer-events-none fixed top-0 left-0 z-[9998] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300"
          style={{
            transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`,
            boxShadow: "0 0 10px rgba(34,211,238,0.7)",
          }}
        />
      ))}
      {/* ring — constant 32px, always visible */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/70"
        style={{
          x: ringX,
          y: ringY,
          width: 32,
          height: 32,
          boxShadow: "0 0 18px rgba(34,211,238,0.4)",
        }}
      />
      {/* dot — always visible on top of ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300"
        style={{
          x: springX,
          y: springY,
          boxShadow: "0 0 8px rgba(34,211,238,0.9)",
        }}
      />
    </>
  );
}
