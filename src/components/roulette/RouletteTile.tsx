import {Card} from '@astryxdesign/core/Card';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {FoodImage} from '@/components/media/FoodImage';
import type {RouletteItem} from './useRoulette';

type RouletteTileProps = {
  item: RouletteItem;
  width: number;
  isHighlighted?: boolean;
};

/** One dish card on the roulette strip. */
export function RouletteTile({item, width, isHighlighted = false}: RouletteTileProps) {
  return (
    <Card
      width={width}
      padding={2}
      className={isHighlighted ? 'accent-ring' : undefined}
      aria-hidden={!isHighlighted}
    >
      <HStack gap={3} align="center">
        <FoodImage src={item.imageUrl} alt={item.title} width={76} radius="element" />
        <VStack gap={0.5} style={{minWidth: 0}}>
          <Text weight="bold" maxLines={1} hasTruncateTooltip={false}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text type="supporting" maxLines={1} hasTruncateTooltip={false}>
              {item.subtitle}
            </Text>
          )}
        </VStack>
      </HStack>
    </Card>
  );
}
