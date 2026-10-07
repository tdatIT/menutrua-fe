import {useMemo} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {VStack} from '@astryxdesign/core/Stack';
import {useToast} from '@astryxdesign/core/Toast';
import {Sparkles} from 'lucide-react';
import {RouletteStrip} from '@/components/roulette/RouletteStrip';
import {useRoulette, type RouletteItem} from '@/components/roulette/useRoulette';
import {getErrorMessage} from '@/lib/http/api-error';
import {useRandomPollEntry} from '../queries';
import type {Poll} from '../types';

/** Group roulette: the server picks an entry, the strip lands on it. */
export function PollPicker({poll, isCompact}: {poll: Poll; isCompact: boolean}) {
  const toast = useToast();
  const randomEntry = useRandomPollEntry(poll.id);

  const items = useMemo<RouletteItem[]>(
    () =>
      poll.entries.map((entry) => ({
        id: entry.id,
        title: entry.dishName,
        subtitle: entry.restaurant ?? entry.memberName,
        imageUrl: entry.imageUrl,
      })),
    [poll.entries],
  );
  const roulette = useRoulette(items, {itemWidth: isCompact ? 260 : 220, gap: 16});
  const winnerEntry = poll.entries.find((entry) => entry.id === roulette.winner?.id);
  const isBusy = randomEntry.isPending || roulette.phase === 'spinning';

  const pick = async () => {
    try {
      const {entryId} = await randomEntry.mutateAsync();
      await roulette.spin(entryId);
    } catch (error) {
      toast({body: getErrorMessage(error), type: 'error'});
    }
  };

  return (
    <VStack gap={6} align="center" width="100%">
      <Heading level={1} type="display-2" weight="bold" justify="center">
        Trưa nay anh chị em mình ăn gì?
      </Heading>
      <RouletteStrip roulette={roulette} label="Vòng quay món của nhóm" />
      {winnerEntry && roulette.phase === 'settled' && (
        <Banner
          status="success"
          title={`Chốt: ${winnerEntry.dishName}`}
          description={`Món đề xuất của ${winnerEntry.memberName}. Lên đơn thôi!`}
          collapsible={false}
        />
      )}
      <Button
        label={roulette.phase === 'spinning' ? 'Đang chọn cho cả nhóm…' : 'Chọn ngẫu nhiên'}
        variant="primary"
        size="lg"
        width={isCompact ? '100%' : 260}
        icon={<Icon icon={Sparkles} />}
        isDisabled={items.length === 0 || isBusy}
        onClick={pick}
      />
    </VStack>
  );
}
