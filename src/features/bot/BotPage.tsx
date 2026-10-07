import {Button} from '@astryxdesign/core/Button';
import {Center} from '@astryxdesign/core/Center';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Icon} from '@astryxdesign/core/Icon';
import {Bot} from 'lucide-react';
import {paths} from '@/app/router/paths';
import {useDocumentTitle} from '@/hooks/useDocumentTitle';

/** Placeholder until the suggestion bot ships. */
export default function BotPage() {
  useDocumentTitle('BOT gợi ý');
  return (
    <Center minHeight="100%" padding={6}>
      <EmptyState
        headingLevel={1}
        icon={<Icon icon={Bot} color="accent" size="lg" />}
        title="BOT gợi ý đang được nấu"
        description="Sắp tới bro có thể thêm BOT vào Slack/Discord để nhận gợi ý món mỗi trưa."
        actions={<Button label="Quay món ngay" variant="primary" href={paths.app.pick} />}
      />
    </Center>
  );
}
