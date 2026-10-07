import {useQuery} from '@tanstack/react-query';
import {http} from '@/lib/http/client';
import {endpoints} from '@/lib/http/endpoints';
import type {DailySuggestion, FeaturedDish, FoodCategory, PollPreview} from './types';

const get = <T>(url: string, signal?: AbortSignal) =>
  http.get<T>(url, {signal}).then((res) => res.data);

export const landingKeys = {
  all: ['landing'] as const,
  categories: () => [...landingKeys.all, 'categories'] as const,
  featured: () => [...landingKeys.all, 'featured'] as const,
  suggestion: () => [...landingKeys.all, 'suggestion'] as const,
  pollPreview: () => [...landingKeys.all, 'poll-preview'] as const,
};

/** Public marketing content changes rarely: cache it for the session. */
const staleTime = 5 * 60_000;

export const useFoodCategories = () =>
  useQuery({
    queryKey: landingKeys.categories(),
    queryFn: ({signal}) => get<FoodCategory[]>(endpoints.public.categories, signal),
    staleTime,
  });

export const useFeaturedDishes = () =>
  useQuery({
    queryKey: landingKeys.featured(),
    queryFn: ({signal}) => get<FeaturedDish[]>(endpoints.public.featuredDishes, signal),
    staleTime,
  });

export const useDailySuggestion = () =>
  useQuery({
    queryKey: landingKeys.suggestion(),
    queryFn: ({signal}) => get<DailySuggestion>(endpoints.public.suggestion, signal),
    staleTime,
  });

export const usePollPreview = () =>
  useQuery({
    queryKey: landingKeys.pollPreview(),
    queryFn: ({signal}) => get<PollPreview>(endpoints.public.pollPreview, signal),
    staleTime,
  });
