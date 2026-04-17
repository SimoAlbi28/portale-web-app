"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseClient } from "@/lib/supabase/client";
import { AuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import type { User } from "@supabase/supabase-js";

const NAV_ITEMS = [
  { label: "Hacker Game", href: "#game" },
  { label: "App", href: "#apps" },
  { label: "Contatti", href: "#contatti" },
];

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const hamburgerRef = useRef<HTMLButtonElement>(null);

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
    // If not on homepage, navigate there first
    if (window.location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
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
        className="fixed top-0 left-0 right-0 z-[100] bg-[#07021c]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Animated gradient border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent nav-glow-line" />
        <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-6 md:px-10">
          {/* Hamburger (mobile, left) */}
          <button
            ref={hamburgerRef}
            type="button"
            data-cursor="hover"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            className="md:hidden flex flex-col gap-1.5 items-center justify-center size-10 rounded-full border border-white/15 bg-black/40 shrink-0"
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

          {/* Logo (desktop, left) */}
          <button
            type="button"
            data-cursor="hover"
            onClick={() => scrollTo("#home")}
            className="hidden md:flex items-center gap-2.5 group shrink-0"
          >
            <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_theme(colors.cyan.300)] group-hover:shadow-[0_0_20px_theme(colors.cyan.300)] transition-shadow animate-pulse" />
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-white/90 group-hover:text-white transition-colors">
              Daily_Apps
            </span>
          </button>

          {/* Logo (mobile, centered between hamburger and right actions) */}
          <button
            type="button"
            data-cursor="hover"
            onClick={() => scrollTo("#home")}
            className="md:hidden flex items-center gap-2.5 group"
          >
            <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_theme(colors.cyan.300)] group-hover:shadow-[0_0_20px_theme(colors.cyan.300)] transition-shadow animate-pulse" />
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-white/90 group-hover:text-white transition-colors">
              Daily_Apps
            </span>
          </button>

          {/* Desktop nav items */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
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
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                {/* Desktop: text button */}
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setAuthOpen(true)}
                  className="hidden md:block rounded-full border border-cyan-300/40 bg-cyan-300/[0.06] px-5 py-2 text-sm text-cyan-300 hover:bg-cyan-300/15 hover:border-cyan-300/60 transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                >
                  Accedi
                </button>
                {/* Mobile: compact profile icon */}
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setAuthOpen(true)}
                  aria-label="Accedi"
                  className="md:hidden flex items-center justify-center size-10 rounded-full border border-white/15 bg-black/40 text-white/70 hover:text-white hover:border-cyan-300/60 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
              </>
            )}

            {/* Settings (inline, not fixed) */}
            <SettingsPanel inline />
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            items={NAV_ITEMS}
            onNavigate={scrollTo}
            onClose={() => setMobileOpen(false)}
            triggerRef={hamburgerRef}
          />
        )}
      </AnimatePresence>

      {/* Auth modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
