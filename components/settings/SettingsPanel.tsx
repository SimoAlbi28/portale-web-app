"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CURSOR_COLORS,
  THEMES,
  useSettings,
  type CursorStyle,
  type Intensity,
  type Theme,
} from "@/lib/settings";

export function SettingsPanel({ inline = false }: { inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const {
    theme,
    intensity,
    setTheme,
    setIntensity,
    cursorStyle,
    setCursorStyle,
    cursorColor,
    setCursorColor,
  } = useSettings();

  const intensityOptions: { id: Intensity; label: string; desc: string }[] = [
    { id: "full", label: "Full", desc: "Tutti gli effetti" },
    { id: "light", label: "Light", desc: "Ridotti, meno CPU/GPU" },
    { id: "off", label: "Off", desc: "Statico, senza animazioni" },
  ];

  const cursorStyles: { id: CursorStyle; label: string }[] = [
    { id: "ring", label: "Ring" },
    { id: "dot", label: "Dot" },
    { id: "cross", label: "Cross" },
    { id: "default", label: "Base" },
  ];

  return (
    <>
      <button
        type="button"
        data-cursor="hover"
        onClick={() => setOpen((o) => !o)}
        aria-label="Impostazioni"
        className={
          inline
            ? "relative flex items-center justify-center size-10 rounded-full border border-white/15 bg-black/40 text-white/60 hover:text-white hover:border-cyan-300/60 transition-all"
            : "fixed top-6 right-6 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 backdrop-blur-md w-11 h-11 justify-center text-white/70 hover:text-white hover:border-cyan-300/60 transition-all shadow-[0_0_24px_rgba(34,211,238,0.15)]"
        }
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[140] bg-black/30 backdrop-blur-[2px]"
              />
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="fixed top-20 right-3 md:right-6 z-[150] w-[min(340px,calc(100vw-1.5rem))] rounded-2xl border border-white/10 bg-[#07021c]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(168,85,247,0.3)] p-4 md:p-5 max-h-[calc(100vh-6rem)] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm uppercase tracking-[0.3em] font-mono text-cyan-300">
                  Settings
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Chiudi"
                  data-cursor="hover"
                  className="text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <section className="mb-6">
                <div className="text-xs uppercase tracking-[0.25em] text-white/50 mb-3">
                  Tema
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(THEMES) as Theme[]).map((t) => {
                    const isActive = theme === t;
                    const meta = THEMES[t];
                    return (
                      <button
                        key={t}
                        type="button"
                        data-cursor="hover"
                        onClick={() => setTheme(t)}
                        className={`relative flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors ${
                          isActive
                            ? "border-white/40 bg-white/[0.05]"
                            : "border-white/10 hover:border-white/25 bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex gap-1">
                          {[meta.accentA, meta.accentB, meta.accentC].map(
                            (c, i) => (
                              <span
                                key={i}
                                className="size-4 rounded-full ring-1 ring-white/20"
                                style={{
                                  background: c,
                                  boxShadow: `0 0 10px ${c}80`,
                                }}
                              />
                            )
                          )}
                        </div>
                        <span className="text-sm text-white">{meta.label}</span>
                        {isActive && (
                          <span className="absolute top-2 right-2 text-[10px] text-cyan-300">
                            ●
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <div className="text-xs uppercase tracking-[0.25em] text-white/50 mb-3">
                  Intensità effetti
                </div>
                <div className="flex flex-col gap-1.5">
                  {intensityOptions.map((o) => {
                    const isActive = intensity === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        data-cursor="hover"
                        onClick={() => setIntensity(o.id)}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          isActive
                            ? "border-cyan-300/60 bg-cyan-300/[0.05]"
                            : "border-white/10 hover:border-white/25 bg-white/[0.02]"
                        }`}
                      >
                        <span
                          className={`size-2.5 rounded-full ${
                            isActive
                              ? "bg-cyan-300 shadow-[0_0_10px_theme(colors.cyan.300)]"
                              : "bg-white/20"
                          }`}
                        />
                        <span className="flex-1">
                          <span className="block text-sm text-white">
                            {o.label}
                          </span>
                          <span className="block text-[11px] text-white/50">
                            {o.desc}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="mt-6">
                <div className="text-xs uppercase tracking-[0.25em] text-white/50 mb-3">
                  Puntatore
                </div>
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {cursorStyles.map((o) => {
                    const isActive = cursorStyle === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        data-cursor="hover"
                        onClick={() => setCursorStyle(o.id)}
                        aria-pressed={isActive}
                        className={`flex flex-col items-center gap-2 rounded-lg border px-2 py-2.5 transition-colors ${
                          isActive
                            ? "border-cyan-300/60 bg-cyan-300/[0.05]"
                            : "border-white/10 hover:border-white/25 bg-white/[0.02]"
                        }`}
                      >
                        <CursorPreview
                          kind={o.id}
                          color={o.id === "default" ? "#ffffff" : cursorColor}
                        />
                        <span className="text-[11px] text-white/80">
                          {o.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {CURSOR_COLORS.map((c) => {
                    const isActive = cursorColor === c.hex;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        data-cursor="hover"
                        onClick={() => setCursorColor(c.hex)}
                        aria-label={c.label}
                        aria-pressed={isActive}
                        className={`size-7 rounded-full border-2 transition-transform ${
                          isActive
                            ? "border-white scale-110"
                            : "border-white/20 hover:border-white/50"
                        }`}
                        style={{
                          background: c.hex,
                          boxShadow: isActive ? `0 0 14px ${c.hex}b3` : undefined,
                        }}
                      />
                    );
                  })}
                </div>
              </section>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function CursorPreview({ kind, color }: { kind: CursorStyle; color: string }) {
  if (kind === "default") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 3l14 7-6 2-2 6-6-15z"
          fill={color}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="1"
        />
      </svg>
    );
  }
  if (kind === "ring") {
    return (
      <div className="relative size-6">
        <span
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: color, boxShadow: `0 0 8px ${color}66` }}
        />
        <span
          className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: color, boxShadow: `0 0 4px ${color}` }}
        />
      </div>
    );
  }
  if (kind === "dot") {
    return (
      <div className="relative size-6">
        <span
          className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}b3` }}
        />
      </div>
    );
  }
  // cross
  return (
    <div className="relative size-6">
      <span
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{ background: color, boxShadow: `0 0 4px ${color}` }}
      />
      <span
        className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2"
        style={{ background: color, boxShadow: `0 0 4px ${color}` }}
      />
      <span
        className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}
