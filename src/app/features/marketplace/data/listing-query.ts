import type { Params } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { categoryBySlug } from '../../landing/data/landing.content';

const FILTER_KEYS = ['q', 'ort', 'km', 'von', 'bis', 'sort', 'kat', 'kostenlos', 'price'] as const;

export interface ListingSearchParams {
  q?: string | null;
  kat?: string | null;
  category?: string | null;
  ort?: string | null;
  von?: number | null;
  bis?: number | null;
  sort?: string | null;
  km?: number | null;
  kostenlos?: boolean;
  page?: number | null;
  size?: number | null;
}

export function listingFilterQuery(params: Params): Record<string, string | null> {
  const query: Record<string, string | null> = {};
  for (const key of FILTER_KEYS) {
    const value = params[key];
    query[key] = value ? String(value) : null;
  }
  return query;
}

/** Maps site URL filters to the public listings API. */
export function listingSearchHttpParams(search: ListingSearchParams): HttpParams {
  let params = new HttpParams();
  params = setParam(params, 'q', search.q);
  params = setParam(params, 'category', toApiCategory(search));
  params = setParam(params, 'location', search.ort);
  if (!search.kostenlos && search.von !== null && search.von !== undefined && Number.isFinite(search.von)) {
    params = params.set('minPrice', String(search.von));
  }
  if (!search.kostenlos && search.bis !== null && search.bis !== undefined && Number.isFinite(search.bis)) {
    params = params.set('maxPrice', String(search.bis));
  }
  if (search.km !== null && search.km !== undefined && Number.isFinite(search.km) && search.km > 0) {
    params = params.set('km', String(Math.floor(search.km)));
  }
  const sort = toApiSort(search.sort);
  if (sort) {
    params = params.set('sort', sort);
  }
  if (search.kostenlos) {
    params = params.set('free', 'true');
  }
  if (search.page !== null && search.page !== undefined && Number.isFinite(search.page) && search.page >= 0) {
    params = params.set('page', String(Math.floor(search.page)));
  }
  if (search.size !== null && search.size !== undefined && Number.isFinite(search.size) && search.size > 0) {
    params = params.set('size', String(Math.floor(search.size)));
  }
  return params;
}

function toApiCategory(search: ListingSearchParams): string | null {
  if (search.category?.trim()) {
    return search.category.trim();
  }
  const slug = search.kat?.trim();
  if (!slug || slug === 'weitere') {
    return null;
  }
  return categoryBySlug(slug)?.name ?? null;
}

function toApiSort(sort?: string | null): string | null {
  if (sort === 'preis-asc' || sort === 'price_asc') {
    return 'price_asc';
  }
  if (sort === 'preis-desc' || sort === 'price_desc') {
    return 'price_desc';
  }
  if (sort === 'oldest') {
    return 'oldest';
  }
  if (sort === 'newest' || sort === 'neueste') {
    return 'newest';
  }
  if (sort === 'naehe' || sort === 'distance') {
    return 'distance';
  }
  return null;
}

function setParam(params: HttpParams, key: string, value?: string | null): HttpParams {
  const trimmed = value?.trim();
  return trimmed ? params.set(key, trimmed) : params;
}
