import {useState} from 'react';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Center} from '@astryxdesign/core/Center';
import {Icon} from '@astryxdesign/core/Icon';
import {UtensilsCrossed} from 'lucide-react';

type FoodImageProps = {
  src: string | null | undefined;
  alt: string;
  /** width / height. */
  ratio?: number;
  radius?: 'inner' | 'element' | 'container';
  /** Fixed square/rect width in px; omit to fill the parent. */
  width?: number;
  /** Above-the-fold images should load eagerly. */
  isPriority?: boolean;
};

/** Cropped food photo with a graceful placeholder when missing or broken. */
export function FoodImage({
  src,
  alt,
  ratio = 1,
  radius = 'element',
  width,
  isPriority = false,
}: FoodImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isBroken = !src || failedSrc === src;

  return (
    <AspectRatio
      ratio={ratio}
      fit="cover"
      className="food-image"
      data-radius={radius}
      style={width ? {width, flexShrink: 0} : undefined}
    >
      {isBroken ? (
        <Center>
          <Icon icon={UtensilsCrossed} color="secondary" label={alt} />
        </Center>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={isPriority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      )}
    </AspectRatio>
  );
}
