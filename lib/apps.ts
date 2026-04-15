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
  features?: string[];
  category: AppCategory;
  url: string;
  icon: string;
  tech: string[];
  accentColor: string;
  screenshots?: string[];
  changelog?: ChangelogEntry[];
  /** Se true, l'icona ha bisogno di sfondo chiaro per essere leggibile. */
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
      "Gestione Farmaci è una Progressive Web App installabile che consente di tenere sotto controllo il proprio armadietto dei medicinali organizzandoli in cartelle tematiche personalizzabili. Ogni farmaco viene registrato con nome, data di scadenza, dosaggio, quantità e note libere, e l'app calcola automaticamente lo stato della scadenza mostrando avvisi gialli per i farmaci che scadranno entro 7 giorni e avvisi rossi per quelli già scaduti. Un sistema di notifiche centralizzato con icona a campanella elenca tutti i medicinali scaduti, permette di segnarli come visti e di rimuoverli singolarmente dalla lista. I dati sono persistiti in locale tramite localStorage, quindi l'app funziona totalmente offline e senza bisogno di account. Realizzata in React con Vite, utilizza un manifest PWA e icone dedicate per l'installazione sulla home screen di iOS e Android. È particolarmente utile per famiglie, anziani o caregiver che devono monitorare più confezioni e prevenire l'uso di prodotti scaduti.",
    features: [
      "Cartelle tematiche personalizzabili",
      "Avvisi scadenze a due livelli",
      "Notifiche centralizzate gestibili",
      "Salvataggio locale offline",
      "PWA installabile su mobile",
    ],
    category: "salute",
    url: "https://farmaci-eta.vercel.app/",
    icon: "/apps/farmaci/icon.png",
    tech: ["React 19", "Vite", "PWA", "JavaScript"],
    accentColor: "#22d3ee",
  },
  {
    slug: "green-village",
    name: "Green Village",
    tagline: "Manutenzioni condominiali con QR",
    description:
      "Green Village App è un'applicazione React+TypeScript collaborativa pensata per la gestione delle manutenzioni condominiali di un complesso residenziale, con autenticazione e sincronizzazione cloud tramite Supabase. Gli utenti si registrano con dati di profilo (nome, cognome, palazzina, telefono, avatar colorato) ed entrano in un'area riservata dove vedono in tempo reale quali altri consiglieri della stessa palazzina sono online, grazie al sistema di presence di Supabase. L'app organizza le manutenzioni in cartelle suddivise per anno, ciascuna contenente interventi a cui si possono associare note datate, e consente di collegare ogni manutenzione a un QR code fisico scansionabile con la fotocamera tramite la libreria html5-qrcode. Il flusso completo include login, registrazione, verifica email, modale di benvenuto e gestione profilo, rendendola uno strumento condiviso per amministratori e consiglieri di palazzina. È distribuita come PWA con tema personalizzato e icone dedicate per l'installazione mobile.",
    features: [
      "Autenticazione Supabase multi-utente",
      "Presence online per palazzina",
      "Scansione QR code manutenzioni",
      "Cartelle per anno con note",
      "Sincronizzazione cloud real-time",
    ],
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
    tagline: "Tracciamento manutenzioni offline",
    description:
      "Manutenzioni è la versione stand-alone e offline dell'app di gestione interventi, realizzata in React+TypeScript con Vite e pensata per un singolo utente che non necessita di account. Permette di creare cartelle identificate da un nome e da un anno a quattro cifre, all'interno delle quali si registrano le singole manutenzioni con nome, note datate espandibili e un eventuale ID QR associato. L'integrazione con html5-qrcode consente di scansionare QR code applicati fisicamente agli impianti o ai macchinari per aprire direttamente la scheda corrispondente, velocizzando il riconoscimento sul campo. Tutti i dati sono persistiti in localStorage e l'app è installabile come PWA con manifest, tema nero e icone dedicate. È adatta a tecnici, proprietari di immobili o piccole realtà che devono tenere uno storico ordinato degli interventi senza dipendere da un server. L'interfaccia mobile-first gestisce automaticamente lo scroll e il focus dei modali per un'esperienza fluida.",
    features: [
      "Archivio manutenzioni per anno",
      "Scansione QR code integrata",
      "Note datate espandibili",
      "Funzionamento 100% offline",
      "PWA installabile mobile",
    ],
    category: "lavoro",
    url: "https://progetto-finale-qrcode.vercel.app/",
    icon: "/apps/manutenzioni/icon.png",
    tech: ["React 19", "TypeScript", "Vite", "PWA", "Offline"],
    accentColor: "#f59e0b",
  },
  {
    slug: "rate",
    name: "Rate & Pagamenti",
    tagline: "Finanziamenti e rate sotto controllo",
    description:
      "Rate & Pagamenti è un'app React+TypeScript per tenere traccia di finanziamenti, prestiti e pagamenti rateizzati, con supporto sia in modalità ospite (solo locale) sia in modalità autenticata con sincronizzazione cloud tramite Supabase. Ogni finanziamento viene registrato con nome, emoji identificativa, importo totale, numero di rate, tipologia (mensile, bimestrale, trimestrale, quadrimestrale, semestrale o annuale), modalità fissa o variabile, date di inizio e fine, rate già pagate all'avvio e singoli pagamenti storici. Quando è impostata la rata fissa, l'app calcola automaticamente gli interessi totali e per singola rata. L'interfaccia offre pagine dedicate a Home, Dettaglio, Riepilogo, Cronologia, Profilo e Impostazioni con navigazione bottom-nav e routing via React Router, oltre a un tema automatico chiaro/scuro che si adatta all'orario (modalità scura dalle 20 alle 6). È utile a chiunque abbia più finanziamenti attivi e voglia monitorare scadenze, quote versate e interessi in un unico posto.",
    features: [
      "Gestione multi-finanziamento",
      "Calcolo automatico degli interessi",
      "Modalità ospite o cloud Supabase",
      "Tema chiaro/scuro automatico",
      "Cronologia pagamenti dettagliata",
    ],
    category: "produttivita",
    url: "https://rate-payments.vercel.app/",
    icon: "/apps/rate/icon.png",
    tech: ["React 19", "TypeScript", "Supabase", "xlsx", "React Router"],
    accentColor: "#ec4899",
  },
  {
    slug: "ricette",
    name: "Ricette",
    tagline: "Ricettario personale sempre offline",
    description:
      "Ricette App è una Progressive Web App in HTML, CSS e JavaScript vanilla che funziona da ricettario personale offline per raccogliere e consultare le proprie preparazioni culinarie. Ogni ricetta include titolo, immagine caricata dall'utente, tempo medio di preparazione, una lista di ingredienti con quantità e unità di misura, e una sequenza di azioni numerate ciascuna con un eventuale timer. Le ricette vengono ordinate automaticamente in ordine alfabetico italiano e sono filtrabili in tempo reale tramite una barra di ricerca con pulsante di reset; nella scheda dettaglio le azioni possono essere riordinate con drag-and-drop e la nuova sequenza viene salvata con numerazione aggiornata. I dati sono conservati in localStorage e un service worker registrato permette l'uso completamente offline e l'installazione come PWA su smartphone con icona dedicata. È perfetta per chi vuole un ricettario sempre a portata di mano, anche senza connessione, con un'estetica pulita in verde acqua e font Poppins.",
    features: [
      "Ricette con ingredienti e azioni",
      "Drag-and-drop riordino passaggi",
      "Immagini personalizzate per ricetta",
      "Ricerca alfabetica con filtro",
      "Funzionamento offline via service worker",
    ],
    category: "utility",
    url: "https://simoalbi28.github.io/ricette-app/index.html",
    icon: "/apps/ricette/icon.png",
    tech: ["Vanilla JS", "PWA", "Service Worker"],
    accentColor: "#a855f7",
  },
  {
    slug: "school-diary",
    name: "Diario Scolastico",
    tagline: "Diario e orario scolastico digitale",
    description:
      "Diario Scolastico è un'app React+TypeScript rivolta a studenti che unisce un diario digitale e un orario settimanale, con autenticazione Firebase e sincronizzazione cloud oltre al supporto della modalità ospite locale. Gli studenti possono inserire quattro tipologie di voci (nota, avviso, compito, verifica) con titolo, descrizione, data, materia e ora di lezione, segnare i compiti come completati con timestamp e beneficiare della pulizia automatica dei compiti completati da più di un mese. L'orario settimanale organizza le lezioni per giorno (dal lunedì al sabato) e ora, con materia, docente e aula, e consente di personalizzare i colori delle singole materie oltre ad aggiungere materie extra. La navigazione tra le pagine (Home, Orario, Riepilogo, Profilo, Impostazioni) usa una bottom-nav con gesture di swipe grazie a uno SwipeContext dedicato, mentre la logica di storage gestisce merge intelligente tra dati locali del guest e cloud al login. È uno strumento pratico per organizzare lo studio giornaliero e avere sempre sotto controllo le scadenze.",
    features: [
      "Diario con note, compiti, verifiche",
      "Orario settimanale personalizzabile",
      "Autenticazione Firebase e cloud",
      "Navigazione con swipe tra pagine",
      "Pulizia automatica compiti vecchi",
    ],
    category: "produttivita",
    url: "https://school-diary-nu.vercel.app/",
    icon: "/apps/school-diary/icon.png",
    tech: ["React 19", "TypeScript", "Firebase", "React Router"],
    accentColor: "#3b82f6",
  },
  {
    slug: "timbrature",
    name: "Timbrature",
    tagline: "Timbrature lavoro dal telefono",
    description:
      "Timbrature Lavoro è una PWA leggera in HTML e JavaScript vanilla per registrare velocemente gli ingressi e le uscite dal luogo di lavoro direttamente dal proprio telefono. Con i pulsanti \"Entrata\" e \"Uscita\" l'app timbra istantaneamente con data e ora correnti, mentre il pulsante \"Crea\" apre un form per inserire timbrature personalizzate specificando data, ora, tipo e una descrizione opzionale fino a 50 caratteri. Il riepilogo mostra tutte le timbrature registrate e include un filtro per data con pulsante di reset per tornare alla vista completa; l'app impedisce duplicati aggiornando automaticamente la timbratura esistente nello stesso giorno dello stesso tipo. Tutti i dati sono salvati in localStorage e un service worker garantisce il funzionamento completamente offline, con installazione come PWA grazie al manifest e al tema verde. È pensata per lavoratori autonomi, dipendenti o collaboratori che vogliono tenere un registro personale delle proprie ore senza affidarsi a sistemi aziendali.",
    features: [
      "Timbratura rapida Entrata/Uscita",
      "Timbrature personalizzate manuali",
      "Filtro riepilogo per data",
      "Archiviazione offline in locale",
      "Installabile come PWA",
    ],
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
      "To-Do Avanzata è una PWA in JavaScript vanilla che consente di pianificare attività personali con data e orario opzionale, supportando modifica, completamento e ordinamento cronologico automatico. Ogni task è salvato in localStorage insieme alla preferenza di attivazione delle notifiche browser, che l'app richiede all'avvio e che possono essere attivate o disattivate da un menù impostazioni con icona ingranaggio. L'interfaccia impedisce di inserire date passate e, se la data scelta è oggi, vincola l'ora a valori uguali o successivi a quello corrente. È presente una barra di ricerca per filtrare i task per data specifica con pulsante \"Mostra Tutti\" per tornare alla vista completa, oltre a un messaggio \"Libero!!!\" quando non ci sono impegni. Il service worker registrato rende l'app installabile come PWA e utilizzabile offline, con un tema verde acqua pulito e font di sistema. È uno strumento minimale ma curato per chi vuole un promemoria rapido senza account né servizi esterni.",
    features: [
      "Task con data e ora opzionale",
      "Notifiche browser attivabili",
      "Filtro ricerca per data",
      "Validazione date future",
      "PWA offline installabile",
    ],
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
