export const KONTO_NAV = [
  { label: 'Übersicht', path: '/konto', exact: true },
  { label: 'Nachrichten', path: '/konto/nachrichten' },
  { label: 'Meine Anzeigen', path: '/konto/meine-anzeigen' },
  { label: 'Favoriten', path: '/konto/favoriten' },
  { label: 'Profil', path: '/konto/profil' },
  { label: 'Einstellungen', path: '/konto/einstellungen' },
] as const;

export const LISTING_FILTERS = [
  { label: 'Aktiv', path: '/konto/meine-anzeigen/aktiv', value: 'aktiv' },
  { label: 'Entwürfe', path: '/konto/meine-anzeigen/entwuerfe', value: 'entwuerfe' },
  { label: 'Beendet', path: '/konto/meine-anzeigen/beendet', value: 'beendet' },
] as const;
