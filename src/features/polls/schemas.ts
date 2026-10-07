import {z} from 'zod';

export const pollNameSchema = z.object({
  name: z.string().trim().min(1, 'Tên nhóm không được để trống.').max(60, 'Tối đa 60 ký tự.'),
});

export const pollEntrySchema = z.object({
  dishName: z.string().trim().min(1, 'Nhập tên món ăn nhé.').max(80, 'Tối đa 80 ký tự.'),
  restaurant: z.string().trim().max(80, 'Tối đa 80 ký tự.').optional(),
});

export type PollNameValues = z.infer<typeof pollNameSchema>;
export type PollEntryValues = z.infer<typeof pollEntrySchema>;

export const POLL_MODE_OPTIONS = [
  {value: 'vote', label: 'Biểu quyết', description: 'Cả nhóm cùng vote'},
  {value: 'luck', label: 'Nhân phẩm', description: 'Quay ngẫu nhiên'},
];

export const POLL_DURATION_OPTIONS = [5, 10, 15, 30, 60].map((minutes) => ({
  value: String(minutes),
  label: `${minutes} phút`,
}));
