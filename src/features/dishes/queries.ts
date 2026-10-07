import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {dishesApi} from './api';
import type {Dish, DishInput} from './types';

export const dishKeys = {
  all: ['dishes'] as const,
  list: () => [...dishKeys.all, 'list'] as const,
};

export function useDishes() {
  return useQuery({
    queryKey: dishKeys.list(),
    queryFn: ({signal}) => dishesApi.list(signal),
  });
}

export function useCreateDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DishInput) => dishesApi.create(input),
    onSuccess: (dish) => {
      queryClient.setQueryData<Dish[]>(dishKeys.list(), (current = []) => [dish, ...current]);
    },
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, input}: {id: string; input: DishInput}) => dishesApi.update(id, input),
    onSuccess: (dish) => {
      queryClient.setQueryData<Dish[]>(dishKeys.list(), (current = []) =>
        current.map((item) => (item.id === dish.id ? dish : item)),
      );
    },
  });
}

/** Optimistic: the row disappears immediately and comes back on failure. */
export function useDeleteDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dishesApi.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({queryKey: dishKeys.list()});
      const previous = queryClient.getQueryData<Dish[]>(dishKeys.list());
      queryClient.setQueryData<Dish[]>(dishKeys.list(), (current = []) =>
        current.filter((dish) => dish.id !== id),
      );
      return {previous};
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(dishKeys.list(), context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({queryKey: dishKeys.list()}),
  });
}

export function useRandomDish() {
  return useMutation({
    mutationFn: (excludeId?: string) => dishesApi.random(excludeId),
  });
}
