import {HStack} from '@astryxdesign/core/Stack';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import type {RouletteController} from './useRoulette';
import {RouletteTile} from './RouletteTile';
import './roulette.css';

type RouletteStripProps = {
  roulette: RouletteController;
  label: string;
};

/**
 * Presentational slot strip. All motion lives in useRoulette + CSS; this
 * component only lays tiles out and forwards the transitionend.
 */
export function RouletteStrip({roulette, label}: RouletteStripProps) {
  const {
    viewportRef,
    strip,
    offset,
    phase,
    winner,
    winnerIndex,
    isAnimating,
    itemWidth,
    durationMs,
    onTransitionEnd,
  } = roulette;

  return (
    <HStack
      ref={viewportRef}
      className="roulette"
      data-phase={phase}
      as="section"
      aria-label={label}
      aria-busy={phase === 'spinning'}
      paddingBlock={5}
    >
      <HStack className="roulette-marker" aria-hidden />
      <HStack
        className="roulette-track"
        data-animating={isAnimating}
        gap={4}
        align="center"
        style={{
          transform: `translateX(${offset}px)`,
          transitionDuration: isAnimating ? `${durationMs}ms` : '0ms',
        }}
        onTransitionEnd={(event) => {
          // Card hover transitions bubble up too; only the track's own
          // transform means the spin has landed.
          if (event.target === event.currentTarget && event.propertyName === 'transform') {
            onTransitionEnd();
          }
        }}
      >
        {strip.map((item, index) => (
          <RouletteTile
            key={`${item.id}-${index}`}
            item={item}
            width={itemWidth}
            isHighlighted={index === winnerIndex}
          />
        ))}
      </HStack>
      <VisuallyHidden aria-live="polite">
        {phase === 'spinning' ? 'Đang quay món…' : winner ? `Đã chọn: ${winner.title}` : ''}
      </VisuallyHidden>
    </HStack>
  );
}
