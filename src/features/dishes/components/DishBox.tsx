import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {Plus, UtensilsCrossed} from 'lucide-react';
import {ConfirmDialog} from '@/components/feedback/ConfirmDialog';
import {QueryError} from '@/components/feedback/QueryState';
import {MediaList, MediaListSkeleton} from '@/components/list/MediaList';
import {MediaRow} from '@/components/list/MediaRow';
import {getErrorMessage} from '@/lib/http/api-error';
import {useDeleteDish, useDishes} from '../queries';
import type {Dish} from '../types';
import {formatDishSubtitle} from '../utils';
import {DishFormDialog} from './DishFormDialog';

type DialogState = {mode: 'closed'} | {mode: 'create'} | {mode: 'edit'; dish: Dish};

/** "Hộp Món Ăn Của Bạn": the personal dish list with add/edit/delete. */
export function DishBox({isCompact}: {isCompact: boolean}) {
  const toast = useToast();
  const dishes = useDishes();
  const deleteDish = useDeleteDish();
  const [dialog, setDialog] = useState<DialogState>({mode: 'closed'});
  const [pendingDelete, setPendingDelete] = useState<Dish | null>(null);

  const count = dishes.data?.length ?? 0;
  const openCreate = () => setDialog({mode: 'create'});

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const {name} = pendingDelete;
    setPendingDelete(null);
    deleteDish.mutate(pendingDelete.id, {
      onSuccess: () => toast({body: `Đã xóa “${name}”.`}),
      onError: (error) => toast({body: getErrorMessage(error), type: 'error'}),
    });
  };

  return (
    <VStack as="section" gap={4} aria-labelledby="dish-box-title">
      <HStack justify="between" align="center" gap={3}>
        <VStack gap={0.5}>
          <Heading level={2} id="dish-box-title">
            Hộp Món Ăn Của Bạn
          </Heading>
          <Text type="supporting">Chứa {count} món ăn trưa ngon lành</Text>
        </VStack>
        <Button
          label="Thêm món"
          variant="primary"
          icon={<Icon icon={Plus} />}
          onClick={openCreate}
        />
      </HStack>

      {dishes.isPending ? (
        <MediaListSkeleton />
      ) : dishes.error ? (
        <QueryError error={dishes.error} onRetry={() => dishes.refetch()} />
      ) : count === 0 ? (
        <EmptyState
          isCompact
          icon={<Icon icon={UtensilsCrossed} color="accent" size="lg" />}
          title="Hộp món đang trống"
          description="Thêm vài món quen để MenuTrua quay giúp bro nhé."
          actions={<Button label="Thêm món đầu tiên" variant="primary" onClick={openCreate} />}
        />
      ) : (
        <MediaList label="Danh sách món của bạn">
          {dishes.data.map((dish) => (
            <MediaRow
              key={dish.id}
              title={dish.name}
              subtitle={formatDishSubtitle(dish)}
              imageUrl={dish.imageUrl}
              isCompact={isCompact}
              isBusy={deleteDish.isPending && deleteDish.variables === dish.id}
              onEdit={() => setDialog({mode: 'edit', dish})}
              onDelete={() => setPendingDelete(dish)}
            />
          ))}
        </MediaList>
      )}

      {dialog.mode !== 'closed' && (
        <DishFormDialog
          key={dialog.mode === 'edit' ? dialog.dish.id : 'create'}
          isOpen
          dish={dialog.mode === 'edit' ? dialog.dish : null}
          onClose={() => setDialog({mode: 'closed'})}
        />
      )}

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="Xóa món này?"
        description={`“${pendingDelete?.name ?? ''}” sẽ bị xóa khỏi hộp món của bạn.`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </VStack>
  );
}
