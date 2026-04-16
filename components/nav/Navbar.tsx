"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseClient } from "@/lib/supabase/client";
import { AuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import type { User } from "@supabase/supabase-js";

const NAV_ITEMS = [
  { label: "Hacker Game", href: "#game" },
  { label: "About", href: "#about" },
  { label: "App", href: "#apps" },
  { label: "Contatti", href: "#contatti" },
];

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  // Listen to auth state
  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Track which section is currently in view based on scroll position
  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.href.replace("#", ""));

    const onScroll = () => {
      const trigger = window.innerHeight * 0.4;

      let current = ids[0]; // default to first
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= trigger && rect.bottom > trigger) {
          current = id;
        }
      }
      setActiveSection("#" + current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] bg-[#07021c]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_40px_rgba(34,211,238,0.03)]"
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-6 md:px-10">
          {/* Logo */}
          <button
            type="button"
            data-cursor="hover"
            onClick={() => scrollTo("#")}
            className="flex items-center gap-2.5 group"
          >
            <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_theme(colors.cyan.300)] group-hover:shadow-[0_0_20px_theme(colors.cyan.300)] transition-shadow" />
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-white/90 group-hover:text-white transition-colors">
              Daily_Apps
            </span>
          </button>

          {/* Desktop nav items */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  data-cursor="hover"
                  onClick={() => scrollTo(item.href)}
                  className={`relative px-4 py-2 text-sm transition-colors ${
                    isActive ? "text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-cyan-300 shadow-[0_0_10px_theme(colors.cyan.300)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Auth button / User menu (desktop) */}
            <div className="hidden md:block">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setAuthOpen(true)}
                  className="rounded-full border border-cyan-300/40 bg-cyan-300/[0.06] px-5 py-2 text-sm text-cyan-300 hover:bg-cyan-300/15 hover:border-cyan-300/60 transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                >
                  Accedi
                </button>
              )}
            </div>

            {/* Settings (inline, not fixed) */}
            <SettingsPanel inline />

            {/* Hamburger (mobile) */}
            <button
              type="button"
              data-cursor="hover"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
              className="md:hidden flex flex-col gap-1.5 items-center justify-center size-10 rounded-full border border-white/15 bg-black/40"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-px bg-white/80 origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-px bg-white/80"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-px bg-white/80 origin-center"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            items={NAV_ITEMS}
            user={user}
            onNavigate={scrollTo}
            onAuth={() => {
              setMobileOpen(false);
              setAuthOpen(true);
            }}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Auth modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
