import {Badge} from '@astryxdesign/core/Badge';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {QueryError} from '@/components/feedback/QueryState';
import {PageSection} from '@/components/layout/PageSection';
import {FoodImage} from '@/components/media/FoodImage';
import {Eyebrow} from '@/components/typography/Eyebrow';
import {useFoodCategories} from '../api';

const CARD_WIDTH = 280;

const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/${encodeURIComponent(`${query} gần đây`)}`;

/** "Chọn quán nhanh dùm bạn nhé": swipeable category cards. */
export function CategoryStrip() {
  const categories = useFoodCategories();

  return (
    <PageSection tone="surface" paddingBlock={8} label="Danh mục món">
      <VStack gap={4}>
        <HStack gap={2} align="center" wrap="wrap">
          <Eyebrow color="primary">Chọn quán nhanh dùm bạn nhé</Eyebrow>
          <Badge variant="green" label="Vị trí: HCM" />
        </HStack>

        {categories.error ? (
          <QueryError error={categories.error} onRetry={() => categories.refetch()} />
        ) : (
          <HStack gap={4} isScrollable className="scroll-row" paddingBlock={1}>
            {categories.data
              ? categories.data.map((category) => (
                  <ClickableCard
                    key={category.id}
                    label={`Tìm quán ${category.name} gần đây`}
                    href={mapsSearch(category.name)}
                    target="_blank"
                    padding={2}
                    width={CARD_WIDTH}
                  >
                    <HStack gap={3} align="center">
                      <FoodImage src={category.imageUrl} alt="" width={64} radius="element" />
                      <VStack gap={0.5}>
                        <Text weight="bold">{category.name}</Text>
                        <Text type="supporting">{category.tagline}</Text>
                      </VStack>
                    </HStack>
                  </ClickableCard>
                ))
              : Array.from({length: 5}, (_, index) => (
                  <Skeleton key={index} width={CARD_WIDTH} height={80} index={index} />
                ))}
          </HStack>
        )}
      </VStack>
    </PageSection>
  );
}
