"use client";

import { motion } from "framer-motion";
import { categories, type AppCategory } from "@/lib/apps";

type Props = {
  active: AppCategory | "all";
  onChange: (id: AppCategory | "all") => void;
  counts: Record<AppCategory | "all", number>;
};

export function CategoryFilter({ active, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {categories.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            type="button"
            data-cursor="hover"
            onClick={() => onChange(c.id)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "text-black"
                : "text-white/80 hover:text-white border border-white/20 bg-[#0a0420]/85 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            }`}
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {c.label}
              <span
                className={`text-[10px] tabular-nums ${
                  isActive ? "text-black/60" : "text-white/40"
                }`}
              >
                {counts[c.id] ?? 0}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
