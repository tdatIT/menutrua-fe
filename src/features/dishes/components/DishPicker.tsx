import {useMemo, useState} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {Sparkles} from 'lucide-react';
import {RouletteStrip} from '@/components/roulette/RouletteStrip';
import {useRoulette} from '@/components/roulette/useRoulette';
import {getErrorMessage} from '@/lib/http/api-error';
import {useDishes, useRandomDish} from '../queries';
import {toRouletteItem} from '../utils';
import {DishResultCard} from './DishResultCard';

const COPY = {
  idle: {
    title: 'Trưa nay ăn gì đây bro?',
    subtitle:
      'Nhấn nút quay ngẫu nhiên dưới đây để MenuTrua đưa ra gợi ý hoàn hảo nhất cho chiếc bụng đói của bạn!',
  },
  spinning: {
    title: 'Đang quay món…',
    subtitle: 'Bro chờ một xíu nhé, MenuTrua đang tìm kiếm tinh hoa ẩm thực thích hợp nhất!',
  },
} as const;

/** Main stage: roulette while picking, result card once settled. */
export function DishPicker({isCompact}: {isCompact: boolean}) {
  const toast = useToast();
  const dishes = useDishes();
  const randomDish = useRandomDish();
  const [lastWinnerId, setLastWinnerId] = useState<string | undefined>();

  const items = useMemo(() => (dishes.data ?? []).map(toRouletteItem), [dishes.data]);
  const roulette = useRoulette(items, {itemWidth: isCompact ? 260 : 220, gap: 16});
  const winnerDish = dishes.data?.find((dish) => dish.id === roulette.winner?.id);
  const isBusy = randomDish.isPending || roulette.phase === 'spinning';

  const pick = async () => {
    try {
      const {dishId} = await randomDish.mutateAsync(lastWinnerId);
      const landed = await roulette.spin(dishId);
      setLastWinnerId(landed.id);
    } catch (error) {
      toast({body: getErrorMessage(error), type: 'error'});
    }
  };

  if (roulette.phase === 'settled' && winnerDish) {
    return (
      <VStack gap={6} align="center" width="100%">
        <Badge variant="green" label="🎉 Hoàn hảo! Menu của bạn đã sẵn sàng" />
        <DishResultCard dish={winnerDish} />
        <HStack gap={3} wrap="wrap" justify="center">
          <Button label="Trở lại danh sách" size="lg" onClick={roulette.reset} />
          <Button
            label="Chọn lại món khác"
            variant="primary"
            size="lg"
            icon={<Icon icon={Sparkles} />}
            isLoading={isBusy}
            onClick={pick}
          />
        </HStack>
      </VStack>
    );
  }

  const copy = roulette.phase === 'spinning' ? COPY.spinning : COPY.idle;
  const isEmpty = !dishes.isPending && items.length === 0;

  return (
    <VStack gap={6} align="center" width="100%">
      <VStack gap={3} align="center" maxWidth={640}>
        <Heading
          level={1}
          type="display-2"
          weight="bold"
          justify="center"
          color={roulette.phase === 'spinning' ? 'accent' : 'primary'}
        >
          {copy.title}
        </Heading>
        <Text color="secondary" justify="center" display="block">
          {copy.subtitle}
        </Text>
      </VStack>

      {dishes.isPending ? (
        <Skeleton height={140} radius="rounded" />
      ) : (
        <RouletteStrip roulette={roulette} label="Vòng quay món ăn" />
      )}

      <Button
        label={roulette.phase === 'spinning' ? 'Đang chọn cho bro…' : 'Chọn ngẫu nhiên'}
        variant="primary"
        size="lg"
        width={isCompact ? '100%' : 260}
        icon={<Icon icon={Sparkles} />}
        isDisabled={isEmpty || isBusy}
        tooltip={isEmpty ? 'Thêm ít nhất 1 món để quay nhé' : undefined}
        onClick={pick}
      />
    </VStack>
  );
}
