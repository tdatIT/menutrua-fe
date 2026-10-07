import type {ReactNode} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {HStack, VStack} from '@astryxdesign/core/Stack';

type FormDialogProps = {
  isOpen: boolean;
  title: string;
  submitLabel?: string;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (event?: React.BaseSyntheticEvent) => void;
  children: ReactNode;
  width?: number;
};

/** Small modal form shell: header, fields, Hủy / Lưu footer. */
export function FormDialog({
  isOpen,
  title,
  submitLabel = 'Lưu',
  isPending = false,
  onClose,
  onSubmit,
  children,
  width = 440,
}: FormDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={handleOpenChange} width={width} purpose="form">
      <DialogHeader title={title} onOpenChange={handleOpenChange} hasDivider={false} />
      <VStack as="form" gap={4} padding={5} onSubmit={onSubmit}>
        {children}
        <HStack justify="end" gap={3}>
          <Button label="Hủy" variant="ghost" onClick={onClose} isDisabled={isPending} />
          <Button type="submit" label={submitLabel} variant="primary" isLoading={isPending} />
        </HStack>
      </VStack>
    </Dialog>
  );
}
