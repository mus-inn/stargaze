import type { CSSProperties } from 'react';
import Game from '@/components/Game';

const TITLE = 'stargate Memory';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col px-4 py-8 md:py-14">
      <header className="mb-8 text-center md:mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
          <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
          memory match
        </div>

        <div className="stargate-title">
          <span className="stargate-portal" aria-hidden="true">
            <span className="sg-outer-ring"></span>
            <span className="sg-inner-ring"></span>
            <span className="sg-chevrons">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="sg-chevron"
                  style={{ '--i': i } as CSSProperties}
                >
                  <span className="sg-chevron-shape">
                    <span className="sg-chevron-led"></span>
                  </span>
                </span>
              ))}
            </span>
            <span className="sg-event-horizon">
              <span className="sg-vortex"></span>
              <span className="sg-ripples"></span>
            </span>
            <span className="sg-kawoosh"></span>
          </span>

          <h1 className="glow-text relative text-5xl font-semibold tracking-tight md:text-6xl">
            <span className="sr-only">{TITLE}</span>
            <span aria-hidden="true" className="inline-flex">
              {Array.from(TITLE).map((ch, i) => (
                <span
                  key={i}
                  className="title-letter"
                  style={{ animationDelay: `${220 + i * 70}ms` }}
                >
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </span>
          </h1>
        </div>

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
