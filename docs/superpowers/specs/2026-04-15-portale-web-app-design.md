# Portale Web App — Design

**Data:** 2026-04-15
**Autore:** Simone Albini
**Tipo:** Vetrina pubblica / portfolio delle proprie web app personali e di lavoro

---

## 1. Obiettivo

Creare un sito portale pubblico, con estetica **dark futuristic / cyberpunk** ed effetti visivi moderni (WebGL, cursore custom, tilt 3D, scroll narrativo, transizioni cinematiche), che faccia da **vetrina + launcher** per le web app già deployate dell'autore.

Il sito non è un'app con login: è un portfolio statico generato a build-time. Ogni app mostrata linka al suo URL pubblico esterno (Vercel o GitHub Pages).

## 2. Scope

**In scope:**
- Homepage con hero animato e griglia delle app filtrabile per categoria.
- Una pagina dedicata per ogni app con descrizione ricca, galleria screenshot, changelog e CTA "Apri l'app".
- Effetti: sfondo WebGL, tilt 3D su card, cursore custom, scroll reveal, transizioni cinematiche tra pagine.
- Registry tipizzato delle app + contenuti ricchi in MDX.
- Rispetto di `prefers-reduced-motion`.

**Out of scope:**
- Autenticazione, area admin, CMS headless.
- Integrazione delle app nel repo (restano progetti separati con il loro URL).
- Backend / API / database.
- App `altro` e `qr-code-app` (escluse).

## 3. Stack tecnico

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript — già inizializzati.
- **Styling:** Tailwind CSS 4 — già inizializzato.
- **3D / WebGL:** `three` + `@react-three/fiber` + `@react-three/drei`.
- **Animazioni:** `framer-motion` (tilt, scroll reveal, transizioni, shared layout).
- **Smooth scroll:** `lenis` (disattivato se `prefers-reduced-motion`).
- **Contenuti:** `@next/mdx` (o `next-mdx-remote`) per le pagine app.

## 4. Struttura del progetto

```
app/
  layout.tsx                  # Layout root: fonts, cursore custom, background WebGL
  page.tsx                    # Homepage
  apps/
    [slug]/
      page.tsx                # Pagina dedicata app (SSG)
  not-found.tsx
content/
  apps/
    farmaci.mdx
    green-village.mdx
    manutenzioni.mdx
    rate.mdx
    ricette.mdx
    school-diary.mdx
    timbrature.mdx
    todo-list.mdx
components/
  background/
    WebGLGrid.tsx             # Scena three.js (griglia 3D)
    BackgroundFallback.tsx    # Gradiente statico fallback
  cursor/
    CustomCursor.tsx
  cards/
    AppCard.tsx               # Card con tilt 3D
    CategoryFilter.tsx
  transitions/
    PageTransition.tsx
  ui/
    Button.tsx
    TechChip.tsx
    Gallery.tsx
    Changelog.tsx
lib/
  apps.ts                     # Registry tipizzato delle app
  mdx.ts                      # Helper lettura MDX
public/
  apps/
    <slug>/
      icon.png
      screens/*.png
docs/superpowers/specs/
  2026-04-15-portale-web-app-design.md
```

## 5. Rotte

| Rotta | Rendering | Descrizione |
|---|---|---|
| `/` | SSG | Homepage: hero + griglia app con filtro categoria |
| `/apps/[slug]` | SSG (`generateStaticParams`) | Pagina dedicata app |
| `/not-found` | Statica | 404 stilizzata |

## 6. Modello dati

### 6.1 Registry tipizzato — `lib/apps.ts`

```ts
export type AppCategory = 'lavoro' | 'produttivita' | 'salute' | 'utility';

export type AppMeta = {
  slug: string;
  name: string;
  tagline: string;
  category: AppCategory;
  url: string;
  icon: string;
  tech: string[];
  accentColor: string; // hex, usato per glow/bordi card
};

export const apps: AppMeta[] = [ /* 8 entries */ ];
```

### 6.2 File MDX — `content/apps/<slug>.mdx`

Frontmatter:

```yaml
---
slug: farmaci
description: "Descrizione lunga..."
screenshots:
  - /apps/farmaci/screens/1.png
  - /apps/farmaci/screens/2.png
changelog:
  - version: "1.0"
    date: "2025-09-01"
    notes: "Prima release"
---
```

Il body MDX è contenuto libero (markdown con componenti React inline).

### 6.3 Dati iniziali delle 8 app

| slug | nome | tagline | categoria | URL |
|---|---|---|---|---|
| `farmaci` | Farmaci | Gestisci farmaci e scadenze | salute | https://farmaci-eta.vercel.app/ |
| `green-village` | Green Village | Manutenzioni del Green Village con QR | lavoro | https://green-village-app.vercel.app/ |
| `manutenzioni` | Manutenzioni | Tracciamento manutenzioni macchinari | lavoro | https://progetto-finale-qrcode.vercel.app/ |
| `rate` | Rate & Pagamenti | Gestione rate e pagamenti | produttivita | https://rate-payments.vercel.app/ |
| `ricette` | Ricette | Le tue ricette offline | utility | https://simoalbi28.github.io/ricette-app/index.html |
| `school-diary` | Diario Scolastico | Il tuo diario scolastico digitale | produttivita | https://school-diary-nu.vercel.app/ |
| `timbrature` | Timbrature | Timbrature offline | lavoro | https://simoalbi28.github.io/TIMBRATURE-APP/index.html |
| `todo-list` | To-Do List | Todo con notifiche | produttivita | https://simoalbi28.github.io/TODO-LIST-APP/ (da confermare) |

Le icone sono già presenti nei progetti sorgente e verranno copiate in `public/apps/<slug>/icon.png` durante l'implementazione. Gli screenshot mancanti saranno placeholder stilizzati finché l'autore non ne fornirà di reali.

