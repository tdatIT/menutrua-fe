import type {RouletteItem} from '@/components/roulette/useRoulette';
import type {Dish} from './types';

/** "Cơm Tấm Ba Cường • Q. Bình Thạnh" */
export function formatDishSubtitle(dish: Pick<Dish, 'restaurant' | 'location'>): string {
  return [dish.restaurant, dish.location].filter(Boolean).join(' • ');
}

export function toRouletteItem(dish: Dish): RouletteItem {
  return {
    id: dish.id,
    title: dish.name,
    subtitle: dish.restaurant,
    imageUrl: dish.imageUrl,
  };
}
