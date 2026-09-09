export type ListingStatus = 'aktiv' | 'pausiert';

export interface SellerListing {
  id: string;
  title: string;
  price: number;
  views: number;
  chats: number;
  status: ListingStatus;
  imageSrc: string;
  category?: string;
}

export interface SellerChatLine {
  id: string;
  from: 'buyer' | 'seller';
  text: string;
  time: string;
}

export interface SellerThread {
  id: string;
  listingId?: string;
  buyerName: string;
  initials: string;
  productTitle: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: SellerChatLine[];
}

export interface SellerNavItem {
  label: string;
  path?: string;
  exact?: boolean;
  highlight?: boolean;
}

export const SELLER_NAV: { title: string; items: SellerNavItem[] }[] = [
  {
    title: '',
    items: [{ label: 'Übersicht', path: '/seller', exact: true }],
  },
  {
    title: 'Verkaufen',
    items: [
      { label: 'Meine Anzeigen', path: '/seller', highlight: false },
      { label: 'Anzeige erstellen', path: '/seller/listings/new' },
      { label: 'Entwürfe' },
      { label: 'Statistiken' },
      { label: 'Nachrichten', path: '/seller/messages' },
      { label: 'Anfragen', path: '/seller/messages' },
      { label: 'Bewertungen' },
    ],
  },
  {
    title: 'Verwaltung',
    items: [
      { label: 'Bestellungen' },
      { label: 'Zahlungen & Auszahlungen' },
      { label: 'Versand & Abholung' },
      { label: 'Buchhaltung' },
    ],
  },
  {
    title: 'Mein Konto',
    items: [
      { label: 'Profil bearbeiten' },
      { label: 'Verifizierungen' },
      { label: 'Einstellungen' },
      { label: 'Sicherheit' },
    ],
  },
  {
    title: 'Hilfe & Support',
    items: [
      { label: 'Hilfe & FAQ' },
      { label: 'Richtlinien' },
      { label: 'Kontakt' },
      { label: 'Feedback geben' },
    ],
  },
];

export const SELLER_TIPS = [
  { title: 'Gute Fotos', text: 'Helles Licht und mehrere Winkel erhöhen die Aufrufe.' },
  { title: 'Klare Beschreibung', text: 'Zustand, Maße und Abholung helfen Käufern.' },
  { title: 'Schnell antworten', text: 'Wer zügig schreibt, verkauft öfter.' },
];

export const SELLER_CHECKLIST_ITEMS = [
  { id: 'email', label: 'E-Mail bestätigen' },
  { id: 'photo', label: 'Profilbild hochladen' },
  { id: 'phone', label: 'Telefonnummer verifizieren' },
  { id: 'payment', label: 'Zahlungsmethode hinzufügen' },
  { id: 'listing', label: 'Erste Anzeige erstellen' },
  { id: 'pickup', label: 'Abholort angeben' },
] as const;
