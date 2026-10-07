import {http, HttpResponse} from 'msw';
import type {Dish} from '@/features/dishes/types';
import {endpoints} from '@/lib/http/endpoints';
import {guessDishImage} from '../data/images';
import {db, newId, persist} from '../db';
import {api, authenticate, errorResponse, fileToDataUrl, latency, pickRandom} from '../utils';

const MAX_IMAGE_BYTES = 1024 * 1024;

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

async function image(form: FormData, key: string): Promise<string | null | undefined> {
  const value = form.get(key);
  if (!(value instanceof File) || value.size === 0) return undefined;
  if (value.size > MAX_IMAGE_BYTES) return null;
  return fileToDataUrl(value);
}

export const dishHandlers = [
  http.get(api(endpoints.dishes.list), async ({request}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;
    return HttpResponse.json(db.dishes[user.id] ?? []);
  }),

  http.post(api(endpoints.dishes.list), async ({request}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;

    const form = await request.formData();
    const name = text(form, 'name');
    if (!name) {
      return errorResponse(422, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ.', {
        name: 'Nhập tên món ăn nhé.',
      });
    }
    const [menuImageUrl, qrImageUrl] = await Promise.all([
      image(form, 'menuImage'),
      image(form, 'qrImage'),
    ]);
    if (menuImageUrl === null || qrImageUrl === null) {
      return errorResponse(413, 'FILE_TOO_LARGE', 'Ảnh tối đa 1MB thôi bro.');
    }

    const dish: Dish = {
      id: newId(),
      name,
      restaurant: text(form, 'restaurant'),
      location: text(form, 'location'),
      description: text(form, 'description'),
      imageUrl: guessDishImage(name),
      menuImageUrl: menuImageUrl ?? null,
      qrImageUrl: qrImageUrl ?? null,
      createdAt: new Date().toISOString(),
    };
    db.dishes[user.id] = [dish, ...(db.dishes[user.id] ?? [])];
    persist();
    return HttpResponse.json(dish, {status: 201});
  }),

  http.patch(api(endpoints.dishes.detail(':id')), async ({request, params}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;

    const dish = db.dishes[user.id]?.find((item) => item.id === params.id);
    if (!dish) return errorResponse(404, 'NOT_FOUND', 'Không tìm thấy món này.');

    const form = await request.formData();
    const name = text(form, 'name');
    if (!name) {
      return errorResponse(422, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ.', {
        name: 'Nhập tên món ăn nhé.',
      });
    }
    const [menuImageUrl, qrImageUrl] = await Promise.all([
      image(form, 'menuImage'),
      image(form, 'qrImage'),
    ]);
    if (menuImageUrl === null || qrImageUrl === null) {
      return errorResponse(413, 'FILE_TOO_LARGE', 'Ảnh tối đa 1MB thôi bro.');
    }

    Object.assign(dish, {
      name,
      restaurant: text(form, 'restaurant'),
      location: text(form, 'location'),
      description: text(form, 'description'),
      imageUrl: dish.name === name ? dish.imageUrl : guessDishImage(name),
      menuImageUrl: menuImageUrl ?? dish.menuImageUrl,
      qrImageUrl: qrImageUrl ?? dish.qrImageUrl,
    });
    persist();
    return HttpResponse.json(dish);
  }),

  http.delete(api(endpoints.dishes.detail(':id')), async ({request, params}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;

    const dishes = db.dishes[user.id] ?? [];
    if (!dishes.some((dish) => dish.id === params.id)) {
      return errorResponse(404, 'NOT_FOUND', 'Không tìm thấy món này.');
    }
    db.dishes[user.id] = dishes.filter((dish) => dish.id !== params.id);
    persist();
    return new HttpResponse(null, {status: 204});
  }),

  http.post(api(endpoints.dishes.random), async ({request}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;

    const {excludeId} = ((await request.json().catch(() => null)) ?? {}) as {
      excludeId?: string;
    };
    const dishes = db.dishes[user.id] ?? [];
    if (dishes.length === 0) {
      return errorResponse(409, 'EMPTY_MENU', 'Thêm ít nhất 1 món để quay nhé.');
    }
    const pool = dishes.length > 1 ? dishes.filter((dish) => dish.id !== excludeId) : dishes;
    return HttpResponse.json({dishId: pickRandom(pool).id});
  }),
];
