import {isAxiosError} from 'axios';

/** Error envelope every backend error response is expected to follow. */
export type ApiErrorBody = {
  code: string;
  message: string;
  /** Field-level validation errors, keyed by request field name. */
  fieldErrors?: Record<string, string>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code;
    this.fieldErrors = body.fieldErrors;
  }
}

const FALLBACK_MESSAGE = 'Có lỗi xảy ra, bro thử lại sau nhé.';
const NETWORK_MESSAGE = 'Không kết nối được máy chủ. Kiểm tra mạng giúp mình nha.';

function isErrorBody(data: unknown): data is ApiErrorBody {
  return (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof (data as {message: unknown}).message === 'string'
  );
}

/** Normalises axios/network/unknown failures into a single ApiError shape. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    if (!error.response) {
      return new ApiError(0, {code: 'NETWORK_ERROR', message: NETWORK_MESSAGE});
    }
    const {status, data} = error.response;
    if (isErrorBody(data)) {
      return new ApiError(status, {...data, code: data.code ?? 'UNKNOWN'});
    }
    return new ApiError(status, {code: 'UNKNOWN', message: FALLBACK_MESSAGE});
  }

  return new ApiError(0, {code: 'UNKNOWN', message: FALLBACK_MESSAGE});
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
