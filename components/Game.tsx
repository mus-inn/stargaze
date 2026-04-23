'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const EMOJIS = ['🌙', '⭐', '🪐', '☄️', '🌌', '🌠', '🌍', '🛸'] as const;

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j]!, r[i]!];
  }
  return r;
};

const buildDeck = (): Card[] =>
  shuffle(
    EMOJIS.flatMap((e, i) => [
      { id: i * 2, emoji: e, flipped: false, matched: false },
      { id: i * 2 + 1, emoji: e, flipped: false, matched: false },
    ]),
  );

const fmtTime = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export default function Game() {
  const [cards, setCards] = useState<Card[]>(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [bestMs, setBestMs] = useState<number | null>(null);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [finalTimeMs, setFinalTimeMs] = useState<number | null>(null);

  const allMatched = useMemo(() => cards.every((c) => c.matched), [cards]);
  const hasStarted = startTime !== null;

  // Load records once
  useEffect(() => {
    try {
      const bm = localStorage.getItem('stargaze.bestMs');
      const bv = localStorage.getItem('stargaze.bestMoves');
      if (bm) setBestMs(Number(bm));
      if (bv) setBestMoves(Number(bv));
    } catch {
      // localStorage unavailable (SSR, private mode) — ignore
    }
  }, []);

  // Running timer
  useEffect(() => {
    if (!hasStarted || allMatched) return;
    const id = setInterval(() => setElapsedMs(Date.now() - startTime), 100);
    return () => clearInterval(id);
  }, [hasStarted, startTime, allMatched]);

  // Save on win
  useEffect(() => {
    if (!allMatched || startTime === null || finalTimeMs !== null) return;
    const final = Date.now() - startTime;
    setElapsedMs(final);
    setFinalTimeMs(final);
    try {
      if (bestMs === null || final < bestMs) {
        setBestMs(final);
        localStorage.setItem('stargaze.bestMs', String(final));
      }
      if (bestMoves === null || moves < bestMoves) {
        setBestMoves(moves);
        localStorage.setItem('stargaze.bestMoves', String(moves));
      }
    } catch {
      // ignore
    }
  }, [allMatched, startTime, finalTimeMs, bestMs, bestMoves, moves]);

  const click = useCallback(
    (idx: number) => {
      if (selected.length === 2) return;
      const card = cards[idx];
      if (!card || card.flipped || card.matched) return;

      if (startTime === null) setStartTime(Date.now());

      const next = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
      setCards(next);
      const nextSelected = [...selected, idx];
      setSelected(nextSelected);

      if (nextSelected.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = nextSelected as [number, number];
        const ca = next[a];
        const cb = next[b];
        if (ca && cb && ca.emoji === cb.emoji) {
          setTimeout(() => {
            setCards((cs) =>
              cs.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)),
            );
            setSelected([]);
          }, 320);
        } else {
          setTimeout(() => {
            setCards((cs) =>
              cs.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)),
            );
            setSelected([]);
          }, 900);
        }
      }
    },
    [cards, selected, startTime],
  );

  const reset = () => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setStartTime(null);
    setElapsedMs(0);
    setFinalTimeMs(null);
  };

  return (
    <div className="fade-up">
      <StatsBar
        moves={moves}
        elapsedMs={elapsedMs}
        bestMs={bestMs}
        bestMoves={bestMoves}
        onReset={reset}
        hasStarted={hasStarted}
      />

      <div className="mx-auto mt-6 grid max-w-lg grid-cols-4 gap-3 sm:gap-4 md:mt-8">
        {cards.map((card, idx) => {
          const showFront = card.flipped || card.matched;
          return (
            <div key={card.id} className="card-wrap">
              <button
                type="button"
                onClick={() => click(idx)}
                disabled={card.matched}
                aria-label={showFront ? `Revealed: ${card.emoji}` : 'Hidden card'}
                className="card-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl cursor-pointer disabled:cursor-default"
                data-flipped={showFront}
              >
                <div className="card-face card-face--back">
                  <span className="card-sparkle">✦</span>
                </div>
                <div
                  className="card-face card-face--front"
                  data-matched={card.matched}
                >
                  <span className="card-emoji pop-in" key={`${card.id}-${card.flipped}`}>
                    {card.emoji}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {allMatched && (
        <WinOverlay
          finalMs={finalTimeMs ?? elapsedMs}
          moves={moves}
          bestMs={bestMs}
          bestMoves={bestMoves}
          onReset={reset}
        />
      )}
    </div>
  );
}

function StatsBar({
  moves,
  elapsedMs,
  bestMs,
  bestMoves,
  onReset,
  hasStarted,
}: {
  moves: number;
  elapsedMs: number;
  bestMs: number | null;
  bestMoves: number | null;
  onReset: () => void;
  hasStarted: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-lg items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm backdrop-blur">
      <Stat label="Time" value={fmtTime(elapsedMs)} mono tone={hasStarted ? 'live' : undefined} />
      <Divider />
      <Stat label="Moves" value={String(moves)} mono />
      <Divider />
      <Stat
        label="Best"
        value={
          bestMs !== null
            ? `${fmtTime(bestMs)}${bestMoves !== null ? ` · ${bestMoves}` : ''}`
            : '—'
        }
        mono
        subdued
      />
      <button
        type="button"
        onClick={onReset}
        className="ml-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white cursor-pointer active:scale-[0.98]"
      >
        Reset
      </button>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
  subdued,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  subdued?: boolean;
  tone?: 'live';
}) {
  return (
    <div className="flex flex-col items-start leading-tight">
      <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">{label}</span>
      <span
        className={[
          mono ? 'font-mono' : 'font-sans',
          subdued ? 'text-white/60' : 'text-white',
          tone === 'live' ? 'tabular-nums' : '',
          'text-[15px]',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="h-6 w-px shrink-0 bg-white/10" />;
}

function WinOverlay({
  finalMs,
  moves,
  bestMs,
  bestMoves,
  onReset,
}: {
  finalMs: number;
  moves: number;
  bestMs: number | null;
  bestMoves: number | null;
  onReset: () => void;
}) {
  const isBestTime = bestMs !== null && finalMs <= bestMs;
  const isBestMoves = bestMoves !== null && moves <= bestMoves;
  const isNewRecord = isBestTime || isBestMoves;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md fade-up"
      role="dialog"
      aria-modal="true"
      aria-label="You win"
    >
      <div className="pop-in mx-4 w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/80 via-black/70 to-indigo-950/70 p-7 text-center shadow-[0_30px_80px_-20px_rgba(139,92,246,0.4)]">
        <div className="mb-1 text-4xl">✨</div>
        <h2 className="glow-text mb-1 text-3xl font-semibold tracking-tight">Constellations aligned</h2>
        <p className="mb-6 text-sm text-white/55">
          {isNewRecord ? 'New personal best.' : 'Nicely done.'}
        </p>

        <div className="mb-7 grid grid-cols-2 gap-3">
          <ResultTile label="Time" value={fmtTime(finalMs)} highlight={isBestTime} />
          <ResultTile label="Moves" value={String(moves)} highlight={isBestMoves} />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/[0.15] cursor-pointer active:scale-[0.99]"
          autoFocus
        >
          Play again
        </button>
      </div>
    </div>
  );
}

function ResultTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-2xl border p-3',
        highlight
          ? 'border-emerald-400/40 bg-emerald-400/[0.08]'
          : 'border-white/10 bg-white/[0.04]',
      ].join(' ')}
    >
      <div className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45">{label}</div>
      <div className={['font-mono text-xl', highlight ? 'text-emerald-300' : 'text-white'].join(' ')}>
        {value}
      </div>
      {highlight && <div className="mt-1 text-[10px] text-emerald-300/80">new best</div>}
    </div>
  );
}
