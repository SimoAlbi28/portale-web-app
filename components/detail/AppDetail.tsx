"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { AppMeta } from "@/lib/apps";

type Props = { app: AppMeta };

export function AppDetail({ app }: Props) {
  return (
    <article className="relative mx-auto w-full max-w-5xl px-6 md:px-10 pt-24 md:pt-32 pb-16">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/"
          data-cursor="hover"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-cyan-300 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5m5-5-5 5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Torna al portale
        </Link>
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 flex flex-col md:flex-row gap-6 md:gap-10 md:items-center"
      >
        <div
          className={`shrink-0 rounded-3xl p-4 ring-1 ring-white/10 w-fit ${
            app.iconNeedsLightBg ? "bg-white" : "bg-white/5"
          }`}
          style={{ boxShadow: `0 0 40px ${app.accentColor}40` }}
        >
          <Image
            src={app.icon}
            alt={`Logo ${app.name}`}
            width={112}
            height={112}
            className="size-20 md:size-28 object-contain"
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-xs uppercase tracking-[0.3em] font-mono"
            style={{ color: app.accentColor }}
          >
            {app.category}
          </span>
          <h1 className="mt-2 text-4xl md:text-6xl font-bold tracking-tight">
            {app.name}
          </h1>
          <p className="mt-3 text-lg md:text-xl text-white/70">{app.tagline}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {app.tech.map((t) => (
              <span
                key={t}
                className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 text-white/70 bg-white/[0.02] font-mono"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="rounded-full px-6 py-3 text-sm md:text-base font-semibold text-black transition-shadow inline-flex items-center gap-2"
              style={{
                background: `linear-gradient(90deg, ${app.accentColor}, #ffffff)`,
                boxShadow: `0 0 24px ${app.accentColor}80`,
              }}
            >
              Apri l&apos;app
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17 17 7m0 0H9m8 0v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-16 md:mt-24 grid gap-10 md:gap-16 md:grid-cols-[1fr_2fr]"
      >
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-cyan-300">
            // Overview
          </span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold">
            Cosa fa questa app
          </h2>
        </div>
        <p className="text-white/70 text-base md:text-lg leading-relaxed">
          {app.description}
        </p>
      </motion.section>

      {app.screenshots && app.screenshots.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-24"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-fuchsia-300">
            // Screenshots
          </span>
          <h2 className="mt-3 mb-6 text-2xl md:text-3xl font-bold">Galleria</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {app.screenshots.map((src, i) => (
              <div
                key={src}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 aspect-video"
              >
                <Image
                  src={src}
                  alt={`${app.name} screenshot ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {app.changelog && app.changelog.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-24"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-violet-300">
            // Changelog
          </span>
          <h2 className="mt-3 mb-6 text-2xl md:text-3xl font-bold">
            Aggiornamenti
          </h2>
          <ul className="space-y-4">
            {app.changelog.map((c) => (
              <li
                key={c.version}
                className="flex flex-col md:flex-row gap-2 md:gap-6 border-l-2 pl-4 py-1"
                style={{ borderColor: app.accentColor }}
              >
                <div className="md:w-32 shrink-0 font-mono text-sm text-white/60">
                  <div style={{ color: app.accentColor }}>v{c.version}</div>
                  <div className="text-white/40 text-xs">{c.date}</div>
                </div>
                <p className="text-white/70">{c.notes}</p>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {(!app.screenshots || app.screenshots.length === 0) && (
        <div className="mt-16 rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/40 text-sm">
          Screenshot in arrivo — la galleria sarà disponibile a breve.
        </div>
      )}
    </article>
  );
}
