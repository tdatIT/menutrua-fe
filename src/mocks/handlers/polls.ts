import {http, HttpResponse} from 'msw';
import type {UpdatePollEntryInput, UpdatePollInput} from '@/features/polls/types';
import {endpoints} from '@/lib/http/endpoints';
import {guessDishImage} from '../data/images';
import {db, persist} from '../db';
import {api, authenticate, errorResponse, latency, pickRandom} from '../utils';

function findPoll(userId: string, pollId: unknown) {
  const poll = db.polls[userId];
  return poll && poll.id === pollId ? poll : null;
}

export const pollHandlers = [
  http.get(api(endpoints.polls.current), async ({request}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;
    const poll = db.polls[user.id];
    if (!poll) return errorResponse(404, 'NOT_FOUND', 'Chưa có nhóm bình chọn.');
    return HttpResponse.json(poll);
  }),

  http.patch(api(endpoints.polls.detail(':id')), async ({request, params}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;
    const poll = findPoll(user.id, params.id);
    if (!poll) return errorResponse(404, 'NOT_FOUND', 'Không tìm thấy nhóm.');

    const input = (await request.json()) as UpdatePollInput;
    if (input.name !== undefined) {
      if (!input.name.trim()) {
        return errorResponse(422, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ.', {
          name: 'Tên nhóm không được để trống.',
        });
      }
      poll.name = input.name.trim();
    }
    if (input.settings) poll.settings = {...poll.settings, ...input.settings};
    persist();
    return HttpResponse.json(poll);
  }),

  http.patch(api(endpoints.polls.entry(':id', ':entryId')), async ({request, params}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;
    const entry = findPoll(user.id, params.id)?.entries.find((item) => item.id === params.entryId);
    if (!entry) return errorResponse(404, 'NOT_FOUND', 'Không tìm thấy món này.');

    const input = (await request.json()) as UpdatePollEntryInput;
    if (!input.dishName?.trim()) {
      return errorResponse(422, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ.', {
        dishName: 'Nhập tên món ăn nhé.',
      });
    }
    entry.dishName = input.dishName.trim();
    entry.restaurant = input.restaurant?.trim() || null;
    entry.imageUrl = guessDishImage(entry.dishName);
    persist();
    return HttpResponse.json(entry);
  }),

  http.delete(api(endpoints.polls.entry(':id', ':entryId')), async ({request, params}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;
    const poll = findPoll(user.id, params.id);
    if (!poll) return errorResponse(404, 'NOT_FOUND', 'Không tìm thấy nhóm.');
    poll.entries = poll.entries.filter((entry) => entry.id !== params.entryId);
    persist();
    return new HttpResponse(null, {status: 204});
  }),

  http.post(api(endpoints.polls.random(':id')), async ({request, params}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;
    const poll = findPoll(user.id, params.id);
    if (!poll || poll.entries.length === 0) {
      return errorResponse(409, 'EMPTY_POLL', 'Nhóm chưa có món nào để quay.');
    }
    return HttpResponse.json({entryId: pickRandom(poll.entries).id});
  }),
];
