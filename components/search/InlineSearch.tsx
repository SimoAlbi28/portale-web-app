"use client";

import { motion } from "framer-motion";

const PLACEHOLDERS = [
  "prova: todo",
  "prova: manutenzioni",
  "prova: ricette",
  "prova: school",
  "cerca una categoria...",
];

export function InlineSearch() {
  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("open-cmdk"));
  };

  return (
    <section className="relative mx-auto w-full max-w-4xl px-6 md:px-10 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center text-center gap-6"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-violet-300 font-mono">
          // Quick Access
        </span>
        <h3 className="text-2xl md:text-4xl font-bold tracking-tight max-w-xl">
          Cerca <span className="text-cyan-300 text-glow-cyan">al volo</span>{" "}
          tra tutte le app
        </h3>

        <button
          type="button"
          onClick={openPalette}
          data-cursor="hover"
          aria-label="Apri ricerca"
          className="group relative mt-4 w-full max-w-xl"
        >
          {/* subtle static gradient border */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full p-[1px] opacity-80 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "linear-gradient(90deg, rgba(34,211,238,0.5), rgba(168,85,247,0.4), rgba(236,72,153,0.5))",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          {/* soft glow on hover only */}
          <span
            aria-hidden
            className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                "radial-gradient(closest-side, rgba(34,211,238,0.25), transparent 70%)",
              filter: "blur(16px)",
            }}
          />
          {/* shimmer line that sweeps once on hover */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          >
            <span
              className="absolute top-0 h-full w-1/3 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-[1200ms] ease-out"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
              }}
            />
          </span>
          {/* inner surface */}
          <span className="relative flex items-center gap-3 rounded-full bg-[#07021c]/90 backdrop-blur-xl px-5 md:px-6 py-4 md:py-5 text-left overflow-hidden">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-cyan-300 shrink-0"
            >
              <path
                d="m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="relative flex-1 min-w-0 h-6 overflow-hidden">
              <motion.span
                className="absolute inset-0 flex flex-col text-base md:text-lg text-white/50 font-mono"
                animate={{
                  y: PLACEHOLDERS.map((_, i) => `-${i * 1.5}rem`),
                }}
                transition={{
                  duration: PLACEHOLDERS.length * 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: PLACEHOLDERS.map((_, i) => i / PLACEHOLDERS.length),
                }}
              >
                {PLACEHOLDERS.map((p, i) => (
                  <span key={i} className="h-6 leading-6 truncate">
                    {p}
                  </span>
                ))}
              </motion.span>
              {/* blinking caret */}
              <span
                aria-hidden
                className="absolute top-1/2 -translate-y-1/2 left-0 w-[2px] h-5 bg-cyan-300 animate-pulse opacity-0 pointer-events-none"
              />
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/15 bg-white/5 px-2 py-1 font-mono text-[11px] text-white/70 shrink-0">
              ⌘K
            </kbd>
          </span>
        </button>

        <p className="text-sm text-white/40">
          Suggerimento: puoi anche premere{" "}
          <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
            K
          </kbd>{" "}
          ovunque
        </p>
      </motion.div>

    </section>
  );
}
