import {Card} from '@astryxdesign/core/Card';
import {Layout, LayoutContent, LayoutPanel} from '@astryxdesign/core/Layout';
import {VStack} from '@astryxdesign/core/Stack';
import {PageSpinner} from '@/components/feedback/PageSpinner';
import {QueryBoundary} from '@/components/feedback/QueryState';
import {useDocumentTitle} from '@/hooks/useDocumentTitle';
import {useIsCompact} from '@/hooks/useIsCompact';
import {PollHeaderCard} from '../components/PollHeaderCard';
import {PollMembers} from '../components/PollMembers';
import {PollPicker} from '../components/PollPicker';
import {PollSettingsPanel} from '../components/PollSettingsPanel';
import {useCurrentPoll} from '../queries';
import type {Poll} from '../types';

function DesktopPoll({poll}: {poll: Poll}) {
  return (
    <Layout
      start={
        <LayoutPanel width={320} padding={6} hasDivider label="Cài đặt bình chọn">
          <PollSettingsPanel poll={poll} />
        </LayoutPanel>
      }
      content={
        <LayoutContent padding={6} label="Vòng quay nhóm">
          <VStack gap={10}>
            <PollHeaderCard poll={poll} isCompact={false} />
            <PollPicker poll={poll} isCompact={false} />
          </VStack>
        </LayoutContent>
      }
      end={
        <LayoutPanel width={360} padding={6} hasDivider label="Thành viên">
          <PollMembers poll={poll} isCompact={false} />
        </LayoutPanel>
      }
    />
  );
}

function CompactPoll({poll}: {poll: Poll}) {
  return (
    <VStack gap={8} padding={4} paddingBlockEnd={10}>
      <PollHeaderCard poll={poll} isCompact />
      <PollPicker poll={poll} isCompact />
      <Card padding={4}>
        <PollSettingsPanel poll={poll} />
      </Card>
      <PollMembers poll={poll} isCompact />
    </VStack>
  );
}

/** "Tạo bình chọn nhóm": settings | roulette | members. */
export default function GroupPollPage() {
  useDocumentTitle('Bình chọn nhóm');
  const isCompact = useIsCompact();
  const poll = useCurrentPoll();

  return (
    <QueryBoundary query={poll} loading={<PageSpinner />} errorTitle="Không tải được nhóm">
      {(data) => (isCompact ? <CompactPoll poll={data} /> : <DesktopPoll poll={data} />)}
    </QueryBoundary>
  );
}
