"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apps } from "@/lib/apps";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tech.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-cmdk", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-cmdk", onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) {
      document.body.style.paddingRight = `${scrollbarW}px`;
    }
    const lenis = window.__lenis__;
    lenis?.stop();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const app = results[activeIdx];
      if (app) {
        router.push(`/apps/${app.slug}`);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-start justify-center pt-[12vh] px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#07021c]/95 backdrop-blur-xl shadow-[0_0_80px_rgba(168,85,247,0.3)] overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-cyan-300"
                >
                  <path
                    d="m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Cerca un'app, categoria o tech..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30"
                />
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/50">
                  Esc
                </kbd>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="px-4 py-10 text-center text-white/40 text-sm">
                    Nessun risultato per &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  results.map((app, i) => {
                    const isActive = i === activeIdx;
                    return (
                      <Link
                        key={app.slug}
                        href={`/apps/${app.slug}`}
                        data-cursor="hover"
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setActiveIdx(i)}
                        className={`flex items-center gap-4 rounded-lg px-3 py-3 transition-colors ${
                          isActive
                            ? "bg-white/[0.06]"
                            : "hover:bg-white/[0.03]"
                        }`}
                      >
                        <div
                          className={`shrink-0 rounded-lg p-1.5 ring-1 ring-white/10 ${
                            app.iconNeedsLightBg ? "bg-white" : "bg-white/5"
                          }`}
                        >
                          <Image
                            src={app.icon}
                            alt=""
                            width={32}
                            height={32}
                            className="size-7 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {app.name}
                          </div>
                          <div className="text-xs text-white/50 truncate">
                            {app.tagline}
                          </div>
                        </div>
                        <span
                          className="text-[10px] uppercase tracking-[0.2em] font-mono shrink-0"
                          style={{ color: app.accentColor }}
                        >
                          {app.category}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-5 py-2.5 text-[11px] text-white/40 font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0.5">
                      ↑↓
                    </kbd>
                    naviga
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0.5">
                      ⏎
                    </kbd>
                    apri
                  </span>
                </div>
                <span>{results.length} risultati</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
