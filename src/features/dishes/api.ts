import {http} from '@/lib/http/client';
import {endpoints} from '@/lib/http/endpoints';
import type {Dish, DishInput, RandomDishResult} from './types';

function toFormData(input: DishInput): FormData {
  const form = new FormData();
  form.append('name', input.name);
  form.append('restaurant', input.restaurant ?? '');
  form.append('location', input.location ?? '');
  form.append('description', input.description ?? '');
  if (input.menuImage) form.append('menuImage', input.menuImage);
  if (input.qrImage) form.append('qrImage', input.qrImage);
  return form;
}

export const dishesApi = {
  list: (signal?: AbortSignal) =>
    http.get<Dish[]>(endpoints.dishes.list, {signal}).then((res) => res.data),

  create: (input: DishInput) =>
    http.post<Dish>(endpoints.dishes.list, toFormData(input)).then((res) => res.data),

  update: (id: string, input: DishInput) =>
    http.patch<Dish>(endpoints.dishes.detail(id), toFormData(input)).then((res) => res.data),

  remove: (id: string) => http.delete<void>(endpoints.dishes.detail(id)),

  /** The server decides the winner so picks can be logged/audited later. */
  random: (excludeId?: string) =>
    http.post<RandomDishResult>(endpoints.dishes.random, {excludeId}).then((res) => res.data),
};
