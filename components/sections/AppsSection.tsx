"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apps, type AppCategory } from "@/lib/apps";
import { AppCard } from "@/components/cards/AppCard";
import { CategoryFilter } from "@/components/cards/CategoryFilter";

export function AppsSection() {
  const [active, setActive] = useState<AppCategory | "all">("all");

  const counts = useMemo(() => {
    const base: Record<AppCategory | "all", number> = {
      all: apps.length,
      lavoro: 0,
      produttivita: 0,
      salute: 0,
      utility: 0,
    };
    for (const a of apps) base[a.category]++;
    return base;
  }, []);

  const filtered = useMemo(
    () => (active === "all" ? apps : apps.filter((a) => a.category === active)),
    [active]
  );

  return (
    <section
      id="apps"
      className="relative mx-auto w-full max-w-7xl px-6 md:px-10 py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-8 mb-10 md:mb-14"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-mono">
            // Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Tutte le <span className="text-glow-cyan text-cyan-300">web app</span>
          </h2>
          <p className="max-w-xl text-white/60">
            {apps.length} strumenti per la vita di tutti i giorni. Clicca una
            card per scoprire di più.
          </p>
        </div>
        <div className="flex justify-center w-full">
          <CategoryFilter active={active} onChange={setActive} counts={counts} />
        </div>
      </motion.div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-6"
      >
        {filtered.map((app, i) => (
          <AppCard key={app.slug} app={app} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
