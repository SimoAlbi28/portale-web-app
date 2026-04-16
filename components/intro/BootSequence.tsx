"use client";

import { useEffect, useRef } from "react";

type Line = { text: string; kind?: string };

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
  { text: "Loading kernel modules [████████░░] 80%", kind: "prog" },
  { text: "insmod: crypto_aes_256_gcm ...................... ok", kind: "ok" },
  { text: "insmod: net_tcp_stack ........................... ok", kind: "ok" },
  { text: "insmod: webgl_driver_v3 ......................... ok", kind: "ok" },
  { text: "systemd[1]: starting session daemon", kind: "dim" },
  { text: "> initializing ssl context [TLS_AES_256_GCM_SHA384]", kind: "info" },
  { text: "  handshake complete :: rsa-2048 + sha-512", kind: "dim" },
  { text: "> mounting virtual filesystem ................... ok", kind: "info" },
  { text: "> registering app_registry [#########]  100%", kind: "prog" },
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

const LINE_DELAY = 55;
const FADEOUT_DELAY = SEQUENCE.length * LINE_DELAY + 600;

const COLOR_MAP: Record<string, string> = {
  ok: "text-emerald-300",
  warn: "text-yellow-300",
  dim: "text-cyan-300/50",
  ascii: "text-cyan-300",
  prog: "text-cyan-100/90",
  info: "text-cyan-100/90",
};

function hide(el: HTMLElement) {
  el.style.opacity = "0";
  el.style.visibility = "hidden";
  el.style.pointerEvents = "none";
  try { sessionStorage.setItem("boot-done", "1"); } catch { /* ignore */ }
}

export function BootSequence() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip entirely on mobile/touch
    const isMobile = "ontouchstart" in window || window.innerWidth < 768;
    if (isMobile) {
      el.style.display = "none";
      try { sessionStorage.setItem("boot-done", "1"); } catch { /* ignore */ }
      return;
    }

    // Already seen — hide immediately
    try {
      if (sessionStorage.getItem("boot-done") === "1") {
        el.style.display = "none";
        return;
      }
    } catch { /* ignore */ }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.display = "none";
      return;
    }

    // Skip on click / touch — direct DOM, no React
    const skip = () => hide(el);
    el.addEventListener("click", skip);
    el.addEventListener("touchend", skip);

    // Auto-dismiss: CSS transition on opacity, triggered after delay
    // Using inline transition + class toggle is the most reliable cross-browser
    el.style.transition = "opacity 0.5s ease-out, visibility 0s linear 0.5s";

    const timer = setTimeout(() => hide(el), FADEOUT_DELAY);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("click", skip);
      el.removeEventListener("touchend", skip);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[200] bg-[#020014] flex items-center justify-center font-mono text-xs md:text-sm cursor-pointer overflow-hidden"
    >
      {/* CRT scanline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(34,211,238,0) 0px, rgba(34,211,238,0.06) 1px, rgba(0,0,0,0) 3px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <div className="relative w-full max-w-2xl px-6 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-cyan-300">
          <span className="size-2 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_12px_theme(colors.cyan.300)]" />
          <span className="uppercase tracking-[0.4em] text-xs">
            daily_apps // system
          </span>
        </div>

        <div className="rounded-lg border border-cyan-400/30 bg-black/60 backdrop-blur-sm shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-cyan-400/20 px-3 py-2 text-left">
            <span className="size-2 rounded-full bg-red-500/70" />
            <span className="size-2 rounded-full bg-yellow-500/70" />
            <span className="size-2 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
              /bin/boot
            </span>
          </div>

          <div className="h-[55vh] md:h-[60vh] overflow-y-auto px-4 md:px-6 py-4 leading-[1.45] text-left">
            {SEQUENCE.map((l, i) => (
              <div
                key={i}
                className={`whitespace-pre boot-line ${COLOR_MAP[l.kind ?? "info"]}`}
                style={{ animationDelay: `${i * LINE_DELAY}ms` }}
              >
                {l.text}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 text-[10px] uppercase tracking-[0.3em] text-white/35">
          click anywhere to skip
        </div>
      </div>
    </div>
  );
}
