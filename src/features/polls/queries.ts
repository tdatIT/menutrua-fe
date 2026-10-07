import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {pollsApi} from './api';
import type {Poll, UpdatePollEntryInput, UpdatePollInput} from './types';

export const pollKeys = {
  all: ['polls'] as const,
  current: () => [...pollKeys.all, 'current'] as const,
};

export function useCurrentPoll() {
  return useQuery({
    queryKey: pollKeys.current(),
    queryFn: ({signal}) => pollsApi.current(signal),
  });
}

/** Optimistic settings/name update, rolled back on error. */
export function useUpdatePoll(pollId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePollInput) => pollsApi.update(pollId, input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({queryKey: pollKeys.current()});
      const previous = queryClient.getQueryData<Poll>(pollKeys.current());
      if (previous) {
        queryClient.setQueryData<Poll>(pollKeys.current(), {
          ...previous,
          name: input.name ?? previous.name,
          settings: {...previous.settings, ...input.settings},
        });
      }
      return {previous};
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(pollKeys.current(), context?.previous);
    },
    onSuccess: (poll) => queryClient.setQueryData(pollKeys.current(), poll),
  });
}

export function useUpdatePollEntry(pollId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({entryId, input}: {entryId: string; input: UpdatePollEntryInput}) =>
      pollsApi.updateEntry(pollId, entryId, input),
    onSuccess: (entry) => {
      queryClient.setQueryData<Poll>(
        pollKeys.current(),
        (poll) =>
          poll && {
            ...poll,
            entries: poll.entries.map((item) => (item.id === entry.id ? entry : item)),
          },
      );
    },
  });
}

export function useRemovePollEntry(pollId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => pollsApi.removeEntry(pollId, entryId),
    onMutate: async (entryId) => {
      await queryClient.cancelQueries({queryKey: pollKeys.current()});
      const previous = queryClient.getQueryData<Poll>(pollKeys.current());
      if (previous) {
        queryClient.setQueryData<Poll>(pollKeys.current(), {
          ...previous,
          entries: previous.entries.filter((entry) => entry.id !== entryId),
        });
      }
      return {previous};
    },
    onError: (_error, _entryId, context) => {
      queryClient.setQueryData(pollKeys.current(), context?.previous);
    },
  });
}

export function useRandomPollEntry(pollId: string) {
  return useMutation({mutationFn: () => pollsApi.random(pollId)});
}
