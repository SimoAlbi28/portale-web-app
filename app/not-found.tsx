import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
      <span className="text-xs uppercase tracking-[0.4em] font-mono text-cyan-300">
        // Error 404
      </span>
      <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
          Segnale perso
        </span>
      </h1>
      <p className="max-w-md text-white/60">
        La pagina che cercavi non esiste in questo universo. Torna al portale e
        riprova.
      </p>
      <Link
        href="/"
        data-cursor="hover"
        className="rounded-full px-6 py-3 font-semibold bg-gradient-to-r from-cyan-300 to-violet-300 text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-shadow"
      >
        ← Torna al portale
      </Link>
    </div>
  );
}
