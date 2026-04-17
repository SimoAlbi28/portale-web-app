export function SectionSeparator() {
  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-5xl px-6 md:px-10 py-6 md:py-10"
    >
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block size-3 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,1)] ring-2 ring-cyan-300/30" />
    </div>
  );
}
