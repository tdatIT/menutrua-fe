import {useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Grid} from '@astryxdesign/core/Grid';
import {VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {FormDialog} from '@/components/form/FormDialog';
import {FormFileInput} from '@/components/form/FormFileInput';
import {FormTextArea} from '@/components/form/FormTextArea';
import {FormTextInput} from '@/components/form/FormTextInput';
import {applyServerErrors} from '@/components/form/server-errors';
import {useCreateDish, useUpdateDish} from '../queries';
import {dishFormSchema, MAX_IMAGE_BYTES, type DishFormValues} from '../schemas';
import type {Dish} from '../types';

type DishFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Present when editing. */
  dish?: Dish | null;
};

const toDefaults = (dish?: Dish | null): DishFormValues => ({
  name: dish?.name ?? '',
  restaurant: dish?.restaurant ?? '',
  location: dish?.location ?? '',
  description: dish?.description ?? '',
  menuImage: null,
  qrImage: null,
});

/**
 * Create/edit dish dialog. Mount it with a `key` per dish so the form
 * re-initialises instead of syncing defaults in an effect.
 */
export function DishFormDialog({isOpen, onClose, dish}: DishFormDialogProps) {
  const toast = useToast();
  const createDish = useCreateDish();
  const updateDish = useUpdateDish();
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = Boolean(dish);
  const isPending = createDish.isPending || updateDish.isPending;

  const {control, handleSubmit, setError} = useForm<DishFormValues>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: toDefaults(dish),
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    const callbacks = {
      onSuccess: () => {
        toast({body: isEditing ? 'Đã cập nhật món.' : 'Đã thêm món mới vào hộp!'});
        onClose();
      },
      onError: (error: unknown) =>
        setFormError(
          applyServerErrors(error, setError, ['name', 'restaurant', 'location', 'description']),
        ),
    };
    if (dish) updateDish.mutate({id: dish.id, input: values}, callbacks);
    else createDish.mutate(values, callbacks);
  });

  return (
    <FormDialog
      isOpen={isOpen}
      title={isEditing ? 'Sửa món ăn 🍜' : 'Thêm món ăn trưa mới 🍜'}
      submitLabel={isEditing ? 'Lưu thay đổi' : 'Lưu món mới'}
      isPending={isPending}
      onClose={onClose}
      onSubmit={onSubmit}
      width={580}
    >
      {formError && <Banner status="error" title={formError} collapsible={false} />}
      <FormTextInput
        control={control}
        name="name"
        label="Tên món ăn"
        placeholder="Cơm sườn đặc biệt"
        isRequired
        hasAutoFocus
      />
      <Grid columns={{minWidth: 200, max: 2}} gap={4}>
        <FormTextInput
          control={control}
          name="restaurant"
          label="Tên quán"
          placeholder="Cơm Tấm Nguyễn Văn Cừ"
        />
        <FormTextInput
          control={control}
          name="location"
          label="Vị trí"
          placeholder="Quận 5, TP. HCM"
          isOptional
        />
      </Grid>
      <FormTextArea
        control={control}
        name="description"
        label="Mô tả"
        placeholder="Sườn bì chả trứng ốp la, dưa leo cà chua ngọt…"
        rows={3}
        maxLength={300}
      />
      <VStack gap={2}>
        <Text type="label" weight="semibold">
          Mã QR chuyển tiền nhóm (Nhận order chuyển khoản)
        </Text>
        <Grid columns={{minWidth: 200, max: 2}} gap={3}>
          <FormFileInput
            control={control}
            name="menuImage"
            label="Tải ảnh menu quán"
            description={`Tối đa ${MAX_IMAGE_BYTES / 1024 / 1024}MB`}
            accept="image/*"
            mode="dropzone"
          />
          <FormFileInput
            control={control}
            name="qrImage"
            label="Tải ảnh QR ngân hàng"
            description="PNG, JPG"
            accept="image/*"
            mode="dropzone"
          />
        </Grid>
      </VStack>
    </FormDialog>
  );
}
