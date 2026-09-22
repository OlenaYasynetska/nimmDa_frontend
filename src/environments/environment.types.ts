/**
 * Shared environment shape (dev + production build).
 */
export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  /** GA4 stream ID (`G-…`). Empty string turns the tag off. */
  gaMeasurementId: string;
}
