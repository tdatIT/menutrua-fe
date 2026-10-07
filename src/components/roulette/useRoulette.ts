import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

export type RouletteItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
};

export type RoulettePhase = 'idle' | 'spinning' | 'settled';

type Options = {
  itemWidth: number;
  gap: number;
  /** Spin duration in ms; must match the CSS transition. */
  durationMs?: number;
};

const STRIP_LENGTH = 48;
const START_INDEX = 3;
const WINNER_INDEX = 40;
const IDLE_MIN_LENGTH = 15;

function repeatToFill<T>(items: readonly T[], minLength: number): T[] {
  if (items.length === 0) return [];
  const repeats = Math.ceil(minLength / items.length);
  return Array.from({length: repeats}, () => items).flat();
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * State machine behind the slot-style picker: builds the strip, computes the
 * translateX that lands the winner under the centre marker, and resolves
 * once the CSS transition settles. Domain-agnostic: callers map their data
 * into RouletteItem and decide the winner (usually the server does).
 */
export function useRoulette(
  items: readonly RouletteItem[],
  {itemWidth, gap, durationMs = 4500}: Options,
) {
  const stride = itemWidth + gap;
  const [viewportWidth, setViewportWidth] = useState(0);
  const [phase, setPhase] = useState<RoulettePhase>('idle');
  const [spinStrip, setSpinStrip] = useState<RouletteItem[] | null>(null);
  const [offsetIndex, setOffsetIndex] = useState<{index: number; jitter: number}>({
    index: START_INDEX,
    jitter: 0,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [winner, setWinner] = useState<RouletteItem | null>(null);
  // Mirrors spinStrip so the settle callback reads it without side effects
  // inside a state updater.
  const spinStripRef = useRef<RouletteItem[] | null>(null);
  const settleRef = useRef<{resolve: (item: RouletteItem) => void; timer: number} | null>(null);

  // Callback ref: the strip unmounts while the result card shows, so the
  // observer must re-attach whenever a new viewport node mounts.
  const observerRef = useRef<ResizeObserver | null>(null);
  const viewportRef = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width));
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => () => window.clearTimeout(settleRef.current?.timer), []);

  const idleStrip = useMemo(() => repeatToFill(items, IDLE_MIN_LENGTH), [items]);
  const strip = spinStrip ?? idleStrip;

  const offset =
    -(offsetIndex.index * stride + itemWidth / 2 - viewportWidth / 2) + offsetIndex.jitter;

  const settle = useCallback(() => {
    const pending = settleRef.current;
    if (!pending) return;
    window.clearTimeout(pending.timer);
    settleRef.current = null;
    setIsAnimating(false);
    const landed = spinStripRef.current?.[WINNER_INDEX];
    if (!landed) return;
    setPhase('settled');
    setWinner(landed);
    pending.resolve(landed);
  }, []);

  /** Spins until `winnerId` sits under the marker. Resolves with the item. */
  const spin = useCallback(
    (winnerId: string) =>
      new Promise<RouletteItem>((resolve, reject) => {
        const target = items.find((item) => item.id === winnerId);
        if (!target) {
          reject(new Error(`Roulette item ${winnerId} not found`));
          return;
        }
        const current = strip[offsetIndex.index] ?? randomItem(items);
        const next = Array.from({length: STRIP_LENGTH}, () => randomItem(items));
        next[START_INDEX] = current;
        next[WINNER_INDEX] = target;

        // 1) Jump (no transition) to the same visual item on the new strip.
        setWinner(null);
        setIsAnimating(false);
        spinStripRef.current = next;
        setSpinStrip(next);
        setOffsetIndex({index: START_INDEX, jitter: 0});
        setPhase('spinning');

        // 2) Next frames: animate to the winner with a little jitter so it
        //    doesn't always stop dead-centre.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setIsAnimating(true);
            setOffsetIndex({
              index: WINNER_INDEX,
              jitter: (Math.random() - 0.5) * itemWidth * 0.5,
            });
          }),
        );

        // Fallback: transitionend never fires in background tabs.
        settleRef.current = {
          resolve,
          timer: window.setTimeout(settle, durationMs + 300),
        };
      }),
    [items, strip, offsetIndex.index, itemWidth, durationMs, settle],
  );

  /** Back to the idle strip (e.g. "Trở lại danh sách"). */
  const reset = useCallback(() => {
    window.clearTimeout(settleRef.current?.timer);
    settleRef.current = null;
    setIsAnimating(false);
    spinStripRef.current = null;
    setSpinStrip(null);
    setWinner(null);
    setOffsetIndex({index: START_INDEX, jitter: 0});
    setPhase('idle');
  }, []);

  return {
    viewportRef,
    strip,
    offset,
    phase,
    winner,
    winnerIndex: phase === 'settled' ? WINNER_INDEX : -1,
    isAnimating,
    itemWidth,
    gap,
    durationMs,
    spin,
    reset,
    onTransitionEnd: settle,
  };
}

export type RouletteController = ReturnType<typeof useRoulette>;
