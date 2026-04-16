"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apps, type AppCategory } from "@/lib/apps";
import { AppCard } from "@/components/cards/AppCard";
import { AppListRow } from "@/components/cards/AppListRow";
import { CategoryFilter } from "@/components/cards/CategoryFilter";
import { useSettings, type Sort } from "@/lib/settings";

export function AppsSection() {
  const [active, setActive] = useState<AppCategory | "all">("all");
  const [search, setSearch] = useState("");
  const {
    favorites,
    showFavoritesOnly,
    setShowFavoritesOnly,
    view,
    setView,
    sort,
    setSort,
  } = useSettings();

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

  const filtered = useMemo(() => {
    let list =
      active === "all" ? apps : apps.filter((a) => a.category === active);
    if (showFavoritesOnly) list = list.filter((a) => favorites.includes(a.slug));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "alpha") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "random") {
      sorted.sort(() => Math.random() - 0.5);
    } else {
      // "category" default: category asc, then alpha
      sorted.sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      );
    }
    return sorted;
  }, [active, showFavoritesOnly, favorites, sort, search]);

  const sortOptions: { id: Sort; label: string }[] = [
    { id: "category", label: "Categoria" },
    { id: "alpha", label: "A → Z" },
    { id: "random", label: "Random" },
  ];

  return (
    <section
      id="apps"
      className="relative mx-auto w-full max-w-7xl px-6 md:px-10 py-12 md:py-16"
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
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">
            <span className="text-glow-cyan text-cyan-300">Web App</span>
          </h2>
          <p className="max-w-xl text-white text-base">
            {apps.length} strumenti per la vita di tutti i giorni. Clicca una
            card per scoprire di più.
          </p>
          <p className="max-w-xl text-white/80 text-base leading-relaxed">
            Ogni app è realizzata come esempio dimostrativo. L&apos;estetica e le
            funzionalità possono essere{" "}
            <span className="text-cyan-300 font-semibold">personalizzate su misura</span> per
            la tua azienda o i tuoi gusti personali.
          </p>
          <a
            href="#contatti"
            data-cursor="hover"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contatti")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/[0.06] px-5 py-2 text-sm text-cyan-300 hover:bg-cyan-300/15 hover:border-cyan-300/60 transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contatta il creatore
          </a>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca un'app..."
              className="w-full rounded-full border border-white/15 bg-[#0a0420]/80 backdrop-blur-md pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/50 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            />
          </div>

          <CategoryFilter active={active} onChange={setActive} counts={counts} />

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {/* Favorites toggle */}
            <button
              type="button"
              data-cursor="hover"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              aria-pressed={showFavoritesOnly}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs border transition-colors ${
                showFavoritesOnly
                  ? "border-yellow-300/60 bg-yellow-300/10 text-yellow-200"
                  : "border-white/20 bg-[#0a0420]/85 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-white/80 hover:text-white"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={showFavoritesOnly ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinejoin="round"
              >
                <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" />
              </svg>
              Preferiti
              <span className="text-[10px] tabular-nums opacity-60">
                {favorites.length}
              </span>
            </button>

            {/* Sort */}
            <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#0a0420]/85 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)] p-0.5 text-xs">
              <span className="px-2 text-white/40 uppercase tracking-widest text-[10px]">
                Ordina
              </span>
              {sortOptions.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  data-cursor="hover"
                  onClick={() => setSort(o.id)}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    sort === o.id
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#0a0420]/85 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)] p-0.5 text-xs">
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setView("grid")}
                aria-label="Vista a griglia"
                aria-pressed={view === "grid"}
                className={`rounded-full px-2.5 py-1.5 transition-colors ${
                  view === "grid"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setView("list")}
                aria-label="Vista a lista"
                aria-pressed={view === "list"}
                className={`rounded-full px-2.5 py-1.5 transition-colors ${
                  view === "list"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/40"
          >
            {showFavoritesOnly
              ? "Nessuna app tra i preferiti. Clicca la stellina sulle card per aggiungerle."
              : "Nessuna app in questa categoria."}
          </motion.div>
        ) : view === "grid" ? (
          <motion.div
            key={`grid-${sort}-${active}-${showFavoritesOnly}`}
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-6"
          >
            {filtered.map((app, i) => (
              <AppCard key={app.slug} app={app} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`list-${sort}-${active}-${showFavoritesOnly}`}
            layout
            className="flex flex-col gap-2"
          >
            {filtered.map((app, i) => (
              <AppListRow key={app.slug} app={app} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
