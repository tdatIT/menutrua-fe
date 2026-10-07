import {Divider} from '@astryxdesign/core/Divider';
import {Heading} from '@astryxdesign/core/Heading';
import {Selector} from '@astryxdesign/core/Selector';
import {VStack} from '@astryxdesign/core/Stack';
import {Switch} from '@astryxdesign/core/Switch';
import {useToast} from '@astryxdesign/core/Toast';
import {getErrorMessage} from '@/lib/http/api-error';
import {useUpdatePoll} from '../queries';
import {POLL_DURATION_OPTIONS, POLL_MODE_OPTIONS} from '../schemas';
import type {Poll, PollMode, PollSettings} from '../types';

/** "Cài đặt bình chọn": each control saves immediately (optimistic). */
export function PollSettingsPanel({poll}: {poll: Poll}) {
  const toast = useToast();
  const updatePoll = useUpdatePoll(poll.id);
  const {settings} = poll;

  const save = (patch: Partial<PollSettings>) =>
    updatePoll.mutate(
      {settings: patch},
      {onError: (error) => toast({body: getErrorMessage(error), type: 'error'})},
    );

  return (
    <VStack as="section" gap={5} aria-labelledby="poll-settings-title">
      <Heading level={2} id="poll-settings-title">
        Cài đặt bình chọn
      </Heading>
      <Switch
        label="Tự động bình chọn"
        description="Đến thời gian kết thúc bình chọn hệ thống sẽ tự chọn kết quả."
        value={settings.autoPick}
        onChange={(autoPick) => save({autoPick})}
        labelPosition="start"
        labelSpacing="spread"
        width="100%"
      />
      <Divider />
      <Selector
        label="Loại bình chọn"
        description="Biểu quyết / Nhân phẩm"
        options={POLL_MODE_OPTIONS}
        value={settings.mode}
        onChange={(mode) => save({mode: mode as PollMode})}
        presentation="adaptive"
        width="100%"
      />
      <Selector
        label="Thời gian kết thúc"
        options={POLL_DURATION_OPTIONS}
        value={String(settings.durationMinutes)}
        onChange={(value) => save({durationMinutes: Number(value)})}
        presentation="adaptive"
        width="100%"
      />
    </VStack>
  );
}
