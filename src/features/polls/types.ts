/** `vote`: members vote ("Biểu quyết"); `luck`: pure random ("Nhân phẩm"). */
export type PollMode = 'vote' | 'luck';

export type PollSettings = {
  /** Pick a result automatically when the poll ends. */
  autoPick: boolean;
  mode: PollMode;
  durationMinutes: number;
};

export type PollEntry = {
  id: string;
  memberName: string;
  dishName: string;
  restaurant: string | null;
  imageUrl: string | null;
};

export type Poll = {
  id: string;
  /** Public join code shown as "ID" and used in the share link. */
  code: string;
  name: string;
  imageUrl: string | null;
  settings: PollSettings;
  entries: PollEntry[];
};

export type UpdatePollInput = {
  name?: string;
  settings?: Partial<PollSettings>;
};

export type UpdatePollEntryInput = {
  dishName: string;
  restaurant?: string;
};

export type RandomPollResult = {
  entryId: string;
};
