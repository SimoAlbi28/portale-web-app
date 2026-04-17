"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createSupabaseClient } from "@/lib/supabase/client";
import { apps } from "@/lib/apps";
import type { User } from "@supabase/supabase-js";

export function ContactSection() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u) {
        setUser(u);
        setEmail(u.email ?? "");
        setName(u.user_metadata?.full_name ?? u.email?.split("@")[0] ?? "");
      }
    });
  }, []);

  // Pre-fill from URL: ?contact=demo|preventivo&app=slug
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const type = params.get("contact");
    const slug = params.get("app");
    if (!type && !slug) return;
    const app = slug ? apps.find((a) => a.slug === slug) : undefined;
    const appName = app?.name ?? "";
    if (type === "demo") {
      setSubject(appName ? `Richiesta demo — ${appName}` : "Richiesta demo");
      setBody(
        appName
          ? `Ciao, vorrei vedere una demo di ${appName}. Sono interessato a capire se può adattarsi al mio caso d'uso.`
          : "Ciao, vorrei vedere una demo di una delle tue app."
      );
    } else if (type === "preventivo") {
      setSubject(
        appName ? `Richiesta preventivo — ${appName}` : "Richiesta preventivo"
      );
      setBody(
        appName
          ? `Ciao, vorrei ricevere un preventivo per ${appName}.\n\nPersonalizzazioni richieste:\n- \n\nTempistiche ideali:\n- `
          : "Ciao, vorrei ricevere un preventivo per una delle tue app."
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);

    const supabase = createSupabaseClient();

    if (!user) {
      setError("Devi essere loggato per inviare un messaggio.");
      setSending(false);
      return;
    }

    const { error: err } = await supabase.from("messages").insert({
      user_id: user.id,
      email,
      name,
      subject,
      body,
    });

    if (err) {
      setError(err.message);
    } else {
      setSent(true);
      setSubject("");
      setBody("");
    }
    setSending(false);
  };

  return (
    <section id="contatti" className="relative w-full py-12 md:py-16">
      <div className="absolute inset-0 bg-[#07021c]/80 backdrop-blur-sm" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-6 mb-10"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-mono">
          // Contatti
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Scrivimi un <span className="text-glow-cyan text-cyan-300">messaggio</span>
        </h2>
        <p className="max-w-xl text-white/60">
          Hai domande su un&apos;app? Vuoi suggerire una feature? Scrivimi direttamente.
        </p>
      </motion.div>

      <div className="mx-auto max-w-lg">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.05] p-8 text-center"
          >
            <div className="text-4xl mb-3">✓</div>
            <p className="text-emerald-300 font-medium mb-1">Messaggio inviato!</p>
            <p className="text-white/50 text-sm">Ti risponderò il prima possibile.</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-cyan-300 hover:underline"
            >
              Invia un altro messaggio
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/60 mb-1.5 ml-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Il tuo nome"
                  className="w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyan-300/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/60 mb-1.5 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="la@tua.email"
                  className="w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyan-300/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/60 mb-1.5 ml-1">
                Oggetto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Di cosa si tratta?"
                className="w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyan-300/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/60 mb-1.5 ml-1">
                Messaggio
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={5}
                placeholder="Scrivi il tuo messaggio..."
                className="w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyan-300/50 transition-colors resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-400 px-1">{error}</p>}

            {!user && (
              <p className="text-xs text-yellow-300/70 px-1">
                Devi essere loggato per inviare un messaggio.
              </p>
            )}

            <button
              type="submit"
              disabled={sending || !user}
              data-cursor="hover"
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-400 py-3 text-sm font-semibold text-black transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              {sending ? "Invio..." : "Invia messaggio"}
            </button>
          </form>
        )}
      </div>
      </div>
    </section>
  );
}
