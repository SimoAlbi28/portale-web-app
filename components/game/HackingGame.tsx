"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { lengthForLevel, pickWordForLevel } from "@/lib/hacking-words";

const STORAGE_KEY = "hacking-game-state";
const TOTAL_LEVELS = 100;

type Tile = {
  id: number;
  letter: string;
  placedSlot: number | null;
  locked: boolean;
  shake?: boolean;
  wrong?: boolean;
  justCorrect?: boolean;
  revealed?: boolean;
};

type GameState = {
  level: number;
  completed: number[];
};

function loadState(): GameState {
  if (typeof window === "undefined") return { level: 1, completed: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { level: 1, completed: [], ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { level: 1, completed: [] };
}

function saveState(s: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function countDiff(a: string[], b: string[]): number {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

function shuffleWell(letters: string[]): string[] {
  if (letters.length <= 2) return shuffle(letters);
  const reversed = [...letters].reverse();
  // require at least max(2, ceil(len/2)) positions different from the original
  const minDiff = Math.max(2, Math.ceil(letters.length / 2));
  let out = shuffle(letters);
  let attempts = 0;
  while (attempts < 60) {
    const diffOrig = countDiff(out, letters);
    const diffRev = countDiff(out, reversed);
    // reject: equal to original, equal to reverse, or too close to original
    if (diffOrig >= minDiff && diffRev >= 1) break;
    out = shuffle(letters);
    attempts++;
  }
  return out;
}

function buildTiles(word: string): Tile[] {
  const letters = word.split("");
  const shuffled = shuffleWell(letters);
  return shuffled.map((letter, i) => ({
    id: i,
    letter,
    placedSlot: null,
    locked: false,
  }));
}

export function HackingGame() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<GameState>({ level: 1, completed: [] });
  const [word, setWord] = useState<string>("");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [showLevels, setShowLevels] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "checking" | "verifying" | "success" | "failing"
  >("idle");
  const [attempts, setAttempts] = useState(0);
  const tilesRef = useRef<Tile[]>([]);

  // Keep tilesRef in sync so timeouts can read the latest committed tiles
  tilesRef.current = tiles;

  // Hydrate from localStorage, then override with Supabase if logged in
  useEffect(() => {
    const s = loadState();
    setState(s);
    const w = pickWordForLevel(s.level);
    setWord(w);
    setTiles(buildTiles(w));
    setHydrated(true);

    // Load from Supabase (async, overrides local if logged in)
    import("@/lib/supabase/sync").then(({ loadUserData }) =>
      loadUserData().then((data) => {
        if (data?.game_state) {
          const gs = data.game_state;
          setState(gs);
          saveState(gs);
          const nw = pickWordForLevel(gs.level);
          setWord(nw);
          setTiles(buildTiles(nw));
        }
      })
    ).catch(() => { /* ignore */ });
  }, []);

  // Persist to localStorage + Supabase
  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
    import("@/lib/supabase/sync").then(({ saveGameState }) =>
      saveGameState(state)
    ).catch(() => { /* ignore */ });
  }, [state, hydrated]);

  const startNewLevel = useCallback(
    (level: number) => {
      const w = pickWordForLevel(level, word);
      setWord(w);
      setTiles(buildTiles(w));
      setStatus("idle");
      setAttempts(0);
    },
    [word]
  );

  const placeInNextSlot = (tileId: number) => {
    if (status !== "idle") return;
    const tile = tiles.find((t) => t.id === tileId);
    if (!tile || tile.placedSlot !== null || tile.locked) return;
    // Find next free slot
    const placedSlots = new Set(
      tiles.filter((t) => t.placedSlot !== null).map((t) => t.placedSlot)
    );
    let target = -1;
    for (let i = 0; i < word.length; i++) {
      if (!placedSlots.has(i)) {
        target = i;
        break;
      }
    }
    if (target === -1) return;
    // Place the tile
    setTiles((prev) =>
      prev.map((t) => (t.id === tileId ? { ...t, placedSlot: target } : t))
    );
    // If this placement fills the last slot, start checking
    if (placedSlots.size + 1 === word.length) {
      setStatus("checking");
      setAttempts((a) => a + 1);
    }
  };

  const removeFromSlot = (tileId: number) => {
    if (status !== "idle") return;
    setTiles((prev) =>
      prev.map((t) =>
        t.id === tileId && !t.locked ? { ...t, placedSlot: null } : t
      )
    );
  };

  const maxAttempts = word.length || 1;

  // Run the "checking" phase (1→2→3 flash, then decide)
  useEffect(() => {
    if (status !== "checking") return;

    // attempts is already incremented in the click handler (batched with setStatus)
    const currentAttempt = attempts;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      timeouts.push(id);
    };

    // Phase 1: mark correct/wrong, keep letter in slot for flash
    schedule(() => {
      setTiles((prev) =>
        prev.map((t) => {
          if (t.placedSlot === null || t.locked) return t;
          if (t.letter === word[t.placedSlot]) {
            return { ...t, locked: true, justCorrect: true };
          }
          return { ...t, wrong: true };
        })
      );
    }, 150);

    // Phase 2: remove wrong tiles, send back to pool with shake
    schedule(() => {
      setTiles((prev) =>
        prev.map((t) => {
          if (t.wrong) {
            return {
              ...t,
              wrong: false,
              placedSlot: null,
              shake: true,
            };
          }
          return { ...t, justCorrect: false };
        })
      );
    }, 850);

    // Phase 3: clear shake + decide next status
    schedule(() => {
      // Read latest tiles from ref (updated after Phase 1/2 renders)
      const allLocked = tilesRef.current.every((t) => t.locked);
      setTiles((prev) => prev.map((t) => ({ ...t, shake: false })));

      if (allLocked) {
        setStatus("verifying");
      } else if (currentAttempt >= maxAttempts) {
        setStatus("failing");
      } else {
        setStatus("idle");
      }
    }, 1250);

    return () => {
      cancelled = true;
      timeouts.forEach((id) => clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, word, maxAttempts]);

  // Run the "failing" phase: show HACKING FAILED, then retry same level
  useEffect(() => {
    if (status !== "failing") return;
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      timeouts.push(id);
    };

    // After the overlay, reshuffle same word and reset attempts so user retries
    schedule(() => {
      setTiles(buildTiles(word));
      setAttempts(0);
      setStatus("idle");
    }, 2400);

    return () => {
      cancelled = true;
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [status, word]);

  // Step 1: verifying → success (after overlay display)
  useEffect(() => {
    if (status !== "verifying") return;
    const id = setTimeout(() => setStatus("success"), 1200);
    return () => clearTimeout(id);
  }, [status]);

  // Step 2: success → advance to next level
  // If the current row has incomplete levels, go to the first one.
  // Only advance to the next row when all 10 levels in the current row are done.
  useEffect(() => {
    if (status !== "success") return;
    const newCompleted = Array.from(
      new Set([...state.completed, state.level])
    );
    const isFinalWin =
      state.level === TOTAL_LEVELS && newCompleted.length === TOTAL_LEVELS;

    // Find the current row (1-10, 11-20, etc.)
    const rowStart = Math.floor((state.level - 1) / 10) * 10 + 1;
    const rowEnd = Math.min(rowStart + 9, TOTAL_LEVELS);

    // First incomplete level in the current row
    let nextLevel = -1;
    for (let l = rowStart; l <= rowEnd; l++) {
      if (!newCompleted.includes(l)) {
        nextLevel = l;
        break;
      }
    }

    // If entire row is complete, go to first level of the next row
    if (nextLevel === -1) {
      nextLevel = Math.min(rowEnd + 1, TOTAL_LEVELS);
    }

    const id = setTimeout(() => {
      setState({ level: nextLevel, completed: newCompleted });
      if (isFinalWin) {
        setStatus("idle");
        setShowCertificate(true);
      } else {
        startNewLevel(nextLevel);
      }
    }, 600);
    return () => clearTimeout(id);
  }, [status, state.level, state.completed, startNewLevel]);

  const reset = () => {
    if (!word) return;
    setTiles(buildTiles(word));
    setStatus("idle");
    setAttempts(0);
  };

  const slots = useMemo(() => {
    const arr: (Tile | null)[] = Array(word.length).fill(null);
    tiles.forEach((t) => {
      if (t.placedSlot !== null) arr[t.placedSlot] = t;
    });
    return arr;
  }, [tiles, word]);

  const pool = useMemo(
    () => tiles.filter((t) => t.placedSlot === null && !t.locked),
    [tiles]
  );

  if (!hydrated) return null;

  const completedCount = state.completed.length;
  const currentLength = lengthForLevel(state.level);

  return (
    <section className="relative z-20 mx-auto w-full max-w-2xl px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl border border-emerald-500/30 bg-black/85 backdrop-blur-xl p-4 md:p-5 shadow-[0_0_40px_rgba(16,185,129,0.15)] font-mono text-sm"
      >
        {/* terminal top bar */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-500/70" />
            <span className="size-2.5 rounded-full bg-yellow-500/70" />
            <span className="size-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-[10px] uppercase tracking-[0.3em] text-emerald-300/70">
              terminal // pwd-cracker.exe
            </span>
          </div>
          <button
            type="button"
            data-cursor="hover"
            onClick={() => setShowLevels(true)}
            className="text-[11px] uppercase tracking-widest text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 hover:border-emerald-400 rounded-md px-2.5 py-1 transition-colors"
          >
            Livelli {completedCount}/{TOTAL_LEVELS}
          </button>
        </div>

        {/* prompt line */}
        <div className="text-emerald-300/90 text-xs md:text-sm mb-3">
          <span className="text-emerald-500">{">"} </span>
          <span className="opacity-70">cracking password </span>
          <span className="text-cyan-300">
            [LV {String(state.level).padStart(3, "0")}/{TOTAL_LEVELS}]
          </span>{" "}
          <span className="opacity-50">— {currentLength} chars</span>
          <span
            className={`ml-2 ${
              attempts >= maxAttempts
                ? "text-red-400"
                : attempts >= maxAttempts - 1
                ? "text-yellow-300"
                : "opacity-50"
            }`}
          >
            // {attempts}/{maxAttempts} tentativi
          </span>
        </div>

        {/* Pool (ora sopra) */}
        <div className="flex flex-wrap justify-center gap-2 min-h-[3rem] mb-5">
          <AnimatePresence>
            {pool.map((tile) => (
              <motion.button
                key={tile.id}
                type="button"
                data-cursor="hover"
                onClick={() => placeInNextSlot(tile.id)}
                layout
                initial={{ opacity: 0, scale: 0.7 }}
                animate={
                  tile.shake
                    ? { opacity: 1, scale: 1, x: [-6, 6, -4, 4, 0] }
                    : { opacity: 1, scale: 1, x: 0 }
                }
                exit={{ opacity: 0, scale: 0.5 }}
                transition={
                  tile.shake
                    ? { duration: 0.45, ease: "easeOut" }
                    : { type: "spring", stiffness: 350, damping: 24 }
                }
                className="size-9 md:size-10 rounded-md border border-emerald-500/50 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors flex items-center justify-center text-sm md:text-base font-bold uppercase shadow-[0_0_10px_rgba(16,185,129,0.25)]"
              >
                {tile.letter}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Slots (ora sotto) */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {slots.map((tile, i) => {
            const isLocked = !!tile && tile.locked;
            const isWrong = !!tile && tile.wrong;
            const isJustCorrect = !!tile && tile.justCorrect;
            const isRevealed = !!tile && tile.revealed;
            return (
              <motion.button
                key={i}
                type="button"
                data-cursor="hover"
                onClick={() => tile && !tile.locked && removeFromSlot(tile.id)}
                aria-label={`Slot ${i + 1}`}
                animate={
                  isWrong
                    ? { x: [-5, 5, -3, 3, 0] }
                    : isJustCorrect
                    ? { scale: [1, 1.18, 1] }
                    : isRevealed
                    ? { scale: [0.8, 1.12, 1] }
                    : status === "success"
                    ? { scale: [1, 1.12, 1] }
                    : {}
                }
                transition={{ duration: 0.45 }}
                className={`size-10 md:size-12 rounded-md border-2 flex items-center justify-center text-base md:text-lg font-bold uppercase transition-colors ${
                  isWrong
                    ? "border-red-500 bg-red-500/20 text-red-200 shadow-[0_0_18px_rgba(239,68,68,0.7)]"
                    : isRevealed
                    ? "border-yellow-400 bg-yellow-500/15 text-yellow-200 shadow-[0_0_18px_rgba(234,179,8,0.55)]"
                    : isLocked || status === "success"
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.55)]"
                    : tile
                    ? "border-cyan-400/70 bg-cyan-400/5 text-cyan-200"
                    : "border-emerald-500/30 bg-black/60 text-emerald-500/30"
                }`}
              >
                {tile?.letter || "_"}
              </motion.button>
            );
          })}
        </div>

        {/* Verification overlay */}
        <AnimatePresence>
          {(status === "verifying" || status === "success") && (
            <VerifyOverlay status={status} word={word} />
          )}
        </AnimatePresence>

        {/* Failure overlay */}
        <AnimatePresence>
          {status === "failing" && <FailOverlay />}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="mt-6 flex items-center justify-between text-[11px] text-emerald-300/60">
          <button
            type="button"
            data-cursor="hover"
            onClick={reset}
            className="uppercase tracking-widest hover:text-emerald-200 transition-colors"
          >
            ⟲ Reset
          </button>
          <div
            className={`animate-pulse ${
              status === "failing"
                ? "text-red-400"
                : status === "verifying" || status === "success"
                ? "text-emerald-300"
                : "text-emerald-500/60"
            }`}
          >
            {status === "success"
              ? "✓ ACCESS GRANTED"
              : status === "verifying"
              ? "decrypting..."
              : status === "checking"
              ? "verifying..."
              : status === "failing"
              ? "✗ ACCESS DENIED — password revealed"
              : "awaiting input_"}
          </div>
        </div>
      </motion.div>

      {/* Levels modal */}
      <AnimatePresence>
        {showLevels && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLevels(false)}
            className="fixed inset-0 z-[160] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl border border-emerald-500/40 bg-black/95 backdrop-blur-xl p-6 font-mono shadow-[0_0_60px_rgba(16,185,129,0.25)]"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                  // levels {completedCount}/{TOTAL_LEVELS}
                </h3>
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setShowLevels(false)}
                  className="text-emerald-300/60 hover:text-emerald-200"
                  aria-label="Chiudi"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-10 gap-1.5 md:gap-2">
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(
                  (lv) => {
                    const done = state.completed.includes(lv);
                    const current = lv === state.level;
                    const row = Math.floor((lv - 1) / 10);
                    // Row is unlocked if all previous rows are fully completed
                    let unlocked = true;
                    for (let r = 0; r < row; r++) {
                      for (let n = r * 10 + 1; n <= r * 10 + 10; n++) {
                        if (!state.completed.includes(n)) {
                          unlocked = false;
                          break;
                        }
                      }
                      if (!unlocked) break;
                    }
                    return (
                      <button
                        key={lv}
                        type="button"
                        data-cursor={unlocked ? "hover" : undefined}
                        disabled={!unlocked}
                        onClick={() => {
                          if (!unlocked) return;
                          setState((s) => ({ ...s, level: lv }));
                          startNewLevel(lv);
                          setShowLevels(false);
                        }}
                        aria-label={
                          unlocked
                            ? `Vai al livello ${lv}`
                            : `Livello ${lv} bloccato`
                        }
                        className={`relative aspect-square rounded-md flex items-center justify-center text-[10px] md:text-xs font-bold border transition-all ${
                          !unlocked
                            ? "bg-white/[0.02] border-white/10 text-white/20 cursor-not-allowed"
                            : done
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:bg-emerald-500/30 hover:scale-105"
                            : "bg-red-500/10 border-red-500/50 text-red-300/80 hover:bg-red-500/20 hover:scale-105"
                        } ${
                          current
                            ? "ring-2 ring-cyan-300 ring-offset-2 ring-offset-black"
                            : ""
                        }`}
                      >
                        {unlocked ? (
                          lv
                        ) : (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                          >
                            <rect
                              x="5"
                              y="11"
                              width="14"
                              height="10"
                              rx="2"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M8 11V7a4 4 0 0 1 8 0v4"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
              <div className="mt-5 flex items-center flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-widest">
                <span className="flex items-center gap-2 text-emerald-300">
                  <span className="size-2.5 rounded-sm bg-emerald-400" />{" "}
                  Completato
                </span>
                <span className="flex items-center gap-2 text-red-300/80">
                  <span className="size-2.5 rounded-sm bg-red-500/60" />{" "}
                  Da fare
                </span>
                <span className="flex items-center gap-2 text-cyan-300">
                  <span className="size-2.5 rounded-sm ring-2 ring-cyan-300" />{" "}
                  Attuale
                </span>
                <span className="flex items-center gap-2 text-white/30">
                  <span className="size-2.5 rounded-sm bg-white/10 border border-white/10" />{" "}
                  Bloccato
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate modal — unlocked when all 100 levels are completed */}
      <AnimatePresence>
        {showCertificate && (
          <CertificateOverlay onClose={() => setShowCertificate(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// === Verification overlay: streams binary + code snippets, then "PASSWORD CRIPTATA" ===

const SNIPPETS = [
  "0x7F 0xA3 0xB1 0xCC 0x09",
  "rsa-2048: handshake established",
  "DECRYPT --key=phantom --target=stdout",
  "sudo nmap -sS -p- 192.168.0.1",
  "[INFO] bypassing firewall...",
  "0010 1101 0110 1110 1010 0011",
  "echo $((42 ^ 0xDEADBEEF))",
  "AES-256-GCM :: ok",
  "SHA-512: a3f9c2...e1bb",
  "::1 connection accepted",
  "memcpy(&buf, payload, 0x40)",
  "[*] root@localhost ~ # ./crack.sh",
  "0xDEADBEEF :: heap injected",
  "stack pivot @ 0x7ffd...",
  "ssl: TLS_AES_256_GCM_SHA384",
  "kernel.panic = 0",
  "for(i=0; i<n; i++) brute(i)",
  "openssl enc -aes-256-cbc -d",
  "ASLR bypass :: success",
  "fragmenting payload [#####...]",
];

function randBinaryRow(len = 48): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += Math.random() > 0.5 ? "1" : "0";
    if (i % 4 === 3) s += " ";
  }
  return s;
}

function randSnippet(): string {
  return SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
}

function VerifyOverlay({
  status,
  word,
}: {
  status: "verifying" | "success";
  word: string;
}) {
  const [lines, setLines] = useState<{ id: number; text: string }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (status !== "verifying") return;
    const interval = setInterval(() => {
      const isBin = Math.random() > 0.45;
      const text = isBin
        ? randBinaryRow(40 + Math.floor(Math.random() * 24))
        : randSnippet();
      idRef.current += 1;
      const id = idRef.current;
      setLines((prev) => [...prev.slice(-12), { id, text }]);
    }, 70);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-30 rounded-2xl bg-black/95 backdrop-blur-md overflow-hidden flex flex-col"
    >
      {/* scanline overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(16,185,129,0.0) 0px, rgba(16,185,129,0.06) 1px, rgba(0,0,0,0) 3px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 h-12 bg-gradient-to-b from-emerald-400/20 to-transparent pointer-events-none"
        style={{
          top: 0,
          animation: "scan 1.6s linear infinite",
        }}
      />

      {/* Streaming code */}
      <div className="relative flex-1 p-5 md:p-6 font-mono text-[11px] md:text-xs leading-snug text-emerald-300/85 overflow-hidden">
        <div className="text-emerald-200 mb-2">
          <span className="text-emerald-500">{">"} </span>decrypting password
          stream...
        </div>
        <div className="space-y-0.5">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap overflow-hidden text-ellipsis"
              >
                <span className="text-emerald-500/60">$ </span>
                {l.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Success reveal */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85"
          >
            <div className="text-[10px] uppercase tracking-[0.5em] text-emerald-300/70">
              // status
            </div>
            <div className="text-2xl md:text-4xl font-bold text-emerald-300 text-center tracking-wide drop-shadow-[0_0_18px_rgba(16,185,129,0.7)]">
              PASSWORD CRIPTATA
            </div>
            <div className="text-emerald-200/90 font-mono text-base md:text-lg tracking-[0.3em]">
              ✓ {word}
            </div>
            <div className="mt-2 text-[10px] text-emerald-400/60 font-mono">
              ACCESS_GRANTED // loading next target...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes scan {
          from {
            transform: translateY(-50%);
          }
          to {
            transform: translateY(2200%);
          }
        }
      `}</style>
    </motion.div>
  );
}

// === Certificate overlay: form → generated SVG cert → download / tap to zoom ===

function CertificateOverlay({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "cert">("form");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [zoomed, setZoomed] = useState(false);
  const certRef = useRef<SVGSVGElement>(null);

  const dateStr = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const serial =
    "HAK-" +
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase();
  const hash = Array.from({ length: 24 }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");

  const fullName = `${first.trim()} ${last.trim()}`.trim();

  const downloadCert = async () => {
    const svg = certRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const utf8 = new TextEncoder().encode(xml);
    let binary = "";
    for (const b of utf8) binary += String.fromCharCode(b);
    const svg64 = btoa(binary);
    const src = "data:image/svg+xml;base64," + svg64;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = 1200 * scale;
      canvas.height = 850 * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, 1200, 850);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attestato-${last || "hacker"}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = src;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl border border-emerald-500/40 bg-black/95 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_80px_rgba(16,185,129,0.35)]"
      >
        <button
          type="button"
          data-cursor="hover"
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute top-4 right-4 text-emerald-300/60 hover:text-emerald-200 text-xl"
        >
          ✕
        </button>

        {step === "form" ? (
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.5em] text-emerald-300/70 mb-2">
              // mission complete
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-emerald-300 drop-shadow-[0_0_18px_rgba(16,185,129,0.6)]">
              CONGRATULAZIONI!
            </h3>
            <p className="mt-4 text-sm md:text-base text-emerald-200/80">
              Hai completato tutti i{" "}
              <span className="text-cyan-300">100 livelli</span> del{" "}
              <span className="text-cyan-300">pwd-cracker</span>. Sei
              ufficialmente un{" "}
              <span className="text-emerald-300">Hacker Certificato</span>.
            </p>
            <p className="mt-2 text-xs text-emerald-300/60">
              Inserisci i tuoi dati per generare l&apos;attestato ufficiale.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-emerald-300/60">
                  Nome
                </span>
                <input
                  type="text"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  maxLength={30}
                  className="mt-1 w-full rounded-md border border-emerald-500/40 bg-black/60 px-3 py-2 text-white placeholder:text-emerald-300/30 focus:outline-none focus:border-emerald-400 focus:shadow-[0_0_16px_rgba(16,185,129,0.4)]"
                  placeholder="es. Mario"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-emerald-300/60">
                  Cognome
                </span>
                <input
                  type="text"
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  maxLength={30}
                  className="mt-1 w-full rounded-md border border-emerald-500/40 bg-black/60 px-3 py-2 text-white placeholder:text-emerald-300/30 focus:outline-none focus:border-emerald-400 focus:shadow-[0_0_16px_rgba(16,185,129,0.4)]"
                  placeholder="es. Rossi"
                />
              </label>
            </div>

            <button
              type="button"
              data-cursor="hover"
              disabled={!first.trim() || !last.trim()}
              onClick={() => setStep("cert")}
              className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-gradient-to-r from-emerald-300 to-cyan-300 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-shadow"
            >
              GENERA ATTESTATO →
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="text-[10px] uppercase tracking-[0.4em] text-emerald-300/70">
              // certificato generato
            </div>

            <button
              type="button"
              data-cursor="hover"
              onClick={() => setZoomed(true)}
              aria-label="Ingrandisci attestato"
              className="relative w-full max-w-2xl rounded-lg overflow-hidden ring-1 ring-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-transform hover:scale-[1.01]"
            >
              <Certificate
                ref={certRef}
                name={fullName}
                date={dateStr}
                serial={serial}
                hash={hash}
              />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                type="button"
                data-cursor="hover"
                onClick={downloadCert}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-emerald-300 to-cyan-300 text-black hover:shadow-[0_0_24px_rgba(16,185,129,0.55)] transition-shadow"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Scarica PNG
              </button>
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setZoomed(true)}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border border-emerald-400/60 text-emerald-200 hover:bg-emerald-500/10 transition-colors"
              >
                🔍 Ingrandisci
              </button>
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setStep("form")}
                className="text-xs uppercase tracking-widest text-emerald-300/60 hover:text-emerald-200 px-2 py-1"
              >
                ← Modifica nome
              </button>
            </div>
          </div>
        )}

        {/* Zoom overlay */}
        <AnimatePresence>
          {zoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomed(false)}
              className="fixed inset-0 z-[180] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl rounded-lg overflow-hidden ring-1 ring-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.4)]"
              >
                <Certificate
                  name={fullName}
                  date={dateStr}
                  serial={serial}
                  hash={hash}
                />
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setZoomed(false)}
                  aria-label="Chiudi"
                  className="absolute top-3 right-3 size-9 rounded-full bg-black/70 border border-emerald-500/50 text-emerald-200 hover:bg-black/90"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function FailOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-30 rounded-2xl bg-black/95 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(239,68,68,0.0) 0px, rgba(239,68,68,0.07) 1px, rgba(0,0,0,0) 3px)",
        }}
      />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          x: [0, -4, 4, -3, 3, 0],
        }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center gap-3 px-6 text-center"
      >
        <div className="text-[10px] uppercase tracking-[0.5em] text-red-300/70">
          // status
        </div>
        <div className="text-3xl md:text-5xl font-bold text-red-400 tracking-wide drop-shadow-[0_0_18px_rgba(239,68,68,0.7)]">
          HACKING FAILED
        </div>
        <div className="text-red-200/80 font-mono text-xs md:text-sm">
          ✗ ACCESS DENIED // retrying target...
        </div>
        <div className="mt-2 text-[10px] text-red-300/60 font-mono">
          riprova con una nuova sequenza
        </div>
      </motion.div>
    </motion.div>
  );
}

const Certificate = forwardRef<
  SVGSVGElement,
  { name: string; date: string; serial: string; hash: string }
>(function Certificate({ name, date, serial, hash }, ref) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 850"
      className="w-full h-auto block"
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#04140b" />
          <stop offset="100%" stopColor="#00180d" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#10b981"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="1200" height="850" fill="url(#bg)" />
      <rect width="1200" height="850" fill="url(#grid)" />

      {/* corner brackets */}
      {[
        [40, 40, 1, 1],
        [1160, 40, -1, 1],
        [40, 810, 1, -1],
        [1160, 810, -1, -1],
      ].map(([x, y, dx, dy], i) => (
        <g key={i} stroke="#34d399" strokeWidth="2" fill="none">
          <path d={`M ${x} ${y} L ${x + 30 * dx} ${y}`} />
          <path d={`M ${x} ${y} L ${x} ${y + 30 * dy}`} />
        </g>
      ))}

      {/* outer border */}
      <rect
        x="60"
        y="60"
        width="1080"
        height="730"
        fill="none"
        stroke="#10b981"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <rect
        x="72"
        y="72"
        width="1056"
        height="706"
        fill="none"
        stroke="#10b981"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      {/* top bar */}
      <g transform="translate(100 100)">
        <circle cx="0" cy="0" r="7" fill="#ef4444" fillOpacity="0.7" />
        <circle cx="22" cy="0" r="7" fill="#eab308" fillOpacity="0.7" />
        <circle cx="44" cy="0" r="7" fill="#10b981" fillOpacity="0.8" />
        <text
          x="70"
          y="5"
          fill="#6ee7b7"
          fontFamily="monospace"
          fontSize="14"
          letterSpacing="4"
        >
          TERMINAL // certificate.generator
        </text>
      </g>
      <text
        x="1100"
        y="105"
        textAnchor="end"
        fill="#6ee7b7"
        fontFamily="monospace"
        fontSize="13"
        letterSpacing="3"
      >
        STATUS: VERIFIED ✓
      </text>

      {/* kicker */}
      <text
        x="600"
        y="180"
        textAnchor="middle"
        fill="#6ee7b7"
        fontFamily="monospace"
        fontSize="14"
        letterSpacing="8"
        opacity="0.8"
      >
        // OFFICIAL CERTIFICATE OF ACHIEVEMENT
      </text>

      {/* title */}
      <text
        x="600"
        y="260"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="64"
        fontWeight="bold"
        fill="url(#glow)"
        letterSpacing="6"
      >
        HACKER CERTIFICATO
      </text>

      {/* subtitle */}
      <text
        x="600"
        y="310"
        textAnchor="middle"
        fill="#ffffff"
        opacity="0.75"
        fontFamily="monospace"
        fontSize="18"
        letterSpacing="3"
      >
        Level 100 / 100 — password-cracker.exe
      </text>

      {/* "conferito a" */}
      <text
        x="600"
        y="390"
        textAnchor="middle"
        fill="#6ee7b7"
        fontFamily="monospace"
        fontSize="14"
        letterSpacing="8"
        opacity="0.8"
      >
        CONFERITO A
      </text>

      {/* name */}
      <text
        x="600"
        y="470"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="58"
        fontWeight="bold"
        fill="#ffffff"
      >
        {name.toUpperCase() || "ANONYMOUS"}
      </text>

      <line
        x1="300"
        y1="500"
        x2="900"
        y2="500"
        stroke="#34d399"
        strokeOpacity="0.6"
        strokeWidth="1"
      />

      {/* body text */}
      <text
        x="600"
        y="555"
        textAnchor="middle"
        fill="#e6f1ff"
        fontFamily="monospace"
        fontSize="15"
        opacity="0.85"
      >
        Per aver decifrato 100 password consecutive, bypassato ogni firewall
      </text>
      <text
        x="600"
        y="578"
        textAnchor="middle"
        fill="#e6f1ff"
        fontFamily="monospace"
        fontSize="15"
        opacity="0.85"
      >
        e dimostrato abilità eccezionali nel pensiero logico-cibernetico.
      </text>

      {/* meta grid */}
      <g transform="translate(180 640)">
        <text
          x="0"
          y="0"
          fill="#6ee7b7"
          fontFamily="monospace"
          fontSize="11"
          letterSpacing="3"
          opacity="0.6"
        >
          DATA
        </text>
        <text
          x="0"
          y="22"
          fill="#ffffff"
          fontFamily="monospace"
          fontSize="16"
          fontWeight="bold"
        >
          {date}
        </text>
      </g>
      <g transform="translate(600 640)" textAnchor="middle">
        <text
          x="0"
          y="0"
          fill="#6ee7b7"
          fontFamily="monospace"
          fontSize="11"
          letterSpacing="3"
          opacity="0.6"
        >
          SERIAL-ID
        </text>
        <text
          x="0"
          y="22"
          fill="#ffffff"
          fontFamily="monospace"
          fontSize="16"
          fontWeight="bold"
        >
          {serial}
        </text>
      </g>
      <g transform="translate(1020 640)" textAnchor="end">
        <text
          x="0"
          y="0"
          fill="#6ee7b7"
          fontFamily="monospace"
          fontSize="11"
          letterSpacing="3"
          opacity="0.6"
        >
          CLEARANCE
        </text>
        <text
          x="0"
          y="22"
          fill="#ffffff"
          fontFamily="monospace"
          fontSize="16"
          fontWeight="bold"
        >
          ROOT / LEVEL-10
        </text>
      </g>

      {/* hash */}
      <text
        x="600"
        y="720"
        textAnchor="middle"
        fill="#34d399"
        fontFamily="monospace"
        fontSize="13"
        opacity="0.7"
        letterSpacing="2"
      >
        SHA-256: {hash}
      </text>

      {/* signature line */}
      <g transform="translate(840 760)">
        <line
          x1="-120"
          y1="0"
          x2="120"
          y2="0"
          stroke="#ffffff"
          strokeOpacity="0.3"
        />
        <text
          x="0"
          y="20"
          textAnchor="middle"
          fill="#ffffff"
          opacity="0.7"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="13"
        >
          DAILY APPS // system admin
        </text>
      </g>
      <g
        transform="translate(840 740)"
        fontFamily="cursive"
        fontSize="24"
        fill="#e6f1ff"
        textAnchor="middle"
      >
        <text x="0" y="0" transform="rotate(-4)">~daily-apps~</text>
      </g>

      {/* seal */}
      <g transform="translate(220 760)">
        <circle
          cx="0"
          cy="0"
          r="45"
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
        />
        <circle
          cx="0"
          cy="0"
          r="38"
          fill="none"
          stroke="#34d399"
          strokeOpacity="0.5"
          strokeDasharray="4 3"
        />
        <text
          x="0"
          y="-3"
          textAnchor="middle"
          fill="#34d399"
          fontFamily="monospace"
          fontSize="10"
          letterSpacing="2"
        >
          CERTIFIED
        </text>
        <text
          x="0"
          y="14"
          textAnchor="middle"
          fill="#34d399"
          fontFamily="monospace"
          fontSize="22"
          fontWeight="bold"
        >
          ✓
        </text>
      </g>
    </svg>
  );
});

