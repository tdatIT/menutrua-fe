import {AlertDialog} from '@astryxdesign/core/AlertDialog';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  actionLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Destructive confirmation ("Xóa món này?"). */
export function ConfirmDialog({
  isOpen,
  title,
  description,
  actionLabel = 'Xóa',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      title={title}
      description={description}
      actionLabel={actionLabel}
      cancelLabel="Hủy"
      isActionLoading={isPending}
      onAction={onConfirm}
    />
  );
}
