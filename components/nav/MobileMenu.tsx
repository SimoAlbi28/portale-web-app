"use client";

import { motion } from "framer-motion";
import { signOut } from "@/lib/supabase/auth";
import type { User } from "@supabase/supabase-js";

type NavItem = { label: string; href: string };

export function MobileMenu({
  items,
  user,
  onNavigate,
  onAuth,
  onClose,
}: {
  items: NavItem[];
  user: User | null;
  onNavigate: (href: string) => void;
  onAuth: () => void;
  onClose: () => void;
}) {
  const handleSignOut = async () => {
    await signOut();
    onClose();
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] bg-[#030014]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden"
    >
      {items.map((item, i) => (
        <motion.button
          key={item.href}
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          onClick={() => onNavigate(item.href)}
          className="text-2xl font-medium text-white/80 hover:text-cyan-300 transition-colors tracking-wide"
        >
          {item.label}
        </motion.button>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: items.length * 0.06, duration: 0.3 }}
        className="mt-4"
      >
        {user ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-white/40">{user.email}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-red-400/40 px-6 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
            >
              Esci
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAuth}
            className="rounded-full border border-cyan-300/40 bg-cyan-300/[0.06] px-8 py-3 text-base text-cyan-300 hover:bg-cyan-300/15 transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          >
            Accedi
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
