"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue } from "framer-motion";
import { useSettings } from "@/lib/settings";

type Particle = { id: number; x: number; y: number };

const CURSOR_Z = 2147483647; // max 32-bit signed int

export function CustomCursor() {
  const { intensity, cursorStyle, cursorColor } = useSettings();
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [trail, setTrail] = useState<Particle[]>([]);
  const trailId = useRef(0);
  const lastTrailAt = useRef(0);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches || reduced.matches || intensity === "off") {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (intensity !== "full" || cursorStyle === "default") return;
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

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [mouseX, mouseY, intensity, cursorStyle]);

  if (!enabled || !mounted) return null;

  const glow = `${cursorColor}b3`;
  const glowSoft = `${cursorColor}66`;

  const cursor = (
    <>
      {/* trail particles */}
      {cursorStyle !== "default" &&
        trail.map((p) => (
          <motion.div
            key={p.id}
            aria-hidden
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none fixed top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              zIndex: CURSOR_Z,
              transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`,
              background: cursorColor,
              boxShadow: `0 0 10px ${glow}`,
            }}
          />
        ))}

      {/* Ring */}
      {cursorStyle === "ring" && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            zIndex: CURSOR_Z,
            x: mouseX,
            y: mouseY,
            width: 32,
            height: 32,
            borderColor: `${cursorColor}cc`,
            boxShadow: `0 0 18px ${glowSoft}`,
          }}
        />
      )}

      {/* Crosshair */}
      {cursorStyle === "cross" && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            zIndex: CURSOR_Z,
            x: mouseX,
            y: mouseY,
            width: 28,
            height: 28,
            filter: `drop-shadow(0 0 6px ${glow})`,
          }}
        >
          <span
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
            style={{ background: cursorColor }}
          />
          <span
            className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2"
            style={{ background: cursorColor }}
          />
        </motion.div>
      )}

      {/* Default arrow pointer */}
      {cursorStyle === "default" && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0"
          style={{
            zIndex: CURSOR_Z,
            x: mouseX,
            y: mouseY,
            filter: `drop-shadow(0 0 4px ${glowSoft})`,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 3l14 7-6 2-2 6-6-15z"
              fill={cursorColor}
              stroke="rgba(0,0,0,0.55)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      {/* Dot — only when shape is ring/dot/cross */}
      {cursorStyle !== "default" && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            zIndex: CURSOR_Z,
            x: mouseX,
            y: mouseY,
            background: cursorColor,
            boxShadow: `0 0 8px ${cursorColor}e6`,
          }}
        />
      )}
    </>
  );

  return createPortal(cursor, document.body);
}
