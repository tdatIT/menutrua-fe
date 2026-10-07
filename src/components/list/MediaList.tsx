import type {ReactNode} from 'react';
import {List} from '@astryxdesign/core/List';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {VStack} from '@astryxdesign/core/Stack';

type MediaListProps = {
  label: string;
  children: ReactNode;
};

/** Spaced list of MediaRow items. */
export function MediaList({label, children}: MediaListProps) {
  return (
    <List className="media-list" aria-label={label}>
      {children}
    </List>
  );
}

export function MediaListSkeleton({rows = 4}: {rows?: number}) {
  return (
    <VStack gap={3} aria-busy>
      {Array.from({length: rows}, (_, index) => (
        <Skeleton key={index} height={80} radius={4} index={index} />
      ))}
    </VStack>
  );
}
