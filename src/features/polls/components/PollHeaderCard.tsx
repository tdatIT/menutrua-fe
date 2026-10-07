import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {useClipboard} from '@astryxdesign/core/hooks';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {HStack, StackItem, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {zodResolver} from '@hookform/resolvers/zod';
import {Check, Link2, Pencil} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {paths} from '@/app/router/paths';
import {FormDialog} from '@/components/form/FormDialog';
import {FormTextInput} from '@/components/form/FormTextInput';
import {FoodImage} from '@/components/media/FoodImage';
import {getErrorMessage} from '@/lib/http/api-error';
import {useUpdatePoll} from '../queries';
import {pollNameSchema, type PollNameValues} from '../schemas';
import type {Poll} from '../types';

function RenamePollDialog({poll, onClose}: {poll: Poll; onClose: () => void}) {
  const toast = useToast();
  const updatePoll = useUpdatePoll(poll.id);
  const {control, handleSubmit} = useForm<PollNameValues>({
    resolver: zodResolver(pollNameSchema),
    defaultValues: {name: poll.name},
  });

  const onSubmit = handleSubmit(({name}) => {
    onClose();
    updatePoll.mutate(
      {name},
      {onError: (error) => toast({body: getErrorMessage(error), type: 'error'})},
    );
  });

  return (
    <FormDialog isOpen title="Đổi tên nhóm" onClose={onClose} onSubmit={onSubmit}>
      <FormTextInput control={control} name="name" label="Tên nhóm" hasAutoFocus />
    </FormDialog>
  );
}

/** Group identity: avatar, name (renamable), join code and share link. */
export function PollHeaderCard({poll, isCompact}: {poll: Poll; isCompact: boolean}) {
  const toast = useToast();
  const {copy, isCopied} = useClipboard({resetAfterMs: 2000});
  const [isRenaming, setIsRenaming] = useState(false);
  const shareUrl = `${window.location.origin}${paths.app.polls}?code=${poll.code}`;

  const share = async () => {
    if (await copy(shareUrl)) toast({body: 'Đã sao chép liên kết nhóm!', uniqueID: 'share'});
  };

  const shareIcon = <Icon icon={isCopied ? Check : Link2} />;

  return (
    <Card padding={3} width="100%">
      <VStack gap={3}>
        <HStack gap={3} align="center">
          <FoodImage src={poll.imageUrl} alt={poll.name} width={56} radius="element" />
          <StackItem size="fill">
            <VStack gap={0.5}>
              <HStack gap={2} align="center">
                <Heading level={2} maxLines={1}>
                  {poll.name}
                </Heading>
                <IconButton
                  label="Đổi tên nhóm"
                  size="sm"
                  variant="ghost"
                  icon={<Icon icon={Pencil} color="accent" />}
                  onClick={() => setIsRenaming(true)}
                />
              </HStack>
              <Text type="supporting">ID: {poll.code}</Text>
            </VStack>
          </StackItem>
          {!isCompact && (
            <IconButton
              label="Sao chép liên kết nhóm"
              tooltip="Chia sẻ liên kết nhóm"
              variant="ghost"
              icon={shareIcon}
              onClick={share}
            />
          )}
        </HStack>
        {isCompact && (
          <Button
            label="Chia sẻ liên kết nhóm"
            className="button-outline-accent"
            width="100%"
            icon={shareIcon}
            onClick={share}
          />
        )}
      </VStack>
      {isRenaming && <RenamePollDialog poll={poll} onClose={() => setIsRenaming(false)} />}
    </Card>
  );
}