## 7. Design UX / UI

### 7.1 Homepage

**Sezione Hero (100vh):**
- Sfondo: griglia 3D prospettica in stile Tron (linee cyan/magenta su nero), leggera reattività al mouse.
- Overlay testuale centrato: titolo grande, sottotitolo, scroll indicator animato.

**Sezione About short:**
- Due righe sull'autore con scroll reveal.

**Sezione Griglia app:**
- Chip filtro per categoria in cima (tutte / lavoro / produttività / salute / utility).
- Griglia responsive (2/3/4 colonne).
- Card app con hover: tilt 3D, bordo neon accento, glow dietro.
- Click → transizione cinematica verso la pagina dedicata.

**Footer:** link social/github/contatti.

### 7.2 Pagina dedicata `/apps/[slug]`

- Top bar con bottone "← Torna" (cursore magnetico).
- Hero compatto: icona grande + nome + tagline + chip tech + CTA "Apri l'app ↗" (apre URL in nuova tab con `rel="noopener noreferrer"`).
- Corpo MDX: descrizione lunga.
- Galleria screenshot (masonry + lightbox).
- Changelog (lista versioni).
- Transizione in entrata: wipe diagonale + shared layout `layoutId` sull'icona.

## 8. Effetti visivi — dettaglio

1. **Sfondo WebGL** — scena `three.js` montata nel layout root, fissa in `position: fixed`, dietro tutto (`z-index: -1`). Caricata in `<Suspense>` con `dynamic(..., { ssr: false })`; fallback `BackgroundFallback` (gradiente CSS). Disattivata se `prefers-reduced-motion: reduce` o su device a bassa GPU (controllo semplice via user agent o dimensione schermo).
2. **Cursore custom** — due elementi posizionati con `position: fixed`: un pallino piccolo e un ring esterno che segue con delay. Sugli elementi `[data-cursor="hover"]` il ring si ingrandisce e si magnetizza. Nascosto su `(pointer: coarse)`.
3. **Tilt 3D card** — `framer-motion` con `useMotionValue(x, y)` e `useTransform` su `rotateX`/`rotateY`; reset su `onMouseLeave`. Disattivato se `prefers-reduced-motion`.
4. **Scroll reveal** — `whileInView={{ opacity: 1, y: 0 }}` su sezioni.
5. **Page transition** — `AnimatePresence` + `motion.div` con wipe diagonale.
6. **Lenis** — smooth scroll globale, inizializzato in un hook nel layout. Disabilitato se `prefers-reduced-motion`.

## 8b. Responsive design

Il sito deve essere **fully responsive**, ottimizzato sia per mobile che per desktop:

- **Breakpoint Tailwind standard:** `sm` (640), `md` (768), `lg` (1024), `xl` (1280), `2xl` (1536).
- **Mobile first** — layout base per mobile, upgrade a desktop con media queries.
- **Griglia app:** 1 colonna < `sm`, 2 colonne `sm`-`md`, 3 colonne `lg`, 4 colonne `2xl`.
- **Hero:** headline scala da `text-5xl` mobile a `text-8xl` desktop.
- **Cursore custom:** disattivato su touch (`pointer: coarse`), cursore nativo preservato.
- **Tilt 3D:** disattivato su touch.
- **WebGL background:** pesantezza ridotta su mobile (meno particelle/linee).
- **Pagina dedicata:** hero icona+testo in colonna su mobile, riga su desktop; galleria 1 col mobile → 2-3 col desktop.
- **Tap target** minimi 44×44px su mobile.
- **Test visuale** su viewport 375px, 768px, 1280px, 1920px.

## 9. Accessibilità

- Rispetto di `prefers-reduced-motion`: tutte le animazioni non essenziali disattivate (WebGL freezato, tilt off, smooth scroll off, transizioni ridotte).
- Cursore custom nascosto su touch; cursore nativo preservato.
- Contrasto testi AA su sfondo scuro.
- Link "Apri l'app" con `aria-label` esplicito.
- Focus ring visibile (non nascosto dal cursore custom).
- Navigazione tastiera funzionante (card focusabili, Enter per aprire la pagina dedicata).

## 10. Performance

- Componenti WebGL caricati dinamicamente (`next/dynamic`, `ssr: false`) per escluderli dal bundle iniziale.
- Icone delle app come PNG ottimizzati (`next/image`).
- SSG con `generateStaticParams` per le pagine `[slug]`.
- Target Lighthouse desktop: Performance ≥ 80, Accessibility ≥ 95, Best Practices ≥ 90.

## 11. Error handling

- Slug inesistente su `/apps/[slug]` → `notFound()` di Next.js → 404 stilizzata.
- Errore di caricamento scena WebGL → fallback gradiente.
- Immagini mancanti → placeholder stilizzato coerente col tema.

## 12. Testing

- **Type-check:** `tsc --noEmit`.
- **Lint:** ESLint (config Next già presente).
- **Smoke test manuale** dopo ogni step: `pnpm dev`, caricare `/`, caricare `/apps/farmaci`, verificare transizione.
- **Verifica accessibilità manuale** con DevTools rendering "emulate prefers-reduced-motion".

## 13. Deploy

- Build: `pnpm build` → output statico SSG.
- Piattaforma target: Vercel (coerente con le altre app).
- Nessuna variabile d'ambiente richiesta.

## 14. Next.js 16 — nota

Next.js 16 ha breaking changes rispetto a versioni precedenti. Durante l'implementazione consultare `node_modules/next/dist/docs/` prima di scrivere codice che tocca API di Next (routing, metadata, image, fonts, MDX config), invece di affidarsi alla memoria.
