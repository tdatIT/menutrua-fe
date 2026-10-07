import type {FieldPath, FieldValues, UseFormSetError} from 'react-hook-form';
import {toApiError} from '@/lib/http/api-error';

/**
 * Maps backend field errors (ApiError.fieldErrors) onto form fields.
 * Returns the message for a form-level banner when nothing matched a field.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly FieldPath<T>[],
): string | null {
  const apiError = toApiError(error);
  let matched = false;
  for (const [field, message] of Object.entries(apiError.fieldErrors ?? {})) {
    if ((fields as readonly string[]).includes(field)) {
      setError(field as FieldPath<T>, {type: 'server', message});
      matched = true;
    }
  }
  return matched ? null : apiError.message;
}
