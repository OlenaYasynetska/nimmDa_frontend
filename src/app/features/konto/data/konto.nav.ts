export const KONTO_NAV = [
  { label: 'Übersicht', path: '/konto', exact: true },
  { label: 'Nachrichten', path: '/konto/nachrichten', exact: false },
  { label: 'Meine Anzeigen', path: '/konto/meine-anzeigen', exact: false },
  { label: 'Favoriten', path: '/konto/favoriten', exact: false },
  { label: 'Profil', path: '/konto/profil', exact: false },
  { label: 'Einstellungen', path: '/konto/einstellungen', exact: false },
] as const;

export const LISTING_FILTERS = [
  { label: 'Aktiv', path: '/konto/meine-anzeigen', value: 'aktiv', exact: true },
  { label: 'Entwürfe', path: '/konto/meine-anzeigen/entwuerfe', value: 'entwuerfe', exact: true },
  { label: 'Beendet', path: '/konto/meine-anzeigen/beendet', value: 'beendet', exact: true },
] as const;
