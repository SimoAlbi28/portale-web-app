export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/5">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 py-10 md:py-14 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_theme(colors.cyan.300)]" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
            Daily Apps — {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <a
            href="https://github.com/simoalbi28"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="hover:text-cyan-300 transition-colors"
          >
            GitHub
          </a>
          <span className="text-white/20">•</span>
          <a
            href="mailto:simone.albini28@gmail.com"
            data-cursor="hover"
            className="hover:text-fuchsia-300 transition-colors"
          >
            Contatti
          </a>
        </div>
      </div>
    </footer>
  );
}
