import type {ReactNode} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {getErrorMessage} from '@/lib/http/api-error';

type QueryErrorProps = {
  error: unknown;
  onRetry?: () => void;
  title?: string;
};

/** Inline, retryable error for a failed query region. */
export function QueryError({error, onRetry, title = 'Không tải được dữ liệu'}: QueryErrorProps) {
  return (
    <Banner
      status="error"
      title={title}
      description={getErrorMessage(error)}
      collapsible={false}
      endContent={onRetry ? <Button label="Thử lại" size="sm" onClick={onRetry} /> : undefined}
    />
  );
}

type QueryBoundaryProps<T> = {
  query: {data: T | undefined; error: unknown; isPending: boolean; refetch: () => unknown};
  loading: ReactNode;
  children: (data: T) => ReactNode;
  errorTitle?: string;
};

/** Renders loading / error / data for a TanStack query in one place. */
export function QueryBoundary<T>({query, loading, children, errorTitle}: QueryBoundaryProps<T>) {
  if (query.isPending) return <>{loading}</>;
  if (query.error || query.data === undefined) {
    return <QueryError error={query.error} title={errorTitle} onRetry={() => query.refetch()} />;
  }
  return <>{children(query.data)}</>;
}
