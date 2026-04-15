"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { AppMeta } from "@/lib/apps";
import { useSettings } from "@/lib/settings";

export function AppListRow({ app, index = 0 }: { app: AppMeta; index?: number }) {
  const { favorites, toggleFavorite } = useSettings();
  const isFav = favorites.includes(app.slug);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.25) }}
      className="relative"
    >
      <Link
        href={`/apps/${app.slug}`}
        data-cursor="hover"
        className="flex items-center gap-4 rounded-xl border border-white/15 bg-[#0a0420]/85 backdrop-blur-xl px-3 py-3 hover:border-white/30 hover:bg-[#0a0420]/95 transition-colors shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
        style={{
          boxShadow: `inset 0 0 0 0 ${app.accentColor}`,
        }}
      >
        <div
          className={`shrink-0 rounded-lg p-1.5 ring-1 ring-white/10 ${
            app.iconNeedsLightBg ? "bg-white" : "bg-white/5"
          }`}
          style={{ boxShadow: `0 0 14px ${app.accentColor}30` }}
        >
          <Image
            src={app.icon}
            alt=""
            width={40}
            height={40}
            className="size-8 md:size-10 object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-semibold text-white truncate">
              {app.name}
            </h3>
            <span
              className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] font-mono"
              style={{ color: app.accentColor }}
            >
              {app.category}
            </span>
          </div>
          <p className="mt-0.5 text-xs md:text-sm text-white/50 truncate">
            {app.tagline}
          </p>
        </div>
        <div className="hidden md:flex gap-1.5">
          {app.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-white/60"
            >
              {t}
            </span>
          ))}
        </div>
        <span
          className="shrink-0 text-xs inline-flex items-center gap-1"
          style={{ color: app.accentColor }}
        >
          Apri
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14m-5-5 5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
      <button
        type="button"
        data-cursor="hover"
        aria-label={isFav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        aria-pressed={isFav}
        onClick={() => toggleFavorite(app.slug)}
        className={`absolute top-1/2 -translate-y-1/2 right-[100%] mr-2 size-8 rounded-full hidden md:flex items-center justify-center transition-colors ${
          isFav
            ? "text-yellow-300"
            : "text-white/30 hover:text-yellow-200"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={isFav ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
        >
          <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" />
        </svg>
      </button>
    </motion.div>
  );
}
