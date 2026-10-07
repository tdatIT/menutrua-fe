import {Card} from '@astryxdesign/core/Card';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {QueryBoundary} from '@/components/feedback/QueryState';
import {PageSection} from '@/components/layout/PageSection';
import {FoodImage} from '@/components/media/FoodImage';
import {formatPrice} from '@/lib/format';
import {useFeaturedDishes} from '../api';
import type {FeaturedDish} from '../types';

function FeaturedDishCard({dish}: {dish: FeaturedDish}) {
  return (
    <Card padding={0} elevation="low">
      <FoodImage src={dish.imageUrl} alt={dish.name} ratio={2} radius="container" />
      <VStack gap={3} padding={5}>
        <HStack justify="between" align="center" gap={3} wrap="wrap">
          <Heading level={3}>{dish.name}</Heading>
          <Text weight="bold" color="accent">
            Từ {formatPrice(dish.priceFrom)}
          </Text>
        </HStack>
        <Text color="secondary">{dish.description}</Text>
      </VStack>
    </Card>
  );
}

/** "Tinh hoa ẩm thực Việt cho bữa trưa tròn vị". */
export function FeaturedDishes() {
  const featured = useFeaturedDishes();

  return (
    <PageSection label="Món nổi bật">
      <VStack gap={8}>
        <VStack gap={3} align="center" maxWidth={720} style={{marginInline: 'auto'}}>
          <Heading level={2} type="display-3" weight="bold" justify="center" textWrap="balance">
            Tinh hoa ẩm thực Việt cho bữa trưa tròn vị
          </Heading>
          <Text color="secondary" justify="center" display="block">
            Chúng mình lựa chọn những món ăn đặc sắc nhất từ các quán ngon trên Google Map gửi cho
            bạn. Hy vọng bạn có 1 buổi trưa ngon miệng nhé!
          </Text>
        </VStack>
        <QueryBoundary
          query={featured}
          loading={
            <Grid columns={{minWidth: 320, max: 2}} gap={6}>
              <Skeleton height={420} index={0} />
              <Skeleton height={420} index={1} />
            </Grid>
          }
        >
          {(dishes) => (
            <Grid columns={{minWidth: 320, max: 2}} gap={6}>
              {dishes.map((dish) => (
                <FeaturedDishCard key={dish.id} dish={dish} />
              ))}
            </Grid>
          )}
        </QueryBoundary>
      </VStack>
    </PageSection>
  );
}
