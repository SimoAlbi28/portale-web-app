"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, signUp, signInWithGoogle } from "@/lib/supabase/auth";

type Tab = "login" | "register";

export function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const reset = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (tab === "login") {
      const { error: err } = await signIn(email, password);
      if (err) setError(err.message);
      else {
        onClose();
        reset();
        window.location.reload();
      }
    } else {
      const { error: err } = await signUp(email, password);
      if (err) setError(err.message);
      else {
        setSuccess("Controlla la tua email per confermare la registrazione.");
      }
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    await signInWithGoogle();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[160] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[170] w-[min(400px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#07021c]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(34,211,238,0.2)] p-6"
          >
            {/* Tabs */}
            <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-0.5 mb-6">
              {(["login", "register"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                    tab === t
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {t === "login" ? "Accedi" : "Registrati"}
                </button>
              ))}
            </div>

            {/* Sync info */}
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] px-3 py-2.5 text-[11px] leading-relaxed text-white/70">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0 text-cyan-300"
                aria-hidden
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              <span>
                Accedi per ritrovare{" "}
                <span className="text-cyan-300">livello del gioco</span>,{" "}
                <span className="text-cyan-300">preferiti</span> e impostazioni
                aggiornati su ogni tuo dispositivo.
              </span>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              data-cursor="hover"
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm text-white/80 hover:bg-white/[0.06] hover:border-white/20 transition-colors mb-4"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continua con Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-white/30">
                oppure
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/50 transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/50 transition-colors"
              />

              {error && (
                <p className="text-xs text-red-400 px-1">{error}</p>
              )}
              {success && (
                <p className="text-xs text-emerald-400 px-1">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                data-cursor="hover"
                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-400 py-3 text-sm font-semibold text-black transition-opacity disabled:opacity-50 hover:opacity-90"
              >
                {loading
                  ? "..."
                  : tab === "login"
                  ? "Accedi"
                  : "Crea account"}
              </button>
            </form>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Chiudi"
              data-cursor="hover"
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
