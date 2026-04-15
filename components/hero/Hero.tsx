"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(3,0,20,0.9)_100%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-white/70 font-mono">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_theme(colors.emerald.400)]" />
            Online
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
            <span className="block text-white text-glow-soft">Organizza</span>
            <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent text-glow-cyan">
              la tua giornata
            </span>
          </h1>
          <p className="max-w-xl text-base md:text-xl text-white/70 leading-relaxed mx-auto">
            Una collezione di web app per{" "}
            <span className="text-cyan-300">produttività</span>,{" "}
            <span className="text-fuchsia-300">lavoro</span> e{" "}
            <span className="text-violet-300">utility</span>. Tutto quello che
            ti serve per gestire le attività di tutti i giorni.
          </p>

          <div className="mt-4 flex justify-center">
            <a
              href="#apps"
              data-cursor="hover"
              className="rounded-full px-6 py-3 text-sm md:text-base font-semibold bg-gradient-to-r from-cyan-300 to-violet-300 text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-shadow"
            >
              Esplora le app
            </a>
          </div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-mono">
          Scroll
        </span>
        <motion.div
          className="h-10 w-[1px] bg-gradient-to-b from-cyan-300 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
