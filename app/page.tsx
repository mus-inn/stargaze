import Game from '@/components/Game';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col px-4 py-8 md:py-14">
      <header className="mb-8 text-center md:mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
          <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
          memory match
        </div>
        <h1 className="glow-text text-5xl font-semibold tracking-tight md:text-6xl">
          Stargaze
        </h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-sm text-white/55 md:text-base">
          Flip pairs. Match all eight constellations. Beat your best time.
        </p>
      </header>

      <div className="flex-1">
        <Game />
      </div>

      <footer className="mt-10 text-center text-[11px] text-white/40">
        <p>
          Built with <span className="text-white/60">Next.js 15</span> · Deployed on Vercel
        </p>
      </footer>
    </main>
  );
}
