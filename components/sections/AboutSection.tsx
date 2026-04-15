"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-5xl px-6 md:px-10 py-20 md:py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center text-center gap-4"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-fuchsia-300 font-mono">
          // Concept
        </span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
          <span className="text-glow-cyan text-cyan-300">Strumenti</span>{" "}
          pensati per organizzare la vita di tutti i giorni.
        </h2>
        <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
          Dalla to-do list al tracciamento delle manutenzioni industriali. Ogni
          app è uno strumento pratico, veloce e pensato per l&apos;uso
          quotidiano.
        </p>
      </motion.div>
    </section>
  );
}
