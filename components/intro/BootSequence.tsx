"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type LineKind = "info" | "ok" | "warn" | "dim" | "prog" | "ascii";
type Line = {
  text: string;
  kind?: LineKind;
  progress?: number; // 0..1 when kind === "prog"
};

const ASCII = [
  "  ____          _ _         _    ____  ____  ____  ",
  " |  _ \\  __ _  (_) |_   _  / \\  |  _ \\|  _ \\/ ___| ",
  " | | | |/ _` | | | | | | |/ _ \\ | |_) | |_) \\___ \\ ",
  " | |_| | (_| | | | | |_| / ___ \\|  __/|  __/ ___) |",
  " |____/ \\__,_|_|_|_|\\__, /_/   \\_\\_|   |_|  |____/ ",
  "                    |___/                            ",
];

const SEQUENCE: Line[] = [
  { text: ASCII[0], kind: "ascii" },
  { text: ASCII[1], kind: "ascii" },
  { text: ASCII[2], kind: "ascii" },
  { text: ASCII[3], kind: "ascii" },
  { text: ASCII[4], kind: "ascii" },
  { text: ASCII[5], kind: "ascii" },
  { text: "" },
  { text: "BIOS v4.2.1 :: POST ............................ ok", kind: "info" },
  { text: "Detecting CPU: quantum-core x64 @ 4.8 GHz", kind: "dim" },
  { text: "Mounting /dev/sda1 as read-write ................ ok", kind: "info" },
  { text: "Loading kernel modules [████████░░] 80%", kind: "prog", progress: 0.8 },
  { text: "insmod: crypto_aes_256_gcm ...................... ok", kind: "ok" },
  { text: "insmod: net_tcp_stack ........................... ok", kind: "ok" },
  { text: "insmod: webgl_driver_v3 ......................... ok", kind: "ok" },
  { text: "systemd[1]: starting session daemon", kind: "dim" },
  { text: "> initializing ssl context [TLS_AES_256_GCM_SHA384]", kind: "info" },
  { text: "  handshake complete :: rsa-2048 + sha-512", kind: "dim" },
  { text: "> mounting virtual filesystem ................... ok", kind: "info" },
  { text: "> registering app_registry [#########]  100%", kind: "prog", progress: 1 },
  { text: "  [ok] farmaci          ::  mounted", kind: "ok" },
  { text: "  [ok] green-village    ::  mounted", kind: "ok" },
  { text: "  [ok] manutenzioni     ::  mounted", kind: "ok" },
  { text: "  [ok] rate             ::  mounted", kind: "ok" },
  { text: "  [ok] ricette          ::  mounted", kind: "ok" },
  { text: "  [ok] school-diary     ::  mounted", kind: "ok" },
  { text: "  [ok] timbrature       ::  mounted", kind: "ok" },
  { text: "  [ok] todo-list        ::  mounted", kind: "ok" },
  { text: "> spawning shader pipelines ..................... ok", kind: "info" },
  { text: "> priming lenis smooth-scroll ................... ok", kind: "info" },
  { text: "> warm-up cursor::fx ............................ ok", kind: "info" },
  { text: "kernel.panic = 0 :: firewall active", kind: "dim" },
  { text: "net.link eth0: up 1Gb/s ......................... ok", kind: "info" },
  { text: "auth :: root@daily_apps granted clearance [LVL 10]", kind: "warn" },
  { text: "render pipeline :: dpr=2 aa=on triangles=78k", kind: "dim" },
  { text: "", kind: "info" },
  { text: "> system ready. welcome, user.", kind: "ok" },
];

const LINE_DELAY = 55; // ms per line append

export function BootSequence() {
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    if (sessionStorage.getItem("boot-done") === "1") {
      setVisible(false);
      return;
    }
    const t = setInterval(() => {
      setLineIndex((i) => {
        if (i + 1 >= SEQUENCE.length) {
          clearInterval(t);
          setTimeout(() => {
            sessionStorage.setItem("boot-done", "1");
            setVisible(false);
          }, 700);
          return i + 1;
        }
        return i + 1;
      });
    }, LINE_DELAY);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll container so latest line is visible
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lineIndex]);

  const skip = () => {
    sessionStorage.setItem("boot-done", "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5 }}
          onClick={skip}
          className="fixed inset-0 z-[200] bg-[#020014] flex items-center justify-center font-mono text-xs md:text-sm cursor-pointer overflow-hidden"
        >
          {/* CRT scanline overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(34,211,238,0.0) 0px, rgba(34,211,238,0.06) 1px, rgba(0,0,0,0) 3px)",
            }}
          />
          {/* subtle radial vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
            }}
          />

          <div className="relative w-full max-w-2xl px-6 text-center">
            {/* header badge */}
            <div className="mb-4 flex items-center justify-center gap-2 text-cyan-300">
              <span className="size-2 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_12px_theme(colors.cyan.300)]" />
              <span className="uppercase tracking-[0.4em] text-xs">
                daily_apps // system
              </span>
            </div>

            {/* terminal frame */}
            <div className="rounded-lg border border-cyan-400/30 bg-black/60 backdrop-blur-sm shadow-[0_0_40px_rgba(34,211,238,0.15)] text-center overflow-hidden">
              <div className="flex items-center gap-1.5 border-b border-cyan-400/20 px-3 py-2 text-left">
                <span className="size-2 rounded-full bg-red-500/70" />
                <span className="size-2 rounded-full bg-yellow-500/70" />
                <span className="size-2 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
                  /bin/boot
                </span>
                <span className="ml-auto text-[10px] text-cyan-300/50 tabular-nums">
                  {String(Math.min(lineIndex + 1, SEQUENCE.length)).padStart(
                    2,
                    "0"
                  )}
                  /{SEQUENCE.length}
                </span>
              </div>

              <div
                ref={containerRef}
                className="h-[55vh] md:h-[60vh] overflow-hidden px-4 md:px-6 py-4 leading-[1.45]"
              >
                {SEQUENCE.slice(0, lineIndex + 1).map((l, i) => {
                  const color =
                    l.kind === "ok"
                      ? "text-emerald-300"
                      : l.kind === "warn"
                      ? "text-yellow-300"
                      : l.kind === "dim"
                      ? "text-cyan-300/50"
                      : l.kind === "ascii"
                      ? "text-cyan-300"
                      : "text-cyan-100/90";
                  const isLast = i === lineIndex;
                  const isDone = lineIndex >= SEQUENCE.length - 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.12 }}
                      className={`whitespace-pre ${color}`}
                    >
                      {l.text}
                      {isLast && !isDone && l.kind !== "ascii" && (
                        <span className="inline-block w-2 h-3.5 bg-cyan-300 animate-pulse ml-1 align-middle" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 text-[10px] uppercase tracking-[0.3em] text-white/35">
              click anywhere to skip
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
