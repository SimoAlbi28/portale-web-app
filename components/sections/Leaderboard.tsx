"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createSupabaseClient } from "@/lib/supabase/client";

type Entry = {
  id: string;
  display_name: string;
  current_level: number;
  completed_count: number;
};

export function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase
      .from("leaderboard")
      .select("id, display_name, current_level, completed_count")
      .order("completed_count", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setEntries(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="leaderboard" className="relative mx-auto w-full max-w-7xl px-6 md:px-10 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-6 mb-10"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-mono">
          // Classifica
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Hacker <span className="text-glow-cyan text-cyan-300">Ranking</span>
        </h2>
        <p className="max-w-xl text-white/60">
          Chi ha crackato più password? Accedi e gioca per entrare in classifica.
        </p>
      </motion.div>

      <div className="mx-auto max-w-2xl">
        {loading ? (
          <div className="text-center text-white/30 py-12 text-sm">
            Caricamento...
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/40">
            Nessun giocatore ancora. Sii il primo!
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-[#07021c]/60 backdrop-blur-md overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[3rem_1fr_5rem_5rem] md:grid-cols-[3rem_1fr_6rem_6rem] gap-2 px-4 md:px-6 py-3 border-b border-white/[0.06] text-[10px] uppercase tracking-widest text-white/30">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">Livello</span>
              <span className="text-right">Completati</span>
            </div>

            {entries.map((entry, i) => {
              const rank = i + 1;
              const medal =
                rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={`grid grid-cols-[3rem_1fr_5rem_5rem] md:grid-cols-[3rem_1fr_6rem_6rem] gap-2 px-4 md:px-6 py-3 items-center transition-colors hover:bg-white/[0.02] ${
                    i < entries.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  <span className="text-sm font-mono text-white/40">
                    {medal ?? String(rank).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        rank <= 3
                          ? "bg-gradient-to-br from-cyan-400 to-violet-400 text-black"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {entry.display_name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                    <span className={`text-sm truncate ${rank <= 3 ? "text-white font-medium" : "text-white/70"}`}>
                      {entry.display_name}
                    </span>
                  </span>
                  <span className="text-right text-sm font-mono text-cyan-300/80">
                    {entry.current_level}
                  </span>
                  <span className="text-right text-sm font-mono text-emerald-300/80">
                    {entry.completed_count}/100
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
