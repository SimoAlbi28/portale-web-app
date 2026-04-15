"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { AppMeta } from "@/lib/apps";

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
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);

  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const springRX = useSpring(rotateX, { stiffness: 250, damping: 20 });
  const springRY = useSpring(rotateY, { stiffness: 250, damping: 20 });

  const glowX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  const bg = useMotionTemplate`radial-gradient(600px circle at ${glowX} ${glowY}, ${app.accentColor}33, transparent 40%)`;

  const LENS_RADIUS = 55;
  const LENS_SCALE = 1.8;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    x.set(px / rect.width - 0.5);
    y.set(py / rect.height - 0.5);
    setLens({ x: px, y: py });
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
    setLens(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      style={{ perspective: 1200 }}
      className="group relative h-full"
    >
      <Link
        href={`/apps/${app.slug}`}
        data-cursor="lens"
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
          className="relative h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 md:p-6 overflow-hidden transition-colors min-h-[260px]"
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

          {/* Magnifier lens — zoomed clone clipped to a circle following the cursor */}
          {lens && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
              style={{
                clipPath: `circle(${LENS_RADIUS}px at ${lens.x}px ${lens.y}px)`,
                WebkitClipPath: `circle(${LENS_RADIUS}px at ${lens.x}px ${lens.y}px)`,
              }}
            >
              {/* scaled copy of the card content */}
              <div
                className="absolute inset-0 flex flex-col p-5 md:p-6"
                style={{
                  transform: `scale(${LENS_SCALE})`,
                  transformOrigin: `${lens.x}px ${lens.y}px`,
                  background: "rgba(3,0,20,0.98)",
                }}
              >
                <CardContent app={app} />
              </div>
              {/* lens frame glow */}
              <div
                className="absolute rounded-full"
                style={{
                  left: lens.x - LENS_RADIUS,
                  top: lens.y - LENS_RADIUS,
                  width: LENS_RADIUS * 2,
                  height: LENS_RADIUS * 2,
                  boxShadow: `inset 0 0 0 1.5px ${app.accentColor}, 0 0 24px ${app.accentColor}66, inset 0 0 18px ${app.accentColor}33`,
                }}
              />
            </div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
