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
          className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#0a0420]/85 backdrop-blur-md px-4 py-2 text-sm font-medium text-white/90 hover:text-cyan-200 hover:border-cyan-300/60 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] transition-all"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform group-hover:-translate-x-0.5"
          >
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
        className="mt-8 flex flex-col items-center text-center gap-6"
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
        <div className="flex flex-col items-center gap-3 max-w-3xl">
          <span
            className="inline-block text-xs uppercase tracking-[0.3em] font-mono"
            style={{ color: app.accentColor }}
          >
            {app.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {app.name}
          </h1>
          <p className="text-lg md:text-xl text-white/80">{app.tagline}</p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {app.tech.map((t) => (
              <span
                key={t}
                className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/15 text-white/80 bg-[#0a0420]/80 backdrop-blur-md font-mono"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href={`/?contact=demo&app=${app.slug}#contatti`}
              data-cursor="hover"
              className="rounded-full px-6 py-3 text-sm md:text-base font-semibold text-black transition-shadow inline-flex items-center gap-2"
              style={{
                background: `linear-gradient(90deg, ${app.accentColor}, #ffffff)`,
                boxShadow: `0 0 24px ${app.accentColor}80`,
              }}
            >
              Richiedi demo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </Link>
            <Link
              href={`/?contact=preventivo&app=${app.slug}#contatti`}
              data-cursor="hover"
              className="rounded-full px-6 py-3 text-sm md:text-base font-semibold text-white/90 border border-white/25 hover:border-white/50 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
            >
              Richiedi preventivo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m-5-5 5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          <p className="mt-2 text-xs text-white/40">
            Demo disponibile su richiesta — condivisione con link temporaneo personalizzato.
          </p>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-16 md:mt-24 flex flex-col items-center gap-6 md:gap-8 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-cyan-300">
            // Overview
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">
            Cosa fa questa app
          </h2>
        </div>

        {app.detailSections && app.detailSections.length > 0 ? (
          <div className="w-full max-w-3xl grid grid-cols-1 gap-4 md:gap-5 text-left">
            {app.detailSections.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-white/15 bg-[#0a0420]/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{
                      background: app.accentColor,
                      boxShadow: `0 0 10px ${app.accentColor}`,
                    }}
                  />
                  <h3
                    className="text-base md:text-lg font-semibold uppercase tracking-[0.15em]"
                    style={{ color: app.accentColor }}
                  >
                    {s.title}
                  </h3>
                </div>
                {s.body && (
                  <p className="text-white/85 text-sm md:text-base leading-relaxed">
                    {s.body}
                  </p>
                )}
                {s.items && s.items.length > 0 && (
                  <ul
                    className={`grid grid-cols-1 gap-2 text-sm md:text-[15px] text-white/85 ${
                      s.body ? "mt-4 pt-4 border-t border-white/10" : ""
                    }`}
                  >
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2.5 leading-relaxed"
                      >
                        <span
                          className="mt-2 size-1.5 rounded-full shrink-0"
                          style={{
                            background: app.accentColor,
                            boxShadow: `0 0 6px ${app.accentColor}`,
                          }}
                        />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {app.features && app.features.length > 0 && (
              <div className="rounded-2xl border border-white/15 bg-[#0a0420]/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{
                      background: app.accentColor,
                      boxShadow: `0 0 10px ${app.accentColor}`,
                    }}
                  />
                  <h3
                    className="text-base md:text-lg font-semibold uppercase tracking-[0.15em]"
                    style={{ color: app.accentColor }}
                  >
                    Highlights
                  </h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {app.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-white/85"
                    >
                      <span
                        className="mt-1.5 size-1.5 rounded-full shrink-0"
                        style={{
                          background: app.accentColor,
                          boxShadow: `0 0 8px ${app.accentColor}`,
                        }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-[#0a0420]/90 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-6 text-left">
            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              {app.description}
            </p>
            {app.features && app.features.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                {app.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-white/85"
                  >
                    <span
                      className="mt-1.5 size-1.5 rounded-full shrink-0"
                      style={{
                        background: app.accentColor,
                        boxShadow: `0 0 8px ${app.accentColor}`,
                      }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </motion.section>

      {/* Pacchetto & Servizi */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-16 md:mt-24 flex flex-col items-center gap-6 md:gap-8 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-fuchsia-300">
            // Pacchetto
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">Come la ottieni</h2>
          <p className="max-w-2xl text-white/60 text-sm md:text-base">
            Ogni app è un progetto su misura: il codice viene riadattato, brandizzato e consegnato pronto all&apos;uso.
          </p>
        </div>
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div
            className="rounded-2xl border border-white/15 bg-[#0a0420]/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: app.accentColor }}>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: app.accentColor }}>
                Prezzo
              </h3>
            </div>
            <p className="text-white font-semibold text-lg">Su richiesta</p>
            <p className="text-white/60 text-xs mt-1">In base alle personalizzazioni necessarie.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-[#0a0420]/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: app.accentColor }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: app.accentColor }}>
                Tempi
              </h3>
            </div>
            <p className="text-white font-semibold text-lg">2 – 4 settimane</p>
            <p className="text-white/60 text-xs mt-1">Variano in base all&apos;entità delle modifiche richieste.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-[#0a0420]/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: app.accentColor }}>
                <path d="M20 7 9 18l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: app.accentColor }}>
                Include
              </h3>
            </div>
            <ul className="text-white/80 text-sm space-y-1.5">
              <li>• Deploy e configurazione</li>
              <li>• Brandizzazione completa</li>
              <li>• Dominio e hosting iniziale</li>
              <li>• Documentazione di utilizzo</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Personalizzazioni disponibili */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-16 md:mt-24 flex flex-col items-center gap-6 md:gap-8 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-violet-300">
            // Custom
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">Personalizzazioni disponibili</h2>
          <p className="max-w-2xl text-white/60 text-sm md:text-base">
            L&apos;app base è un punto di partenza: ogni elemento può essere adattato al tuo caso d&apos;uso.
          </p>
        </div>
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {[
            {
              title: "Brand & estetica",
              desc: "Logo, palette colori, font, icona PWA, nome e claim dell'applicazione.",
            },
            {
              title: "Cloud o offline",
              desc: "Sincronizzazione cloud multi-utente (Supabase / Firebase) oppure funzionamento 100% offline.",
            },
            {
              title: "Multi-utente e ruoli",
              desc: "Autenticazione, inviti, permessi differenziati (admin, editor, viewer).",
            },
            {
              title: "Nuove funzioni",
              desc: "Campi aggiuntivi, integrazioni con i tuoi gestionali, export Excel/PDF, notifiche mirate.",
            },
            {
              title: "Integrazioni esterne",
              desc: "Google Calendar, Drive, webhook, invio SMS/email, API custom.",
            },
            {
              title: "Supporto e manutenzione",
              desc: "Piani di assistenza, aggiornamenti periodici, formazione del team.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="size-1.5 rounded-full"
                  style={{
                    background: app.accentColor,
                    boxShadow: `0 0 8px ${app.accentColor}`,
                  }}
                />
                <h4 className="font-semibold text-white text-sm">{c.title}</h4>
              </div>
              <p className="text-white/65 text-xs leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
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

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-16 md:mt-24"
      >
        <div
          className="rounded-3xl border bg-[#0a0420]/90 backdrop-blur-xl p-8 md:p-10 text-center"
          style={{
            borderColor: `${app.accentColor}55`,
            boxShadow: `0 0 60px ${app.accentColor}22`,
          }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Ti interessa <span style={{ color: app.accentColor }}>{app.name}</span>?
          </h3>
          <p className="text-white/70 max-w-xl mx-auto mb-6">
            Scrivimi e ti mando una demo dedicata con link temporaneo, oppure parliamo insieme delle personalizzazioni per il tuo caso d&apos;uso.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/?contact=demo&app=${app.slug}#contatti`}
              data-cursor="hover"
              className="rounded-full px-6 py-3 text-sm font-semibold text-black inline-flex items-center gap-2"
              style={{
                background: `linear-gradient(90deg, ${app.accentColor}, #ffffff)`,
                boxShadow: `0 0 24px ${app.accentColor}80`,
              }}
            >
              Richiedi demo
            </Link>
            <Link
              href={`/?contact=preventivo&app=${app.slug}#contatti`}
              data-cursor="hover"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white/90 border border-white/25 hover:border-white/50 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
            >
              Richiedi preventivo
            </Link>
          </div>
        </div>
      </motion.section>
    </article>
  );
}
