import {Button} from '@astryxdesign/core/Button';
import {Center} from '@astryxdesign/core/Center';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Icon} from '@astryxdesign/core/Icon';
import {CircleAlert, SearchX} from 'lucide-react';
import {isRouteErrorResponse, useRouteError} from 'react-router';
import {paths} from './paths';

export function NotFoundPage() {
  return (
    <Center minHeight="70dvh" padding={4}>
      <EmptyState
        headingLevel={1}
        icon={<Icon icon={SearchX} size="lg" color="accent" />}
        title="Không tìm thấy trang"
        description="Món này không có trong thực đơn rồi bro."
        actions={<Button label="Về trang chủ" variant="primary" href={paths.home} />}
      />
    </Center>
  );
}

/** Catches render/loader errors so one broken page never blanks the app. */
export function RouteErrorPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  if (import.meta.env.DEV) console.error(error);
  return (
    <Center minHeight="70dvh" padding={4}>
      <EmptyState
        headingLevel={1}
        icon={<Icon icon={CircleAlert} size="lg" color="error" />}
        title="Ối, có lỗi xảy ra"
        description="Bro thử tải lại trang giúp mình nhé."
        actions={
          <Button label="Tải lại" variant="primary" onClick={() => window.location.reload()} />
        }
      />
    </Center>
  );
}
