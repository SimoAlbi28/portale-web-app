"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "cyberpunk" | "synthwave" | "matrix" | "minimal";
export type Intensity = "full" | "light" | "off";
export type View = "grid" | "list";
export type Sort = "category" | "alpha" | "random";

type Settings = {
  theme: Theme;
  intensity: Intensity;
  view: View;
  sort: Sort;
  favorites: string[];
  showFavoritesOnly: boolean;
};

type SettingsCtx = Settings & {
  setTheme: (t: Theme) => void;
  setIntensity: (i: Intensity) => void;
  setView: (v: View) => void;
  setSort: (s: Sort) => void;
  toggleFavorite: (slug: string) => void;
  setShowFavoritesOnly: (v: boolean) => void;
};

const DEFAULTS: Settings = {
  theme: "cyberpunk",
  intensity: "full",
  view: "grid",
  sort: "category",
  favorites: [],
  showFavoritesOnly: false,
};

const STORAGE_KEY = "daily-apps-settings";

const Ctx = createContext<SettingsCtx | null>(null);

export const THEMES: Record<
  Theme,
  {
    label: string;
    bg: string;
    fg: string;
    accentA: string;
    accentB: string;
    accentC: string;
    webgl: { a: string; b: string; c: string };
  }
> = {
  cyberpunk: {
    label: "Cyberpunk",
    bg: "#030014",
    fg: "#e6f1ff",
    accentA: "#22d3ee",
    accentB: "#ec4899",
    accentC: "#a855f7",
    webgl: { a: "#22d3ee", b: "#a855f7", c: "#ec4899" },
  },
  synthwave: {
    label: "Synthwave",
    bg: "#120024",
    fg: "#ffe9f6",
    accentA: "#ff7edb",
    accentB: "#ff9f43",
    accentC: "#7b2cff",
    webgl: { a: "#ff9f43", b: "#ff4fa3", c: "#7b2cff" },
  },
  matrix: {
    label: "Matrix",
    bg: "#00140a",
    fg: "#d7ffe8",
    accentA: "#22ff88",
    accentB: "#00ff9d",
    accentC: "#0dff6b",
    webgl: { a: "#00ff9d", b: "#0dff6b", c: "#22ff88" },
  },
  minimal: {
    label: "Minimal",
    bg: "#0a0a0a",
    fg: "#fafafa",
    accentA: "#ffffff",
    accentB: "#bbbbbb",
    accentC: "#888888",
    webgl: { a: "#ffffff", b: "#888888", c: "#444444" },
  },
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        setState((s) => ({ ...s, ...parsed }));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  // apply theme vars + body class for intensity
  useEffect(() => {
    const t = THEMES[state.theme];
    const root = document.documentElement;
    root.style.setProperty("--background", t.bg);
    root.style.setProperty("--foreground", t.fg);
    root.style.setProperty("--accent-cyan", t.accentA);
    root.style.setProperty("--accent-magenta", t.accentB);
    root.style.setProperty("--accent-violet", t.accentC);
    root.setAttribute("data-theme", state.theme);
    root.setAttribute("data-intensity", state.intensity);
    if (state.intensity === "off" || state.theme === "minimal") {
      document.body.classList.remove("has-custom-cursor");
    } else if (state.intensity === "full") {
      document.body.classList.add("has-custom-cursor");
    } else {
      document.body.classList.remove("has-custom-cursor");
    }
  }, [state.theme, state.intensity]);

  const setTheme = useCallback(
    (theme: Theme) => setState((s) => ({ ...s, theme })),
    []
  );
  const setIntensity = useCallback(
    (intensity: Intensity) => setState((s) => ({ ...s, intensity })),
    []
  );
  const setView = useCallback(
    (view: View) => setState((s) => ({ ...s, view })),
    []
  );
  const setSort = useCallback(
    (sort: Sort) => setState((s) => ({ ...s, sort })),
    []
  );
  const toggleFavorite = useCallback((slug: string) => {
    setState((s) => {
      const has = s.favorites.includes(slug);
      return {
        ...s,
        favorites: has
          ? s.favorites.filter((x) => x !== slug)
          : [...s.favorites, slug],
      };
    });
  }, []);
  const setShowFavoritesOnly = useCallback(
    (showFavoritesOnly: boolean) =>
      setState((s) => ({ ...s, showFavoritesOnly })),
    []
  );

  const value = useMemo<SettingsCtx>(
    () => ({
      ...state,
      setTheme,
      setIntensity,
      setView,
      setSort,
      toggleFavorite,
      setShowFavoritesOnly,
    }),
    [
      state,
      setTheme,
      setIntensity,
      setView,
      setSort,
      toggleFavorite,
      setShowFavoritesOnly,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // safe defaults during SSR
    return {
      ...DEFAULTS,
      setTheme: () => {},
      setIntensity: () => {},
      setView: () => {},
      setSort: () => {},
      toggleFavorite: () => {},
      setShowFavoritesOnly: () => {},
    };
  }
  return ctx;
}
