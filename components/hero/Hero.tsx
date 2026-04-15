"use client";

import { motion } from "framer-motion";
import { ExploreButton } from "./ExploreButton";
import { HackingGame } from "@/components/game/HackingGame";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center overflow-hidden pt-16 pb-8 md:pt-20 md:pb-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(3,0,20,0.9)_100%)]" />

      {/* Top: title + tagline + button */}
      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 md:gap-4 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/70 font-mono">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_theme(colors.emerald.400)]" />
            Online
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-5xl">
            <span className="block text-white text-glow-soft">
              L&apos;organizzazione
            </span>
            <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent text-glow-cyan">
              sempre a portata di mano
            </span>
          </h1>
          <p className="max-w-xl text-base md:text-lg text-white/80 leading-snug mx-auto font-light">
            Otto app. Un solo launcher.{" "}
            <span className="text-cyan-300 font-medium">Zero caos.</span>
          </p>
          <div className="flex justify-center">
            <ExploreButton />
          </div>
        </motion.div>
      </div>

      {/* Middle: game */}
      <div className="relative w-full mt-6 md:mt-8 flex-1 flex items-center">
        <HackingGame />
      </div>

      {/* Bottom: scroll indicator */}
      <motion.div
        aria-hidden
        className="relative flex flex-col items-center gap-2 text-white/50 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-mono">
          Scroll
        </span>
        <motion.div
          className="h-7 w-[1px] bg-gradient-to-b from-cyan-300 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
