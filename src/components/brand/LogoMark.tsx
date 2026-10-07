import {Center} from '@astryxdesign/core/Center';
import {Icon} from '@astryxdesign/core/Icon';
import {Utensils} from 'lucide-react';

type LogoMarkProps = {
  size?: 'sm' | 'md';
};

const BOX = {sm: 28, md: 36} as const;

/** The orange app tile with crossed utensils. */
export function LogoMark({size = 'md'}: LogoMarkProps) {
  return (
    <Center className="brand-mark" width={BOX[size]} height={BOX[size]}>
      <Icon icon={Utensils} size={size === 'md' ? 'md' : 'sm'} />
    </Center>
  );
}
