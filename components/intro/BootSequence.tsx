"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINES = [
  "> booting daily_apps_v1.0...",
  "> loading modules........ok",
  "> mounting interface.....ok",
  "> initializing webgl.....ok",
  "> connecting apps........ok",
  "> ready ✓",
];

export function BootSequence() {
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    if (sessionStorage.getItem("boot-done") === "1") {
      setVisible(false);
      return;
    }
    const t = setInterval(() => {
      setLineIndex((i) => {
        if (i + 1 >= LINES.length) {
          clearInterval(t);
          setTimeout(() => {
            sessionStorage.setItem("boot-done", "1");
            setVisible(false);
          }, 500);
          return i + 1;
        }
        return i + 1;
      });
    }, 180);
    return () => clearInterval(t);
  }, []);

  const skip = () => {
    sessionStorage.setItem("boot-done", "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5 }}
          onClick={skip}
          className="fixed inset-0 z-[200] bg-[#030014] flex items-center justify-center font-mono text-sm cursor-pointer"
        >
          <div className="w-full max-w-lg px-6">
            <div className="mb-4 flex items-center gap-2 text-cyan-300">
              <span className="size-2 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_12px_theme(colors.cyan.300)]" />
              <span className="uppercase tracking-[0.4em] text-xs">
                daily_apps // system
              </span>
            </div>
            <div className="space-y-1.5">
              {LINES.slice(0, lineIndex + 1).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    i === LINES.length - 1 ? "text-emerald-300" : "text-white/70"
                  }
                >
                  {line}
                  {i === lineIndex && i < LINES.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-cyan-300 animate-pulse ml-1 align-middle" />
                  )}
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-[10px] uppercase tracking-[0.3em] text-white/30">
              click anywhere to skip
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
