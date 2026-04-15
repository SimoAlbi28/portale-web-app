export type AppCategory = "lavoro" | "produttivita" | "salute" | "utility";

export type ChangelogEntry = {
  version: string;
  date: string;
  notes: string;
};

export type AppMeta = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: AppCategory;
  url: string;
  icon: string;
  tech: string[];
  accentColor: string;
  screenshots?: string[];
  changelog?: ChangelogEntry[];
  /** Se true, l'icona ha bisogno di sfondo chiaro per essere leggibile (es. loghi su tema chiaro). */
  iconNeedsLightBg?: boolean;
};

export const categories: { id: AppCategory | "all"; label: string }[] = [
  { id: "all", label: "Tutte" },
  { id: "lavoro", label: "Lavoro" },
  { id: "produttivita", label: "Produttività" },
  { id: "salute", label: "Salute" },
  { id: "utility", label: "Utility" },
];

export const apps: AppMeta[] = [
  {
    slug: "farmaci",
    name: "Farmaci",
    tagline: "Gestisci farmaci e scadenze",
    description:
      "App per la gestione dei farmaci e delle loro scadenze. Permette di tenere sotto controllo la scorta casalinga e ricevere promemoria per farmaci in scadenza.",
    category: "salute",
    url: "https://farmaci-eta.vercel.app/",
    icon: "/apps/farmaci/icon.png",
    tech: ["React 19", "Vite", "PWA", "JavaScript"],
    accentColor: "#22d3ee",
  },
  {
    slug: "green-village",
    name: "Green Village",
    tagline: "Manutenzioni Green Village con scansione QR",
    description:
      "Applicazione per registrare e gestire le manutenzioni del Green Village, con organizzazione per cartelle e anni, scansione QR dei macchinari, ricerca e gestione note. Persistenza tramite Supabase.",
    category: "lavoro",
    url: "https://green-village-app.vercel.app/",
    icon: "/apps/green-village/icon.png",
    tech: ["React 19", "TypeScript", "Vite", "Supabase", "QR Scanner"],
    accentColor: "#22c55e",
    iconNeedsLightBg: true,
  },
  {
    slug: "manutenzioni",
    name: "Manutenzioni",
    tagline: "Tracciamento manutenzioni macchinari",
    description:
      "Sistema per registrare, organizzare e tracciare interventi di manutenzione su macchinari e impianti. Funziona offline grazie a localStorage e Service Worker, include scanner QR, ricerca in tempo reale e copia dati tra periodi.",
    category: "lavoro",
    url: "https://progetto-finale-qrcode.vercel.app/",
    icon: "/apps/manutenzioni/icon.png",
    tech: ["React 19", "TypeScript", "Vite", "PWA", "Offline"],
    accentColor: "#f59e0b",
  },
  {
    slug: "rate",
    name: "Rate & Pagamenti",
    tagline: "Gestisci rate e pagamenti ricorrenti",
    description:
      "App per la gestione di rate e pagamenti ricorrenti. Supporta export/import dati via Excel, routing multi-pagina e persistenza tramite Supabase.",
    category: "produttivita",
    url: "https://rate-payments.vercel.app/",
    icon: "/apps/rate/icon.png",
    tech: ["React 19", "TypeScript", "Supabase", "xlsx", "React Router"],
    accentColor: "#ec4899",
  },
  {
    slug: "ricette",
    name: "Ricette",
    tagline: "Le tue ricette, sempre offline",
    description:
      "PWA per gestire ricette di cucina: aggiunta, modifica ed eliminazione con titolo, immagine, ingredienti e azioni ordinabili via drag & drop. Ricerca rapida e salvataggio offline tramite Service Worker.",
    category: "utility",
    url: "https://simoalbi28.github.io/ricette-app/index.html",
    icon: "/apps/ricette/icon.png",
    tech: ["Vanilla JS", "PWA", "Service Worker"],
    accentColor: "#a855f7",
  },
  {
    slug: "school-diary",
    name: "Diario Scolastico",
    tagline: "Il tuo diario scolastico digitale",
    description:
      "Diario scolastico digitale per tracciare compiti, voti, materie e orario. Integra Firebase per sync cloud e supporta routing multi-pagina.",
    category: "produttivita",
    url: "https://school-diary-nu.vercel.app/",
    icon: "/apps/school-diary/icon.png",
    tech: ["React 19", "TypeScript", "Firebase", "React Router"],
    accentColor: "#3b82f6",
  },
  {
    slug: "timbrature",
    name: "Timbrature",
    tagline: "Timbrature di lavoro offline",
    description:
      "PWA per la registrazione delle timbrature di lavoro: entrata/uscita veloce, timbrature personalizzate, modifica/eliminazione, filtro per data e riepilogo giornaliero con calcolo automatico ore. Funziona offline.",
    category: "lavoro",
    url: "https://simoalbi28.github.io/TIMBRATURE-APP/index.html",
    icon: "/apps/timbrature/icon.png",
    tech: ["Vanilla JS", "PWA", "Service Worker"],
    accentColor: "#14b8a6",
  },
  {
    slug: "todo-list",
    name: "To-Do List",
    tagline: "Task manager con notifiche",
    description:
      "App to-do list con notifiche e gestione avanzata dei task. Inserimento descrizione task, impostazioni con toggle notifiche, salvataggio locale.",
    category: "produttivita",
    url: "https://simoalbi28.github.io/TODO-LIST-APP/",
    icon: "/apps/todo-list/icon.png",
    tech: ["Vanilla JS", "PWA", "Notifications"],
    accentColor: "#ef4444",
  },
];

export function getAppBySlug(slug: string): AppMeta | undefined {
  return apps.find((a) => a.slug === slug);
}
