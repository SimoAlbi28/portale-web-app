"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { AppMeta } from "@/lib/apps";
import { useSettings } from "@/lib/settings";

type Props = { app: AppMeta; index?: number };

function CardContent({ app }: { app: AppMeta }) {
  return (
    <>
      <div className="relative flex items-start gap-4">
        <div
          className={`shrink-0 rounded-xl p-2 ring-1 ring-white/10 ${
            app.iconNeedsLightBg ? "bg-white" : "bg-white/5"
          }`}
          style={{ boxShadow: `0 0 24px ${app.accentColor}30` }}
        >
          <Image
            src={app.icon}
            alt=""
            width={56}
            height={56}
            className="size-12 md:size-14 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white">
            {app.name}
          </h3>
          <p className="mt-1 text-sm text-white/60 line-clamp-2">
            {app.tagline}
          </p>
        </div>
      </div>

      <div className="relative mt-auto flex flex-wrap gap-1.5 pt-5">
        {app.tech.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-white/60 bg-white/[0.02]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="relative mt-6 flex items-center justify-between text-xs">
        <span
          className="uppercase tracking-[0.2em] font-mono"
          style={{ color: app.accentColor }}
        >
          {app.category}
        </span>
        <span
          className="inline-flex items-center gap-1"
          style={{ color: app.accentColor }}
        >
          Esplora
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14m-5-5 5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </>
  );
}

export function AppCard({ app, index = 0 }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { favorites, toggleFavorite, intensity } = useSettings();
  const isFav = favorites.includes(app.slug);
  const tiltDisabled = intensity === "off";

  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const springRX = useSpring(rotateX, { stiffness: 250, damping: 20 });
  const springRY = useSpring(rotateY, { stiffness: 250, damping: 20 });

  const glowX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  const bg = useMotionTemplate`radial-gradient(600px circle at ${glowX} ${glowY}, ${app.accentColor}33, transparent 40%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tiltDisabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90, y: 20 }}
      whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1400, transformStyle: "preserve-3d" }}
      className="group relative h-full"
    >
      <button
        type="button"
        data-cursor="hover"
        aria-label={isFav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        aria-pressed={isFav}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(app.slug);
        }}
        className={`absolute top-3 right-3 z-30 size-11 md:size-9 rounded-full flex items-center justify-center transition-colors ${
          isFav
            ? "bg-yellow-300/20 text-yellow-300 border border-yellow-300/40"
            : "bg-black/60 text-white/70 border border-white/20 hover:text-yellow-200 hover:bg-white/10 hover:border-yellow-300/40"
        }`}
        style={
          isFav
            ? { boxShadow: "0 0 18px rgba(253,224,71,0.5)" }
            : { boxShadow: "0 0 8px rgba(0,0,0,0.4)" }
        }
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={isFav ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
        >
          <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" />
        </svg>
      </button>
      <Link
        href={`/apps/${app.slug}`}
        data-cursor="hover"
        aria-label={`Vedi dettagli di ${app.name}`}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl"
      >
        <motion.div
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{
            rotateX: springRX,
            rotateY: springRY,
            transformStyle: "preserve-3d",
          }}
          className="relative h-full flex flex-col rounded-2xl border border-white/15 bg-[#0a0420]/85 backdrop-blur-xl p-5 md:p-6 overflow-hidden transition-colors min-h-[260px] shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: bg }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              boxShadow: `inset 0 0 0 1px ${app.accentColor}80, 0 0 30px ${app.accentColor}40`,
            }}
          />

          <CardContent app={app} />
        </motion.div>
      </Link>
    </motion.div>
  );
}
