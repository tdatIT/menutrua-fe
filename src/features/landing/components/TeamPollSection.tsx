import {Avatar} from '@astryxdesign/core/Avatar';
import {AvatarGroup} from '@astryxdesign/core/AvatarGroup';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Center} from '@astryxdesign/core/Center';
import {Divider} from '@astryxdesign/core/Divider';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Text} from '@astryxdesign/core/Text';
import {UsersRound} from 'lucide-react';
import {paths} from '@/app/router/paths';
import {PageSection} from '@/components/layout/PageSection';
import {percent} from '@/lib/format';
import {usePollPreview} from '../api';
import type {PollPreview} from '../types';

function PollPreviewCard({preview}: {preview: PollPreview}) {
  const total = preview.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Card padding={5} elevation="med" width="100%" maxWidth={400}>
      <VStack gap={4}>
        <HStack gap={2} align="center">
          <StatusDot variant="accent" label="Đang diễn ra" />
          <Text weight="bold">{preview.title}</Text>
        </HStack>
        {preview.options.map((option, index) => {
          const share = percent(option.votes, total);
          return (
            <ProgressBar
              key={option.label}
              label={option.label}
              value={share}
              hasValueLabel
              formatValueLabel={() => `${share}% (${option.votes} người)`}
              variant={index === 0 ? 'accent' : 'neutral'}
            />
          );
        })}
        <Divider />
        <HStack justify="between" align="center">
          <AvatarGroup size="sm">
            {preview.participants.map((person) => (
              <Avatar key={person.name} name={person.name} />
            ))}
          </AvatarGroup>
          <Text type="supporting" color="accent">
            Bình chọn kết thúc sau {preview.endsInMinutes} phút!
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
}

/** "Cả nhóm chưa biết ăn gì? Để Menutrua lo tất!" */
export function TeamPollSection() {
  const preview = usePollPreview();

  return (
    <PageSection tone="surface" label="Bình chọn nhóm" id="team-poll">
      <Grid columns={{minWidth: 340, max: 2}} gap={10} align="center">
        <Center className="soft-panel" padding={8} minHeight={360}>
          {preview.data ? (
            <PollPreviewCard preview={preview.data} />
          ) : (
            <Skeleton width={400} height={220} />
          )}
        </Center>

        <VStack gap={5} align="start">
          <Badge variant="orange" label="TÍNH NĂNG ĐỒNG ĐỘI" />
          <Heading level={2} type="display-3" weight="bold" textWrap="balance">
            Cả nhóm chưa biết ăn gì? Để Menutrua lo tất!
          </Heading>
          <Text color="secondary">
            Không cần phải cãi nhau mệt mỏi mỗi khi đến giờ trưa. Tạo ngay đề xuất chọn món cho cả
            nhóm. Note lại luôn thông tin order của thành viên và mã QR của bạn để thành viên trong
            nhóm thanh toán nhé ~~
          </Text>
          <HStack gap={3} wrap="wrap">
            <Button
              label="Tạo bình chọn nhóm ngay"
              variant="primary"
              size="lg"
              href={paths.app.polls}
              endContent={<Icon icon={UsersRound} />}
            />
            <Button
              label="Xem cách hoạt động"
              size="lg"
              className="button-outline-accent"
              href={paths.register}
            />
          </HStack>
        </VStack>
      </Grid>
    </PageSection>
  );
}
