export const STANDORT_CITIES = ['Linz', 'Wels', 'Steyr', 'Amstetten'] as const;

export const SUGGESTED_CITIES = [
  ...STANDORT_CITIES,
  'Leonding',
  'Traun',
  'Enns',
  'Ansfelden',
  'Marchtrenk',
  'Gmunden',
  'Vöcklabruck',
  'Perg',
  'Freistadt',
  'Ried im Innkreis',
  'Schärding',
  'Braunau am Inn',
  'Wien',
  'Graz',
  'Salzburg',
  'Innsbruck',
] as const;

export type StandortValue = string;

export const UMKREIS_OPTIONS = [5, 10, 25, 50] as const;

export const SORT_OPTIONS = [
  { value: 'neueste', label: 'Neueste zuerst' },
  { value: 'preis-asc', label: 'Preis aufsteigend' },
  { value: 'preis-desc', label: 'Preis absteigend' },
  { value: 'naehe', label: 'Entfernung' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export function parseStandort(value: string | null | undefined): StandortValue {
  if (!value) {
    return '';
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === 'andere') {
    return '';
  }
  const known = knownCities().find((city) => city.toLowerCase() === trimmed.toLowerCase());
  return known ?? trimmed;
}

export function standortLabel(value: StandortValue): string {
  return value || 'Standort';
}

export function suggestCities(query: string, extra: string[] = []): string[] {
  const popular = [...STANDORT_CITIES];
  const rest = uniqueListingLocations([...SUGGESTED_CITIES, ...extra]).filter(
    (city) => !popular.some((item) => item.toLowerCase() === city.toLowerCase())
  );
  const all = [...popular, ...rest];
  const q = query.trim().toLowerCase();
  if (!q) {
    return all;
  }
  return all.filter((city) => city.toLowerCase().includes(q));
}

function knownCities(): string[] {
  return uniqueListingLocations([...SUGGESTED_CITIES]);
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
