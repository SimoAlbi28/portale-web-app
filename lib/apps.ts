export type AppCategory = "lavoro" | "produttivita" | "salute" | "utility";

export type ChangelogEntry = {
  version: string;
  date: string;
  notes: string;
};

export type DetailSection = {
  title: string;
  body?: string;
  items?: string[];
};

export type AppMeta = {
  slug: string;
  name: string;
  tagline: string;
  /** Pitch breve e allettante mostrato nelle card. */
  pitch?: string;
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
  /** Sezioni dettagliate per la pagina di dettaglio (Obiettivo, Funzionalità, ecc.). */
  detailSections?: DetailSection[];
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
    pitch:
      "Non avere mai più un farmaco scaduto in casa: organizza l'armadietto, ricevi avvisi in tempo reale e dormi sonni tranquilli.",
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
    detailSections: [
      {
        title: "Obiettivo",
        body: "Tenere sotto controllo l'armadietto dei medicinali in modo semplice e immediato, evitando di trovarsi con farmaci scaduti al momento del bisogno. Nessun account, nessun server: tutto avviene sul telefono, anche offline.",
      },
      {
        title: "Cosa puoi fare",
        items: [
          "Creare cartelle tematiche personalizzabili (es. Febbre, Stomaco, Bambini) con nome e icona.",
          "Aggiungere farmaci specificando nome, data di scadenza, dosaggio, quantità residua e note libere.",
          "Modificare o eliminare in qualsiasi momento cartelle e farmaci.",
          "Cercare un farmaco direttamente tra le cartelle con ricerca istantanea.",
          "Visualizzare lo stato di scadenza a colpo d'occhio: verde se sicuro, giallo entro 7 giorni, rosso se scaduto.",
          "Ricevere tutti gli avvisi in un unico pannello con icona a campanella, segnare i farmaci come visti e rimuoverli dalla lista notifiche.",
        ],
      },
      {
        title: "Come funziona",
        body: "Ogni volta che apri l'app calcola in automatico la distanza tra oggi e la scadenza di ogni confezione e colora lo stato di conseguenza. I dati restano salvati nel browser tramite localStorage: si conservano anche chiudendo la scheda e funzionano senza rete. Puoi installare l'app come PWA su iOS e Android e averla come icona sulla home screen.",
      },
      {
        title: "Per chi è pensata",
        body: "Famiglie con più confezioni in casa, caregiver di anziani, genitori che gestiscono farmaci per i bambini, ma anche chiunque voglia un piccolo promemoria personale per evitare sprechi e rischi di assunzione di prodotti scaduti.",
      },
      {
        title: "Dettagli tecnici",
        items: [
          "Built con React 19 + Vite per un bundle veloce.",
          "Persistenza locale tramite localStorage, nessun server richiesto.",
          "Progressive Web App installabile con manifest e icone dedicate.",
          "Funziona completamente offline dopo la prima apertura.",
        ],
      },
    ],
  },
  {
    slug: "green-village",
    name: "Green Village",
    tagline: "Manutenzioni condominiali con QR",
    pitch:
      "Trasforma ogni intervento in un QR code: scansiona, aggiorna, collabora con i consiglieri in tempo reale.",
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
    detailSections: [
      {
        title: "Obiettivo",
        body: "Dare a consiglieri e amministratori di un complesso residenziale uno strumento condiviso per censire, aggiornare e ritrovare facilmente tutte le manutenzioni di ogni palazzina, con collaborazione in tempo reale tra più utenti.",
      },
      {
        title: "Autenticazione e profilo",
        items: [
          "Registrazione con email e password tramite Supabase Auth, con verifica email obbligatoria.",
          "Profilo utente con nome, cognome, palazzina di appartenenza, numero di telefono e avatar colorato scelto da una palette.",
          "Modale di benvenuto al primo accesso e schermata profilo modificabile in qualsiasi momento.",
          "Login anche in modalità demo per visitatori di sola lettura.",
        ],
      },
      {
        title: "Presence real-time",
        body: "Grazie al sistema di presence di Supabase, ogni utente vede in tempo reale quali altri consiglieri della sua palazzina sono attualmente online, con indicatore colorato e lista dinamica. Utile per capire a colpo d'occhio chi è disponibile per coordinare un intervento.",
      },
      {
        title: "Gestione manutenzioni",
        items: [
          "Cartelle organizzate per anno (es. 2024, 2025) con conteggio interventi.",
          "Creazione di interventi con titolo, descrizione e palazzina di riferimento.",
          "Note datate aggiungibili a ogni intervento per tracciare stato, fornitori, scadenze.",
          "Collegamento di ogni manutenzione a un QR code fisico tramite la libreria html5-qrcode.",
          "Scansione QR con la fotocamera del telefono per aprire istantaneamente la scheda corrispondente.",
          "Modifica ed eliminazione interventi con sincronizzazione immediata su tutti i dispositivi collegati.",
        ],
      },
      {
        title: "Per chi è pensata",
        body: "Amministratori di condominio, consiglieri di palazzina e tecnici che devono coordinare manutenzioni ricorrenti, tenere lo storico condiviso e velocizzare il riconoscimento sul campo tramite QR applicati a impianti, contatori o macchinari.",
      },
      {
        title: "Dettagli tecnici",
        items: [
          "Frontend React 19 + TypeScript con Vite.",
          "Backend as a Service: Supabase per auth, database, presence e storage.",
          "Scansione QR tramite html5-qrcode direttamente dal browser mobile.",
          "PWA installabile con tema personalizzato e icone dedicate.",
          "Sincronizzazione cloud real-time: le modifiche appaiono su tutti i dispositivi senza refresh.",
        ],
      },
    ],
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
    detailSections: [
      {
        title: "Obiettivo",
        body: "Una versione stand-alone e interamente offline dell'app manutenzioni, pensata per il singolo tecnico o proprietario che vuole archiviare interventi senza account, senza cloud e senza dipendere da un server.",
      },
      {
        title: "Cosa puoi fare",
        items: [
          "Creare cartelle identificate da un nome e da un anno a quattro cifre.",
          "Aggiungere manutenzioni all'interno di ogni cartella con nome e note.",
          "Espandere la singola manutenzione per aggiungere o modificare note datate.",
          "Associare un ID QR code a ogni manutenzione per un riconoscimento rapido sul campo.",
          "Scansionare un QR con la fotocamera per aprire direttamente la scheda corrispondente.",
          "Modificare o eliminare interventi, note e cartelle senza limiti.",
        ],
      },
      {
        title: "Come funziona",
        body: "Tutto lo stato dell'app è salvato in localStorage: funziona anche senza connessione internet una volta installata. L'interfaccia mobile-first gestisce automaticamente lo scroll dei modali e il focus degli input per un'esperienza fluida sul telefono, con tema scuro e accenti ambra.",
      },
      {
        title: "Per chi è pensata",
        body: "Tecnici che seguono impianti sparsi, proprietari di immobili che vogliono un registro personale degli interventi, piccole attività artigianali senza gestionali. Ideale per chi vuole avere sempre a portata di mano lo storico di una macchina o di un impianto scansionando un QR.",
      },
      {
        title: "Dettagli tecnici",
        items: [
          "React 19 + TypeScript + Vite.",
          "Scansione QR tramite html5-qrcode, zero dipendenze native.",
          "PWA installabile con manifest, tema nero e icone dedicate.",
          "100% offline: nessuna chiamata esterna dopo l'installazione.",
          "Dati persistiti in localStorage con export/import manuale.",
        ],
      },
    ],
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
    detailSections: [
      {
        title: "Obiettivo",
        body: "Avere tutti i finanziamenti personali (prestiti, rateizzazioni, pagamenti periodici) sotto controllo in un'unica app: rate già pagate, interessi, scadenze e quota residua sempre aggiornate.",
      },
      {
        title: "Due modalità di utilizzo",
        items: [
          "Modalità ospite: tutto resta salvato sul dispositivo, nessun account richiesto.",
          "Modalità autenticata con Supabase: dati sincronizzati nel cloud e accessibili da più dispositivi.",
          "Passaggio fluido tra le due modalità: al primo login i dati guest possono essere migrati in cloud.",
        ],
      },
      {
        title: "Gestione finanziamenti",
        items: [
          "Creazione di un finanziamento con nome, emoji identificativa, importo totale e numero di rate.",
          "Tipologie supportate: mensile, bimestrale, trimestrale, quadrimestrale, semestrale, annuale.",
          "Modalità rata fissa (con calcolo automatico degli interessi) o variabile (importi liberi).",
          "Date di inizio e fine personalizzabili con calendario integrato.",
          "Registrazione di ogni pagamento storico con data, importo e nota.",
          "Possibilità di indicare rate già pagate all'avvio per migrare finanziamenti esistenti.",
        ],
      },
      {
        title: "Calcoli automatici",
        body: "Quando imposti una rata fissa, l'app calcola in tempo reale il totale degli interessi maturati, l'interesse per singola rata e la quota residua. Con rate variabili tiene traccia delle somme versate vs dovute e segnala eventuali anomalie.",
      },
      {
        title: "Navigazione e viste",
        items: [
          "Home con elenco di tutti i finanziamenti attivi e stato rapido.",
          "Dettaglio per ogni finanziamento con scadenze future e pagate.",
          "Riepilogo generale con totali aggregati.",
          "Cronologia completa dei pagamenti.",
          "Profilo e Impostazioni con gestione account e preferenze.",
          "Bottom-nav su mobile, React Router per navigazione fluida.",
          "Tema chiaro/scuro automatico (scuro dalle 20 alle 6).",
          "Export in formato xlsx per condividere i dati con un commercialista.",
        ],
      },
      {
        title: "Per chi è pensata",
        body: "Chiunque abbia uno o più finanziamenti attivi e voglia vedere a colpo d'occhio quanto manca alla fine, quanto si sta spendendo in interessi e quali rate arrivano. Utile anche per tenere traccia di pagamenti rateizzati verso privati (es. auto comprata in rate libere).",
      },
      {
        title: "Dettagli tecnici",
        items: [
          "React 19 + TypeScript con React Router 7.",
          "Supabase per autenticazione, database e sincronizzazione cloud.",
          "Libreria xlsx per export/import dei dati.",
          "Tema dinamico basato sull'orario del dispositivo.",
        ],
      },
    ],
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
    detailSections: [
      {
        title: "Obiettivo",
        body: "Avere sempre con sé il proprio ricettario personale, consultabile anche in cucina senza connessione, con un'interfaccia pulita pensata per mani sporche di farina.",
      },
      {
        title: "Cosa puoi fare",
        items: [
          "Creare una ricetta con titolo, immagine caricata dal telefono e tempo medio di preparazione.",
          "Aggiungere una lista di ingredienti con quantità e unità di misura.",
          "Definire una sequenza di azioni numerate, ciascuna con testo libero.",
          "Impostare un timer opzionale su ogni azione (utile per cotture e lievitazioni).",
          "Modificare testo e ordine delle azioni con drag-and-drop: la numerazione si aggiorna da sola.",
          "Cercare una ricetta dalla barra di ricerca con filtro in tempo reale e pulsante reset.",
          "Consultare l'elenco ordinato alfabeticamente secondo le regole italiane.",
        ],
      },
      {
        title: "Esperienza in cucina",
        body: "Nella scheda di dettaglio gli ingredienti sono separati dalle azioni numerate; il timer di ogni passaggio può essere avviato con un tocco e mostra un countdown visibile. Tutto il flusso è ottimizzato per essere usato con il telefono appoggiato al piano cucina.",
      },
      {
        title: "Per chi è pensata",
        body: "Chiunque ami cucinare e voglia tenere il proprio ricettario sempre aggiornato, senza dover aprire app pesanti o cercare note sparse. Funziona anche in cantina, nella casa al mare o in qualsiasi posto senza rete.",
      },
      {
        title: "Dettagli tecnici",
        items: [
          "HTML, CSS e JavaScript vanilla: zero framework, zero build tool.",
          "Service Worker registrato per funzionamento 100% offline dopo la prima visita.",
          "Persistenza su localStorage con caricamento immagini come data URL.",
          "PWA installabile con manifest e icona dedicata.",
          "Tema verde acqua con font Poppins, design pulito e leggibile.",
        ],
      },
    ],
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
    detailSections: [
      {
        title: "Obiettivo",
        body: "Unire diario scolastico e orario settimanale in un'unica app, così lo studente ha tutto in un posto: compiti, verifiche, avvisi, note personali e le lezioni del giorno.",
      },
      {
        title: "Diario digitale",
        items: [
          "Quattro tipologie di voci: nota personale, avviso, compito, verifica.",
          "Ogni voce ha titolo, descrizione, data, materia e ora di lezione collegata.",
          "Compiti e verifiche possono essere segnati come completati con timestamp automatico.",
          "Pulizia automatica dei compiti completati da più di 30 giorni per tenere il diario ordinato.",
          "Filtro per tipologia e per materia, vista cronologica ordinata.",
          "Aggiunta, modifica ed eliminazione rapida di ogni voce.",
        ],
      },
      {
        title: "Orario settimanale",
        items: [
          "Griglia oraria dal lunedì al sabato, completamente personalizzabile.",
          "Per ogni slot: materia, docente, aula.",
          "Colori personalizzati per materia con palette o color picker.",
          "Aggiunta di materie extra non previste dall'orario standard (es. potenziamento, laboratori).",
          "Gestione di settimane alternate o eccezioni puntuali.",
        ],
      },
      {
        title: "Autenticazione e modalità ospite",
        body: "Puoi usare l'app in modalità guest (dati solo locali) oppure accedere con Firebase Auth per sincronizzare tutto nel cloud. Al login i dati del guest vengono fusi con quelli del cloud tramite merge intelligente, senza perdite.",
      },
      {
        title: "Navigazione e interazione",
        items: [
          "Cinque pagine: Home, Orario, Riepilogo, Profilo, Impostazioni.",
          "Bottom-nav sempre visibile per passare tra le sezioni.",
          "Gesture di swipe orizzontale per navigare da una pagina all'altra grazie allo SwipeContext dedicato.",
          "Animazioni fluide e interfaccia mobile-first.",
        ],
      },
      {
        title: "Per chi è pensata",
        body: "Studenti delle scuole superiori e universitari che vogliono uno strumento più moderno del classico diario cartaceo, con tutte le funzioni essenziali ma senza distrazioni. Utile anche ai genitori per verificare i compiti del giorno.",
      },
      {
        title: "Dettagli tecnici",
        items: [
          "React 19 + TypeScript + React Router.",
          "Firebase Authentication e Firestore per sync cloud.",
          "Storage locale con merge intelligente guest ↔ cloud.",
          "Bundle ottimizzato per caricamento veloce da mobile.",
        ],
      },
    ],
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
    detailSections: [
      {
        title: "Obiettivo",
        body: "Offrire un registro personale delle entrate e uscite dal lavoro, utilizzabile con un tocco, senza affidarsi al sistema aziendale e senza account.",
      },
      {
        title: "Timbratura rapida",
        items: [
          "Due pulsanti dedicati: Entrata e Uscita, che registrano data e ora correnti con un click.",
          "Protezione contro i duplicati: se esiste già una timbratura di stesso tipo nello stesso giorno viene aggiornata invece di duplicata.",
          "Feedback visivo immediato per confermare l'avvenuta timbratura.",
        ],
      },
      {
        title: "Timbrature personalizzate",
        items: [
          'Pulsante "Crea" che apre un form dedicato.',
          "Scelta manuale di data, ora e tipo (entrata o uscita).",
          "Descrizione opzionale fino a 50 caratteri per annotare causa o cliente.",
          "Utile per recuperare timbrature dimenticate o per lavori fuori sede.",
        ],
      },
      {
        title: "Riepilogo e filtri",
        items: [
          "Elenco cronologico di tutte le timbrature con data, ora, tipo e descrizione.",
          "Filtro per singola data con selezione rapida.",
          'Pulsante "Mostra tutti" per tornare alla vista completa.',
          "Possibilità di modificare o eliminare ogni singola voce.",
        ],
      },
      {
        title: "Per chi è pensata",
        body: "Lavoratori autonomi, dipendenti che vogliono un controllo parallelo a quello aziendale, collaboratori e freelance che devono rendicontare ore su più clienti.",
      },
      {
        title: "Dettagli tecnici",
        items: [
          "HTML + JavaScript vanilla, nessun framework.",
          "Service Worker per funzionamento offline.",
          "localStorage per persistenza dei dati.",
          "PWA installabile con manifest, tema verde acqua e icone dedicate.",
        ],
      },
    ],
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
    detailSections: [
      {
        title: "Obiettivo",
        body: "Una to-do list minimale ma curata, con tutto quello che serve per organizzare la giornata e niente di più: nessun account, nessun server, nessuna pubblicità.",
      },
      {
        title: "Gestione task",
        items: [
          "Creazione rapida di un task con titolo e data obbligatoria.",
          "Orario opzionale per distinguere impegni temporizzati da semplici promemoria.",
          "Modifica e completamento con un tocco; lo stato completato viene rappresentato graficamente.",
          "Ordinamento automatico cronologico: i task vicini appaiono prima.",
          "Eliminazione singola o pulizia di tutti i task completati.",
        ],
      },
      {
        title: "Notifiche browser",
        items: [
          "Richiesta dei permessi notifica all'avvio con spiegazione chiara.",
          "Attivazione/disattivazione dal menù impostazioni con icona ingranaggio.",
          "Notifica al raggiungimento dell'orario del task (se impostato).",
          "Preferenze salvate in locale insieme ai task.",
        ],
      },
      {
        title: "Validazione intelligente",
        items: [
          "Non puoi inserire date nel passato: il selettore blocca la selezione.",
          "Se la data scelta è oggi, l'ora è vincolata a un valore uguale o successivo a quello corrente.",
          'Messaggio "Libero!!!" quando non ci sono impegni in coda.',
        ],
      },
      {
        title: "Ricerca e filtri",
        items: [
          "Barra di ricerca per filtrare i task per data specifica.",
          'Pulsante "Mostra Tutti" per tornare alla vista completa.',
          "Interfaccia mobile-first con interazioni touch-friendly.",
        ],
      },
      {
        title: "Per chi è pensata",
        body: "Chi vuole una to-do list veloce senza iscriversi da nessuna parte, con notifiche browser per promemoria semplici. Ottima anche come secondo strumento affiancato a gestionali più complessi quando si vuole un reminder personale.",
      },
      {
        title: "Dettagli tecnici",
        items: [
          "JavaScript vanilla puro, nessuna dipendenza.",
          "API Web Notifications del browser.",
          "Service Worker per funzionamento offline.",
          "localStorage per task e preferenze.",
          "PWA installabile con manifest e tema verde acqua.",
        ],
      },
    ],
  },
];

export function getAppBySlug(slug: string): AppMeta | undefined {
  return apps.find((a) => a.slug === slug);
}
