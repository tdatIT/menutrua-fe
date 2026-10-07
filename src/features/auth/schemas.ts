import {z} from 'zod';

const username = z
  .string()
  .trim()
  .min(3, 'Tên đăng nhập cần ít nhất 3 ký tự.')
  .max(32, 'Tên đăng nhập tối đa 32 ký tự.')
  .regex(/^[a-zA-Z0-9._-]+$/, 'Chỉ dùng chữ, số, dấu chấm, gạch dưới hoặc gạch ngang.');

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Nhập tên đăng nhập nhé.'),
  password: z.string().min(1, 'Nhập mật khẩu nhé.'),
  remember: z.boolean(),
});

export const registerSchema = z
  .object({
    username,
    password: z.string().min(8, 'Mật khẩu cần ít nhất 8 ký tự.'),
    confirmPassword: z.string().min(1, 'Nhập lại mật khẩu nhé.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhập lại chưa khớp.',
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
