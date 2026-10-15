/**
 * Shared environment shape (dev + production build).
 */
export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  /** GA4 stream ID (`G-…`). Empty string turns the tag off. */
  gaMeasurementId: string;
  /** AdSense publisher id (`ca-pub-…`). Empty string turns display ads off. */
  adsenseClient: string;
  /** AdSense display-ad slot id. Empty string turns display ads off. */
  adsenseSlot: string;
}
