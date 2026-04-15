"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DURATION_MS = 8000;

export function EasterEgg() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const SECRET = "hack";
    let buffer = "";
    let lastAt = 0;
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in input/textarea
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (e.key.length !== 1) return;
      const now = performance.now();
      if (now - lastAt > 1500) buffer = "";
      lastAt = now;
      buffer = (buffer + e.key.toLowerCase()).slice(-SECRET.length);
      if (buffer === SECRET) {
        buffer = "";
        if (!active) setActive(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // auto stop
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), DURATION_MS);
    return () => clearTimeout(t);
  }, [active]);

  // matrix rain
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    };
    resize();
    const onResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    };
    window.addEventListener("resize", onResize);

    const fontSize = 16;
    const cols = Math.floor(window.innerWidth / fontSize);
    const drops = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * -50)
    );
    const chars = "01";

    let startedAt = performance.now();

    const frame = () => {
      ctx.fillStyle = "rgba(3, 0, 20, 0.12)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const elapsed = performance.now() - startedAt;
      const hue = (elapsed * 0.15) % 360;

      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // head bright
        ctx.fillStyle = `hsl(${hue}, 100%, 75%)`;
        ctx.fillText(ch, x, y);
        // trail
        ctx.fillStyle = `hsl(${(hue + 140) % 360}, 80%, 55%)`;
        ctx.fillText(
          chars[Math.floor(Math.random() * chars.length)],
          x,
          y - fontSize
        );
        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* matrix rain canvas */}
          <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-[120] mix-blend-screen"
          />
          {/* color glitch overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.35, 0.1, 0.3, 0.12, 0.28, 0.08],
              background: [
                "linear-gradient(0deg, #ff00cc, transparent)",
                "linear-gradient(90deg, #00ffd5, transparent)",
                "linear-gradient(180deg, #fffb00, transparent)",
                "linear-gradient(270deg, #00ff6a, transparent)",
                "linear-gradient(45deg, #ff006a, transparent)",
                "linear-gradient(135deg, #8a2be2, transparent)",
                "linear-gradient(225deg, #00bfff, transparent)",
              ],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION_MS / 1000, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1] }}
            className="pointer-events-none fixed inset-0 z-[115] mix-blend-overlay"
          />
          {/* cheeky label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-none fixed top-8 left-1/2 -translate-x-1/2 z-[130] font-mono text-xs uppercase tracking-[0.4em] text-emerald-300 bg-black/70 border border-emerald-400/40 rounded-full px-4 py-2 shadow-[0_0_24px_rgba(16,185,129,0.6)]"
          >
            ⚡ GLITCH MODE ACTIVATED
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
