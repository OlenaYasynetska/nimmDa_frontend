import { CanMatchFn } from '@angular/router';
import { categoryBySlug } from '../../landing/data/landing.content';

export const categoryListingsMatch: CanMatchFn = (_route, segments) => {
  const slug = segments[1]?.path ?? '';
  return !!categoryBySlug(slug);
};

export function listingDetailLink(id: string): string[] {
  return ['/anzeigen', id];
}

export function listingDetailUrl(id: string, query?: string): string {
  const path = `/anzeigen/${encodeURIComponent(id)}`;
  return query ? `${path}?${query}` : path;
}
