export const STANDORT_CITIES = ['Steyr', 'Linz', 'Wels', 'Amstetten'] as const;

export const STANDORT_ANDERE = 'andere' as const;

export type NamedStandort = (typeof STANDORT_CITIES)[number];
export type StandortValue = string;

export const STANDORT_OPTIONS: { value: StandortValue; label: string }[] = [
  { value: '', label: 'Standort' },
  ...STANDORT_CITIES.map((city) => ({ value: city, label: city })),
  { value: STANDORT_ANDERE, label: 'Andere Stadt' },
];

export const CREATE_LISTING_LOCATIONS: { value: NamedStandort | typeof STANDORT_ANDERE; label: string }[] = [
  ...STANDORT_CITIES.map((city) => ({ value: city, label: city })),
  { value: STANDORT_ANDERE, label: 'Andere Stadt' },
];

export const UMKREIS_OPTIONS = [5, 10, 25, 50] as const;

export const SORT_OPTIONS = [
  { value: 'neueste', label: 'Neueste zuerst' },
  { value: 'preis-asc', label: 'Preis aufsteigend' },
  { value: 'preis-desc', label: 'Preis absteigend' },
  { value: 'naehe', label: 'Entfernung' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

/** City centers in Oberösterreich — used only for Umkreis, never as a default Standort. */
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  linz: { lat: 48.3069, lng: 14.2858 },
  wels: { lat: 48.1575, lng: 14.0289 },
  steyr: { lat: 48.0428, lng: 14.4213 },
  amstetten: { lat: 48.1229, lng: 14.872 },
  leonding: { lat: 48.2792, lng: 14.2531 },
  traun: { lat: 48.2265, lng: 14.2396 },
  enns: { lat: 48.2135, lng: 14.4789 },
  ansfelden: { lat: 48.2097, lng: 14.2903 },
  marchtrenk: { lat: 48.1917, lng: 14.1106 },
  gmunden: { lat: 47.9185, lng: 13.7994 },
  'vöcklabruck': { lat: 48.0087, lng: 13.6556 },
  voecklabruck: { lat: 48.0087, lng: 13.6556 },
  perg: { lat: 48.2503, lng: 14.6339 },
  freistadt: { lat: 48.5117, lng: 14.5036 },
  ried: { lat: 48.2107, lng: 13.4884 },
  'schärding': { lat: 48.4569, lng: 13.4317 },
  schaerding: { lat: 48.4569, lng: 13.4317 },
  braunau: { lat: 48.2563, lng: 13.0434 },
};

export function parseStandort(value: string | null | undefined): StandortValue {
  if (!value) {
    return '';
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  if (trimmed.toLowerCase() === STANDORT_ANDERE) {
    return STANDORT_ANDERE;
  }
  const named = STANDORT_CITIES.find((city) => city.toLowerCase() === trimmed.toLowerCase());
  return named ?? trimmed;
}

export function standortLabel(value: StandortValue): string {
  if (!value) {
    return 'Standort';
  }
  if (value === STANDORT_ANDERE) {
    return 'Andere Stadt';
  }
  return value;
}

export function listingMatchesStandort(location: string, standort: StandortValue): boolean {
  if (!standort) {
    return true;
  }
  const city = location.trim().toLowerCase();
  if (standort === STANDORT_ANDERE) {
    return !STANDORT_CITIES.some((item) => item.toLowerCase() === city);
  }
  return city === standort.toLowerCase();
}

export function hasCoordinates(city: string): boolean {
  return coordinatesFor(city) !== null;
}

export function listingMatchesUmkreis(
  location: string,
  center: StandortValue,
  km: number
): boolean {
  if (!center || center === STANDORT_ANDERE || !km) {
    return true;
  }
  if (location.trim().toLowerCase() === center.trim().toLowerCase()) {
    return true;
  }
  const distance = distanceKm(location, center);
  return distance !== null && distance <= km;
}

export function listingDistanceKm(location: string, center: StandortValue): number | null {
  if (!center || center === STANDORT_ANDERE) {
    return null;
  }
  if (location.trim().toLowerCase() === center.trim().toLowerCase()) {
    return 0;
  }
  return distanceKm(location, center);
}

export function uniqueListingLocations(locations: string[]): string[] {
  const seen = new Map<string, string>();
  for (const location of locations) {
    const city = location.trim();
    if (!city) {
      continue;
    }
    const key = city.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, city);
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, 'de'));
}

export function parseUmkreis(value: string | null | undefined): number | null {
  const km = Number(value);
  return UMKREIS_OPTIONS.includes(km as (typeof UMKREIS_OPTIONS)[number]) ? km : null;
}

export function parseSort(value: string | null | undefined): SortValue {
  return SORT_OPTIONS.some((option) => option.value === value)
    ? (value as SortValue)
    : 'neueste';
}

function coordinatesFor(city: string): { lat: number; lng: number } | null {
  const key = city.trim().toLowerCase();
  return CITY_COORDINATES[key] ?? null;
}

function distanceKm(fromCity: string, toCity: string): number | null {
  const from = coordinatesFor(fromCity);
  const to = coordinatesFor(toCity);
  if (!from || !to) {
    return null;
  }
  const earthKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}
