import {z} from 'zod';

export const MAX_IMAGE_BYTES = 1024 * 1024;

const optionalText = (max: number) => z.string().trim().max(max, `Tối đa ${max} ký tự.`).optional();

const optionalImage = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_IMAGE_BYTES, 'Ảnh tối đa 1MB thôi bro.')
  .refine((file) => file.type.startsWith('image/'), 'Chỉ nhận file ảnh.')
  .nullable()
  .optional();

export const dishFormSchema = z.object({
  name: z.string().trim().min(1, 'Nhập tên món ăn nhé.').max(80, 'Tối đa 80 ký tự.'),
  restaurant: optionalText(80),
  location: optionalText(80),
  description: optionalText(300),
  menuImage: optionalImage,
  qrImage: optionalImage,
});

export type DishFormValues = z.infer<typeof dishFormSchema>;
