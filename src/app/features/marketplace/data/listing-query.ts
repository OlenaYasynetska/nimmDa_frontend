import type { Params } from '@angular/router';

const FILTER_KEYS = ['q', 'ort', 'km', 'von', 'bis', 'sort', 'kat', 'kostenlos', 'price'] as const;

export function listingFilterQuery(params: Params): Record<string, string | null> {
  const query: Record<string, string | null> = {};
  for (const key of FILTER_KEYS) {
    const value = params[key];
    query[key] = value ? String(value) : null;
  }
  return query;
}
