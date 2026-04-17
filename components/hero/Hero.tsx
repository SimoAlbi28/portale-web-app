"use client";

import { motion } from "framer-motion";
import { ExploreButton } from "./ExploreButton";
import { HackingGame } from "@/components/game/HackingGame";
import { SectionSeparator } from "@/components/ui/SectionSeparator";

export function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] flex flex-col items-center overflow-hidden pt-20 pb-8 md:pt-24 md:pb-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(3,0,20,0.7)_55%,rgba(3,0,20,0.85)_75%,rgba(3,0,20,0.4)_92%,rgba(3,0,20,0)_100%)]" />

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
          <p className="max-w-xl text-base md:text-lg text-white/80 leading-relaxed mx-auto font-light">
            Scopri una collezione di web app pensate per{" "}
            <span className="text-cyan-300 font-medium">semplificarti la vita</span>:
            dalla gestione dei farmaci alle timbrature, dai pagamenti al diario
            scolastico. Tutto ciò che ti serve per organizzare al meglio la tua
            quotidianità, in un unico posto.
          </p>
          <div className="flex justify-center">
            <ExploreButton />
          </div>
        </motion.div>
      </div>

      <SectionSeparator />

      {/* Middle: game */}
      <div id="game" className="relative w-full flex-1 flex flex-col items-center">
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-mono">
            // Mini Game
          </span>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight mt-1">
            Hacker <span className="text-glow-cyan text-cyan-300">Game</span>
          </h3>
          <p className="text-white/50 text-sm mt-1 max-w-md mx-auto">
            Metti alla prova le tue abilità: trascina le lettere negli slot giusti per crackare la password. 100 livelli, difficoltà crescente.
          </p>
        </div>
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
