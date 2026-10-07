import type {ReactNode} from 'react';
import {VStack} from '@astryxdesign/core/Stack';

type PageSectionProps = {
  children: ReactNode;
  /** `surface` = white band, `body` = ivory page background. */
  tone?: 'body' | 'surface';
  paddingBlock?: 6 | 8 | 10;
  id?: string;
  label?: string;
};

const TONE_BACKGROUND = {
  body: 'var(--color-background-body)',
  surface: 'var(--color-background-surface)',
} as const;

/**
 * Full-bleed landing band with a centred 1280px content column, so every
 * marketing section shares one content line.
 */
export function PageSection({
  children,
  tone = 'body',
  paddingBlock = 10,
  id,
  label,
}: PageSectionProps) {
  return (
    <VStack
      as="section"
      id={id}
      aria-label={label}
      width="100%"
      paddingBlock={paddingBlock}
      paddingInline={4}
      style={{background: TONE_BACKGROUND[tone]}}
    >
      <VStack width="100%" maxWidth={1280} style={{marginInline: 'auto'}}>
        {children}
      </VStack>
    </VStack>
  );
}
