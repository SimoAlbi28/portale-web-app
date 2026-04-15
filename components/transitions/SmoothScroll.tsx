"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useSettings } from "@/lib/settings";

declare global {
  interface Window {
    __lenis__?: Lenis;
  }
}

export function SmoothScroll() {
  const { intensity } = useSettings();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (intensity === "off") return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis__ = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis__;
    };
  }, [intensity]);
  return null;
}
