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

export const SELLER_CHECKLIST = [
  { label: 'E-Mail bestätigen', done: true },
  { label: 'Profilbild hochladen', done: true },
  { label: 'Telefonnummer verifizieren', done: true },
  { label: 'Zahlungsmethode hinzufügen', done: true },
  { label: 'Erste Anzeige erstellen', done: false },
  { label: 'Abholort angeben', done: false },
];

export const SELLER_RATING = {
  score: 4.9,
  count: 36,
  bars: [25, 8, 2, 1, 0],
};

export const SELLER_NEWS = [
  { title: 'Neue Zahlungsmethoden in Linz', date: 'Heute' },
  { title: 'Frühjahrsaktion für lokale Verkäufer', date: 'Gestern' },
];

export const SELLER_TREND = {
  views: [42, 58, 50, 72, 64, 88, 76, 94],
  inquiries: [8, 14, 12, 20, 18, 26, 22, 28],
  sales: [1, 3, 2, 4, 3, 6, 5, 8],
};

export const SELLER_SALES_COUNT = 8;

export const INITIAL_SELLER_LISTINGS: SellerListing[] = [
  {
    id: '1',
    title: 'IKEA Söderhamn 3-Sitzer Sofa',
    price: 450,
    views: 186,
    chats: 4,
    status: 'aktiv',
    imageSrc: '/assets/images/Furniture.png',
    category: 'Möbel & Haushalt',
  },
  {
    id: '2',
    title: 'Bosch Akkuschrauber Set',
    price: 75,
    views: 92,
    chats: 2,
    status: 'aktiv',
    imageSrc: '/assets/images/Services.png',
    category: 'Bau & Renovierung',
  },
  {
    id: '3',
    title: 'Kinderfahrrad 16 Zoll',
    price: 40,
    views: 54,
    chats: 1,
    status: 'pausiert',
    imageSrc: '/assets/images/Free.png',
    category: 'Freizeit & Hobby',
  },
  {
    id: '4',
    title: 'Esstisch Eiche massiv',
    price: 120,
    views: 67,
    chats: 3,
    status: 'aktiv',
    imageSrc: '/assets/images/Furniture.png',
    category: 'Möbel & Haushalt',
  },
  {
    id: '5',
    title: 'Babywanne + Zubehör',
    price: 25,
    views: 31,
    chats: 0,
    status: 'pausiert',
    imageSrc: '/assets/images/Free.png',
    category: 'Baby & Kind',
  },
];

export const INITIAL_SELLER_THREADS: SellerThread[] = [
  {
    id: 'm1',
    buyerName: 'Thomas W.',
    initials: 'TW',
    productTitle: 'IKEA Söderhamn 3-Sitzer Sofa',
    preview: 'Hallo! Ist das Sofa noch verfügbar?',
    time: '12:40',
    unread: true,
    messages: [
      {
        id: 'm1-1',
        from: 'buyer',
        text: 'Hallo! Ist das Sofa noch verfügbar?',
        time: '12:40',
      },
      {
        id: 'm1-2',
        from: 'buyer',
        text: 'Kann ich es am Samstag in Linz abholen?',
        time: '12:41',
      },
    ],
  },
  {
    id: 'm2',
    buyerName: 'Mira K.',
    initials: 'MK',
    productTitle: 'Bosch Akkuschrauber Set',
    preview: 'Ist der Koffer noch vollständig?',
    time: 'Gestern',
    unread: true,
    messages: [
      {
        id: 'm2-1',
        from: 'buyer',
        text: 'Ist der Koffer noch vollständig?',
        time: 'Gestern',
      },
    ],
  },
  {
    id: 'm3',
    buyerName: 'Tom B.',
    initials: 'TB',
    productTitle: 'Kinderfahrrad 16 Zoll',
    preview: 'Danke, ich melde mich am Wochenende.',
    time: 'Mo',
    unread: false,
    messages: [
      {
        id: 'm3-1',
        from: 'buyer',
        text: 'Ist der Sattel höhenverstellbar?',
        time: 'So',
      },
      {
        id: 'm3-2',
        from: 'seller',
        text: 'Ja, der Sattel lässt sich verstellen.',
        time: 'So',
      },
      {
        id: 'm3-3',
        from: 'buyer',
        text: 'Danke, ich melde mich am Wochenende.',
        time: 'Mo',
      },
    ],
  },
];
