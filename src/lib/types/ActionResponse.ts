/**
 * @deprecated This export is maintained for backward compatibility.
 * Use the global ActionResponse<T> type instead, which includes optional data field.
 *
 * Migration example:
 * ```ts
 * // Old:
 * import { ActionResponse } from '@/lib/types/ActionResponse';
 *
 * // New (no import needed):
 * const response: ActionResponse<User> = {
 *   success: true,
 *   data: user
 * };
 * ```
 */
export type ActionResponse<T = unknown> = globalThis.ActionResponse<T>;
