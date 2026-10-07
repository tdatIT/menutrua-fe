import {useState} from 'react';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {UsersRound} from 'lucide-react';
import {ConfirmDialog} from '@/components/feedback/ConfirmDialog';
import {MediaList} from '@/components/list/MediaList';
import {MediaRow} from '@/components/list/MediaRow';
import {getErrorMessage} from '@/lib/http/api-error';
import {useRemovePollEntry} from '../queries';
import type {Poll, PollEntry} from '../types';
import {PollEntryDialog} from './PollEntryDialog';

/** "Thành viên tham gia": each member's proposed dish. */
export function PollMembers({poll, isCompact}: {poll: Poll; isCompact: boolean}) {
  const toast = useToast();
  const removeEntry = useRemovePollEntry(poll.id);
  const [editing, setEditing] = useState<PollEntry | null>(null);
  const [removing, setRemoving] = useState<PollEntry | null>(null);

  const confirmRemove = () => {
    if (!removing) return;
    const {id, memberName} = removing;
    setRemoving(null);
    removeEntry.mutate(id, {
      onSuccess: () => toast({body: `Đã xóa món của ${memberName}.`}),
      onError: (error) => toast({body: getErrorMessage(error), type: 'error'}),
    });
  };

  return (
    <VStack as="section" gap={4} aria-labelledby="poll-members-title">
      <VStack gap={0.5}>
        <Heading level={2} id="poll-members-title">
          Thành viên tham gia
        </Heading>
        <Text type="supporting">{poll.entries.length} món đang chờ bình chọn</Text>
      </VStack>

      {poll.entries.length === 0 ? (
        <EmptyState
          isCompact
          icon={<Icon icon={UsersRound} color="accent" size="lg" />}
          title="Chưa có ai tham gia"
          description="Chia sẻ liên kết nhóm để mọi người thêm món nhé."
        />
      ) : (
        <MediaList label="Món của thành viên">
          {poll.entries.map((entry) => (
            <MediaRow
              key={entry.id}
              title={entry.dishName}
              subtitle={entry.memberName}
              imageUrl={entry.imageUrl}
              isCompact={isCompact}
              onEdit={() => setEditing(entry)}
              onDelete={() => setRemoving(entry)}
            />
          ))}
        </MediaList>
      )}

      {editing && (
        <PollEntryDialog
          key={editing.id}
          pollId={poll.id}
          entry={editing}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmDialog
        isOpen={removing !== null}
        title="Xóa món khỏi bình chọn?"
        description={`Món của ${removing?.memberName ?? ''} sẽ bị xóa khỏi nhóm.`}
        onConfirm={confirmRemove}
        onCancel={() => setRemoving(null)}
      />
    </VStack>
  );
}
