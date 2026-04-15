"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

function buildTiles(word: string): Tile[] {
  const letters = word.split("");
  const shuffled = shuffle(letters);
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
  const [status, setStatus] = useState<
    "idle" | "checking" | "verifying" | "success"
  >("idle");
  const [attempts, setAttempts] = useState(0);

  // Hydrate
  useEffect(() => {
    const s = loadState();
    setState(s);
    const w = pickWordForLevel(s.level);
    setWord(w);
    setTiles(buildTiles(w));
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
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
    setTiles((prev) => {
      const tile = prev.find((t) => t.id === tileId);
      if (!tile || tile.placedSlot !== null || tile.locked) return prev;
      // Find next free slot (no tile has that placedSlot, and not locked)
      const placedSlots = new Set(
        prev.filter((t) => t.placedSlot !== null).map((t) => t.placedSlot)
      );
      let target = -1;
      for (let i = 0; i < word.length; i++) {
        if (!placedSlots.has(i)) {
          target = i;
          break;
        }
      }
      if (target === -1) return prev;
      return prev.map((t) => (t.id === tileId ? { ...t, placedSlot: target } : t));
    });
  };

  const removeFromSlot = (tileId: number) => {
    if (status !== "idle") return;
    setTiles((prev) =>
      prev.map((t) =>
        t.id === tileId && !t.locked ? { ...t, placedSlot: null } : t
      )
    );
  };

  // Check when all slots filled
  useEffect(() => {
    if (!word || status !== "idle") return;
    const placed = tiles.filter((t) => t.placedSlot !== null).length;
    if (placed !== word.length) return;
    // Auto check
    setStatus("checking");
    setAttempts((a) => a + 1);
    setTimeout(() => {
      setTiles((prev) => {
        const next = prev.map((t) => {
          if (t.placedSlot === null) return t;
          if (t.letter === word[t.placedSlot]) {
            return { ...t, locked: true };
          }
          return { ...t, placedSlot: null, shake: true };
        });
        return next;
      });
      // Clear shake flag
      setTimeout(() => {
        setTiles((prev) => prev.map((t) => ({ ...t, shake: false })));
        // Check if all locked → success
        setTiles((prev) => {
          const allLocked = prev.every((t) => t.locked);
          if (allLocked) {
            setStatus("verifying");
            const newCompleted = Array.from(
              new Set([...state.completed, state.level])
            );
            const nextLevel = Math.min(TOTAL_LEVELS, state.level + 1);
            // Verification animation duration ~2.6s, then success text ~0.8s
            setTimeout(() => setStatus("success"), 2600);
            setTimeout(() => {
              setState({ level: nextLevel, completed: newCompleted });
              if (state.level < TOTAL_LEVELS) {
                startNewLevel(nextLevel);
              }
            }, 3400);
          } else {
            setStatus("idle");
          }
          return prev;
        });
      }, 450);
    }, 250);
  }, [tiles, word, status, state.level, state.completed, startNewLevel]);

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
          {attempts > 0 && (
            <span className="ml-2 opacity-50">// attempt {attempts}</span>
          )}
        </div>

        {/* Slots */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
          {slots.map((tile, i) => {
            const lit =
              status === "success" || (tile && tile.locked) ? "ok" : "idle";
            return (
              <motion.button
                key={i}
                type="button"
                data-cursor="hover"
                onClick={() => tile && !tile.locked && removeFromSlot(tile.id)}
                aria-label={`Slot ${i + 1}`}
                animate={
                  tile?.shake
                    ? { x: [-6, 6, -4, 4, 0] }
                    : status === "success"
                    ? { scale: [1, 1.12, 1] }
                    : {}
                }
                transition={{ duration: 0.35 }}
                className={`size-10 md:size-12 rounded-md border flex items-center justify-center text-base md:text-lg font-bold uppercase transition-colors ${
                  lit === "ok"
                    ? "border-emerald-400 bg-emerald-500/15 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.5)]"
                    : tile
                    ? "border-cyan-400/60 bg-cyan-400/5 text-cyan-200"
                    : "border-emerald-500/30 bg-black/60 text-emerald-500/30"
                }`}
              >
                {tile?.letter || "_"}
              </motion.button>
            );
          })}
        </div>

        {/* Pool */}
        <div className="flex flex-wrap justify-center gap-2 min-h-[3rem]">
          <AnimatePresence>
            {pool.map((tile) => (
              <motion.button
                key={tile.id}
                type="button"
                data-cursor="hover"
                onClick={() => placeInNextSlot(tile.id)}
                layout
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                className="size-9 md:size-10 rounded-md border border-emerald-500/50 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors flex items-center justify-center text-sm md:text-base font-bold uppercase shadow-[0_0_10px_rgba(16,185,129,0.25)]"
              >
                {tile.letter}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Verification overlay */}
        <AnimatePresence>
          {(status === "verifying" || status === "success") && (
            <VerifyOverlay status={status} word={word} />
          )}
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
          <div className="text-emerald-500/60 animate-pulse">
            {status === "success"
              ? "✓ ACCESS GRANTED"
              : status === "verifying"
              ? "decrypting..."
              : status === "checking"
              ? "verifying..."
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
                    return (
                      <div
                        key={lv}
                        className={`relative aspect-square rounded-md flex items-center justify-center text-[10px] md:text-xs font-bold border ${
                          done
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                            : "bg-red-500/10 border-red-500/50 text-red-300/80"
                        } ${
                          current
                            ? "ring-2 ring-cyan-300 ring-offset-2 ring-offset-black"
                            : ""
                        }`}
                      >
                        {lv}
                      </div>
                    );
                  }
                )}
              </div>
              <div className="mt-5 flex items-center justify-center gap-6 text-[11px] uppercase tracking-widest">
                <span className="flex items-center gap-2 text-emerald-300">
                  <span className="size-2.5 rounded-sm bg-emerald-400" />{" "}
                  Completato
                </span>
                <span className="flex items-center gap-2 text-red-300/80">
                  <span className="size-2.5 rounded-sm bg-red-500/60" />{" "}
                  Bloccato
                </span>
                <span className="flex items-center gap-2 text-cyan-300">
                  <span className="size-2.5 rounded-sm ring-2 ring-cyan-300" />{" "}
                  Attuale
                </span>
              </div>
            </motion.div>
          </motion.div>
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
