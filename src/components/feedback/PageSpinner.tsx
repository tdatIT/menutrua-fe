import {Center} from '@astryxdesign/core/Center';
import {Spinner} from '@astryxdesign/core/Spinner';

export function PageSpinner({label = 'Đang tải…'}: {label?: string}) {
  return (
    <Center minHeight="60dvh" width="100%">
      <Spinner size="xl" label={label} />
    </Center>
  );
}
