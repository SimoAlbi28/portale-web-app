"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "@/lib/supabase/auth";
import type { User } from "@supabase/supabase-js";

export function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = (
    user.user_metadata?.full_name?.[0] ??
    user.email?.[0] ??
    "U"
  ).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    window.location.reload();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-cursor="hover"
        onClick={() => setOpen((o) => !o)}
        className="size-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-400 flex items-center justify-center text-sm font-bold text-black transition-shadow hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
      >
        {initial}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-white/10 bg-[#07021c]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-2"
          >
            <div className="px-3 py-2 border-b border-white/10 mb-1">
              <p className="text-xs text-white/50 truncate">
                {user.email}
              </p>
            </div>
            <button
              type="button"
              data-cursor="hover"
              onClick={handleSignOut}
              className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
            >
              Esci
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
