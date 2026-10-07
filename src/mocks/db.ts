import type {Dish} from '@/features/dishes/types';
import type {Poll} from '@/features/polls/types';
import {guessDishImage, mockImages} from './data/images';

/**
 * In-browser fake database for the mock backend. Persisted to localStorage
 * so data survives reloads; wipe it with `resetMockDb()` from the console.
 */

export type MockUser = {
  id: string;
  username: string;
  /** Plain text on purpose — this is a mock. A real BE hashes with argon2/bcrypt. */
  password: string;
  displayName: string;
};

export type MockRefreshToken = {
  userId: string;
  expiresAt: number;
  revoked: boolean;
};

type MockDb = {
  users: MockUser[];
  refreshTokens: Record<string, MockRefreshToken>;
  dishes: Record<string, Dish[]>;
  polls: Record<string, Poll>;
};

const STORAGE_KEY = 'menutrua.mock-db.v1';

export const newId = () => crypto.randomUUID();

function seedDishes(): Dish[] {
  const rows: Array<[string, string, string]> = [
    ['Cơm Tấm Sườn Bì Chả', 'Cơm Tấm Ba Cường', 'Q. Bình Thạnh'],
    ['Hủ Tiếu Nam Vang', 'Hủ Tiếu Nhân Quán', 'Q. 1'],
    ['Phở Bò Tái Nạm', 'Phở Phú Vương', 'Q. 3'],
    ['Bún Chả Hà Nội', 'Bún Chả Sinh Từ', 'Q. Tân Bình'],
    ['Bánh Mì Thịt Nướng', 'Bánh Mì Hồng Hoa', 'Q. 1'],
  ];
  return rows.map(([name, restaurant, location], index) => ({
    id: newId(),
    name,
    restaurant,
    location,
    description: index === 0 ? 'Sườn nướng mật ong ngọt lịm, trứng lòng đào béo ngậy.' : null,
    imageUrl: guessDishImage(name),
    menuImageUrl: null,
    qrImageUrl: null,
    createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
  }));
}

function seedPoll(ownerName: string): Poll {
  const members = ['Nguyễn Văn A', 'Trần Văn C', 'Nguyễn Văn D', 'Lê Văn E', 'Huỳnh Văn F'];
  return {
    id: newId(),
    code: String(Math.floor(10_000_000 + Math.random() * 89_999_999)),
    name: `Nhóm ăn trưa của ${ownerName}`,
    imageUrl: mockImages.comTam,
    settings: {autoPick: true, mode: 'vote', durationMinutes: 15},
    entries: seedDishes().map((dish, index) => ({
      id: newId(),
      memberName: members[index],
      dishName: dish.name,
      restaurant: dish.restaurant,
      imageUrl: dish.imageUrl,
    })),
  };
}

export function seedUserData(db: MockDb, user: MockUser) {
  db.dishes[user.id] = seedDishes();
  db.polls[user.id] = seedPoll(user.displayName);
}

function createSeed(): MockDb {
  const demo: MockUser = {
    id: newId(),
    username: 'demo',
    password: 'menutrua123',
    displayName: 'Đạt',
  };
  const db: MockDb = {users: [demo], refreshTokens: {}, dishes: {}, polls: {}};
  seedUserData(db, demo);
  return db;
}

function load(): MockDb {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MockDb;
  } catch {
    // Corrupt or unavailable storage: fall back to a fresh seed.
  }
  return createSeed();
}

export const db: MockDb = load();

export function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Quota exceeded (large images): keep working in memory only.
  }
}

export function resetMockDb() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
