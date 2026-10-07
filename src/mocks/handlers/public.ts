import {http, HttpResponse} from 'msw';
import type {
  DailySuggestion,
  FeaturedDish,
  FoodCategory,
  PollPreview,
} from '@/features/landing/types';
import {endpoints} from '@/lib/http/endpoints';
import {mockImages} from '../data/images';
import {api, latency, pickRandom} from '../utils';

const categories: FoodCategory[] = [
  {id: 'com', name: 'Cơm', tagline: 'Thơm dẻo chắc bụng', imageUrl: mockImages.categories.com},
  {
    id: 'hu-tieu',
    name: 'Hủ Tiếu',
    tagline: 'Nước dùng thanh ngọt',
    imageUrl: mockImages.categories.huTieu,
  },
  {id: 'pho', name: 'Phở', tagline: 'Quốc hồn quốc túy', imageUrl: mockImages.categories.pho},
  {id: 'bun', name: 'Bún', tagline: 'Tươi mát đậm đà', imageUrl: mockImages.categories.bun},
  {
    id: 'banh-mi',
    name: 'Bánh Mì',
    tagline: 'Nhanh gọn giòn rụm',
    imageUrl: mockImages.categories.banhMi,
  },
];

const featured: FeaturedDish[] = [
  {
    id: 'pho-bo-goc-ha-noi',
    name: 'Phở Bò Gốc Hà Nội',
    priceFrom: 45_000,
    description:
      'Nước dùng xương hầm 12 tiếng thanh ngọt tự nhiên, hòa quyện cùng bánh phở mềm dẻo và thịt bò tươi ngon mọng nước.',
    imageUrl: mockImages.phoBo,
  },
  {
    id: 'banh-mi-thit-nuong',
    name: 'Bánh Mì Thịt Nướng Đặc Biệt',
    priceFrom: 25_000,
    description:
      'Vỏ bánh mì nướng giòn rụm kết hợp hoàn hảo cùng nhân thịt nướng thơm nồng xốt gia truyền đậm đà ngon tuyệt đỉnh.',
    imageUrl: mockImages.banhMi,
  },
];

const suggestions = [
  'Cơm Tấm Sườn Bì Chả',
  'Bún Bò Huế',
  'Phở Bò Tái Nạm',
  'Hủ Tiếu Nam Vang',
  'Bánh Mì Thịt Nướng',
  'Bún Chả Hà Nội',
];

const pollPreview: PollPreview = {
  title: 'Bình chọn bữa trưa team "Design"',
  options: [
    {label: 'Cơm gà xối mỡ', votes: 8},
    {label: 'Bún chả Obama', votes: 5},
  ],
  endsInMinutes: 5,
  participants: [{name: 'Linh'}, {name: 'Minh'}, {name: 'Hà'}],
};

export const publicHandlers = [
  http.get(api(endpoints.public.categories), async () => {
    await latency();
    return HttpResponse.json(categories);
  }),
  http.get(api(endpoints.public.featuredDishes), async () => {
    await latency();
    return HttpResponse.json(featured);
  }),
  http.get(api(endpoints.public.suggestion), async () => {
    await latency();
    return HttpResponse.json({dishName: pickRandom(suggestions)} satisfies DailySuggestion);
  }),
  http.get(api(endpoints.public.pollPreview), async () => {
    await latency();
    return HttpResponse.json(pollPreview);
  }),
];
