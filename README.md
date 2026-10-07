# MenuTrua FE

SPA "Trưa nay ăn gì?": quay món ngẫu nhiên, quản lý hộp món cá nhân, bình chọn bữa trưa theo nhóm.

**Stack:** React 19 · Vite 8 · TypeScript 7 · React Router 8 (data router, lazy routes) · TanStack Query 5 · Axios · Zustand · React Hook Form + Zod · Astryx design system · MSW 3 (mock API) · Bun · nginx.

## Chạy nhanh

```bash
bun install
bun run dev            # http://localhost:5173 — mock API bật sẵn
```

Tài khoản demo (mock): `demo` / `menutrua123`. Muốn xoá dữ liệu mock thì gõ `resetMockDb()` trong console.

| Script | Việc |
| --- | --- |
| `bun run dev` | Dev server (`.env.development`) |
| `bun run build` | Typecheck + build production (`.env.production`) |
| `bun run build:dev` | Build bằng env development (có mock API) |
| `bun run preview` | Xem thử bản build |
| `bun run typecheck` / `lint` / `format` | tsc · oxlint · prettier |
| `bun run theme:build` | Build lại theme Astryx sau khi sửa `menutruaTheme.ts` |

## Cấu trúc

```
src/
├─ app/                  # Khung ứng dụng: providers, router, guards, layout gốc
│  ├─ AppProviders.tsx   #   Theme · i18n (vi-VN) · QueryClient · LinkProvider
│  └─ router/            #   routes (lazy), paths, RequireAuth/GuestOnly, error page
├─ components/           # UI dùng chung, không phụ thuộc domain
│  ├─ form/              #   Form* = Astryx input gắn react-hook-form, FormDialog
│  ├─ layout/            #   SiteHeader, SiteFooter, PublicLayout, AppLayout, PageSection
│  ├─ roulette/          #   useRoulette (state machine) + RouletteStrip/Tile
│  ├─ list/ media/ feedback/ brand/ icons/ typography/ navigation/
├─ features/             # Mỗi feature tự chứa: types · api · queries · schemas · components · pages
│  ├─ auth/              #   Đăng nhập / đăng ký
│  ├─ landing/           #   Trang chủ
│  ├─ dishes/            #   Tự chọn món (hộp món + vòng quay + kết quả)
│  ├─ polls/             #   Bình chọn nhóm
│  └─ bot/               #   Placeholder BOT gợi ý
├─ lib/
│  ├─ http/              # Axios client, endpoints, chuẩn hoá lỗi ApiError
│  ├─ auth/              # Session store, token storage, refresh, scheduler
│  └─ query/             # QueryClient
├─ mocks/                # MSW: db giả (localStorage), JWT giả, handlers
├─ config/env.ts         # Đọc + validate biến môi trường
├─ hooks/ styles/ themes/ assets/
```

Nguyên tắc: feature chỉ gọi API qua `lib/http/client` (oxlint chặn `import axios` ngoài `lib/`). Đường dẫn API nằm hết trong `lib/http/endpoints.ts`, mock dùng chung map này.

## API & mock

- `VITE_ENABLE_MOCK=true`: MSW chặn mọi request `/api/*` trong trình duyệt. Code gọi API giữ nguyên, khi có BE thật chỉ cần đặt `VITE_ENABLE_MOCK=false` và trỏ `VITE_API_BASE_URL` (hoặc proxy).
- Ở build production, MSW và `mockServiceWorker.js` bị loại khỏi bundle.
- Contract cho BE: xem `src/mocks/handlers/*` (request/response mẫu) và các file `features/*/types.ts`.

| Method | Path | Ghi chú |
| --- | --- | --- |
| POST | `/auth/login` `/auth/register` | → `AuthSession` |
| POST | `/auth/refresh` | Rotate refresh token → `AuthSession` |
| POST | `/auth/logout` | Thu hồi refresh token |
| GET | `/auth/me` | User hiện tại |
| GET | `/public/categories` `/public/featured-dishes` `/public/suggestion` `/public/poll-preview` | Landing |
| GET/POST | `/dishes` | POST dạng `multipart/form-data` (ảnh menu, QR ≤ 1MB) |
| PATCH/DELETE | `/dishes/:id` | |
| POST | `/dishes/random` | `{excludeId?}` → `{dishId}` (server chọn) |
| GET | `/polls/current` | |
| PATCH | `/polls/:id` | Tên + settings |
| PATCH/DELETE | `/polls/:id/entries/:entryId` | |
| POST | `/polls/:id/random` | → `{entryId}` |

