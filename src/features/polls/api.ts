import {http} from '@/lib/http/client';
import {endpoints} from '@/lib/http/endpoints';
import type {
  Poll,
  PollEntry,
  RandomPollResult,
  UpdatePollEntryInput,
  UpdatePollInput,
} from './types';

export const pollsApi = {
  current: (signal?: AbortSignal) =>
    http.get<Poll>(endpoints.polls.current, {signal}).then((res) => res.data),

  update: (id: string, input: UpdatePollInput) =>
    http.patch<Poll>(endpoints.polls.detail(id), input).then((res) => res.data),

  updateEntry: (id: string, entryId: string, input: UpdatePollEntryInput) =>
    http.patch<PollEntry>(endpoints.polls.entry(id, entryId), input).then((res) => res.data),

  removeEntry: (id: string, entryId: string) =>
    http.delete<void>(endpoints.polls.entry(id, entryId)),

  random: (id: string) =>
    http.post<RandomPollResult>(endpoints.polls.random(id)).then((res) => res.data),
};
