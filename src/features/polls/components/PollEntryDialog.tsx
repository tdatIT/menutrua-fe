import {useToast} from '@astryxdesign/core/Toast';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {FormDialog} from '@/components/form/FormDialog';
import {FormTextInput} from '@/components/form/FormTextInput';
import {applyServerErrors} from '@/components/form/server-errors';
import {useUpdatePollEntry} from '../queries';
import {pollEntrySchema, type PollEntryValues} from '../schemas';
import type {PollEntry} from '../types';

type PollEntryDialogProps = {
  pollId: string;
  entry: PollEntry;
  onClose: () => void;
};

/** Edit a member's dish. Mount with `key={entry.id}`. */
export function PollEntryDialog({pollId, entry, onClose}: PollEntryDialogProps) {
  const toast = useToast();
  const updateEntry = useUpdatePollEntry(pollId);
  const {control, handleSubmit, setError} = useForm<PollEntryValues>({
    resolver: zodResolver(pollEntrySchema),
    defaultValues: {dishName: entry.dishName, restaurant: entry.restaurant ?? ''},
  });

  const onSubmit = handleSubmit((input) =>
    updateEntry.mutate(
      {entryId: entry.id, input},
      {
        onSuccess: () => {
          toast({body: `Đã cập nhật món của ${entry.memberName}.`});
          onClose();
        },
        onError: (error) => {
          const message = applyServerErrors(error, setError, ['dishName', 'restaurant']);
          if (message) toast({body: message, type: 'error'});
        },
      },
    ),
  );

  return (
    <FormDialog
      isOpen
      title={`Món của ${entry.memberName}`}
      isPending={updateEntry.isPending}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <FormTextInput control={control} name="dishName" label="Tên món ăn" isRequired hasAutoFocus />
      <FormTextInput control={control} name="restaurant" label="Tên quán" isOptional />
    </FormDialog>
  );
}