Lỗi trả về theo dạng `{code, message, fieldErrors?}`; `fieldErrors` sẽ tự gắn vào đúng field trên form.

## Bảo mật: access + refresh token

- **Access token** (JWT ngắn hạn) chỉ nằm trong **memory** (Zustand store), không lưu storage.
- **Refresh token** có 2 chiến lược (`VITE_AUTH_REFRESH_STRATEGY`):
  - `cookie` (**khuyến nghị cho production**): BE set cookie `httpOnly; Secure; SameSite=Strict; Path=/api/auth`. JS không đọc được token.
  - `body`: FE lưu refresh token (localStorage nếu "Ghi nhớ đăng nhập", ngược lại sessionStorage) và gửi trong body. Mặc định cho dev/mock.
- **Auto refresh:**
  1. Chủ động: hẹn giờ refresh trước khi hết hạn `VITE_AUTH_REFRESH_LEEWAY` giây; kiểm tra lại khi tab được focus.
  2. Trước mỗi request: token sắp hết hạn thì refresh trước rồi mới gửi.
  3. Gặp 401: refresh **một lần** rồi replay request. Các request song song dùng chung một lần refresh (single-flight).
  4. Nhiều tab: `navigator.locks` tuần tự hoá việc refresh để không tái sử dụng token đã rotate; `BroadcastChannel` đồng bộ đăng nhập/đăng xuất giữa các tab.
  5. Refresh bị từ chối (400/401/403): xoá session, báo toast, chuyển về `/login?redirect=…`. Lỗi mạng thì không đăng xuất.
- Mở lại trang: session được khôi phục bằng một lần refresh âm thầm. Các route cần đăng nhập chờ kết quả rồi mới render.
- Mock có **refresh token rotation + phát hiện tái sử dụng**: dùng lại token cũ sẽ thu hồi mọi phiên của user đó. Access token mock sống 60s để dễ quan sát auto refresh.
- `?redirect=` chỉ chấp nhận đường dẫn nội bộ (chống open redirect). nginx gửi kèm CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`.

## Môi trường

| File | Dùng khi | Điểm chính |
| --- | --- | --- |
| `.env.development` | `bun run dev`, `build:dev` | Mock bật, refresh dạng `body`, access TTL 60s |
| `.env.production` | `bun run build` | Mock tắt, refresh dạng `cookie`, `/api` cùng origin |
| `.env.example` | Mẫu cho `.env.local` (không commit) | |

Chỉ biến có tiền tố `VITE_` được đưa vào bundle, nên **không bao giờ đặt secret** ở đây.

## Docker

Dockerfile multi-stage: `oven/bun` (cài deps, `--frozen-lockfile`) → `oven/bun` (typecheck + build) → `nginx-unprivileged` (non-root, cổng 8080).

```bash
# production
docker build -t menutrua-fe .
docker run --rm -p 8080:8080 -e API_UPSTREAM=http://my-backend:8080 menutrua-fe

# development (mock API, không cần backend)
docker build -t menutrua-fe:dev --build-arg APP_ENV=development .
docker run --rm -p 8081:8080 menutrua-fe:dev

# hoặc
docker compose up --build web       # :8080
docker compose up --build web-dev   # :8081
```

nginx (`docker/nginx/`):
- SPA fallback: `try_files … /index.html`. Thiếu file trong `/assets` thì trả 404 thật, không fallback.
- `/assets/*` cache 1 năm (immutable); `index.html` luôn `no-cache`.
- `/api/*` proxy tới `API_UPSTREAM`, resolve DNS lúc có request nên nginx vẫn khởi động được khi backend chưa lên.
- gzip, security headers, `/healthz` cho healthcheck. Chặn dotfile và `.map`.

## Theme

Màu thương hiệu (#F25C05, nền ivory, chữ nâu…) nằm trong `src/themes/menutrua/menutruaTheme.ts`. Sửa xong thì chạy `bun run theme:build`. Component không dùng hex/px thô, chỉ dùng token `var(--color-*)`, `var(--spacing-*)`, `var(--radius-*)`.
