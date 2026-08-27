export const LANDING_BRAND = 'Oberösterreich Marktplatz';

export const SEARCH_CATEGORIES = [
  'Alle Kategorien',
  'Möbel',
  'Elektronik',
  'Kleidung',
  'Auto',
  'Haus & Garten',
  'Immobilien',
  'Business',
  'Haustiere',
  'Renovierung',
  'Hobby',
  'Baby',
] as const;

export const SEARCH_RADII = ['+ 10 km', '+ 25 km', '+ 50 km', '+ 100 km'] as const;

export interface ActionCard {
  title: string;
  description: string;
  cta: string;
  icon: 'bag' | 'tag' | 'wrench' | 'user' | 'gift' | 'search';
  cardClass: string;
  iconClass: string;
  buttonClass: string;
}

export const ACTION_CARDS: ActionCard[] = [
  {
    title: 'Kaufen',
    description: 'Finde tolle Produkte',
    cta: 'Produkte entdecken',
    icon: 'bag',
    cardClass: 'bg-[#eaf7ee]',
    iconClass: 'text-[#2f9e57]',
    buttonClass: 'bg-[#3daf66] hover:bg-[#34985a] text-white',
  },
  {
    title: 'Verkaufen',
    description: 'Verkaufe, was du nicht mehr brauchst',
    cta: 'Anzeige aufgeben',
    icon: 'tag',
    cardClass: 'bg-[#eaf3fb]',
    iconClass: 'text-[#2f6fb2]',
    buttonClass: 'bg-[#2f6fb2] hover:bg-[#275d96] text-white',
  },
  {
    title: 'Dienstleistungen finden',
    description: 'Finde lokale Hilfe',
    cta: 'Services suchen',
    icon: 'wrench',
    cardClass: 'bg-[#fff3e8]',
    iconClass: 'text-[#e67a22]',
    buttonClass: 'bg-[#f08a2a] hover:bg-[#d9781e] text-white',
  },
  {
    title: 'Dienstleistungen anbieten',
    description: 'Biete deine Skills an',
    cta: 'Service anbieten',
    icon: 'user',
    cardClass: 'bg-[#f4eef8]',
    iconClass: 'text-[#8b4fad]',
    buttonClass: 'bg-[#8b4fad] hover:bg-[#764294] text-white',
  },
  {
    title: 'Verschenken',
    description: 'Gib weiter, statt wegzuwerfen',
    cta: 'Kostenlos inserieren',
    icon: 'gift',
    cardClass: 'bg-[#eef8e4]',
    iconClass: 'text-[#7cb342]',
    buttonClass: 'bg-[#8bc34a] hover:bg-[#7ab03d] text-white',
  },
  {
    title: 'Kostenlos finden',
    description: 'Entdecke Gratis-Angebote',
    cta: 'Gratis entdecken',
    icon: 'search',
    cardClass: 'bg-[#fff8e1]',
    iconClass: 'text-[#d4a017]',
    buttonClass: 'bg-[#f0c419] hover:bg-[#ddb310] text-slate-900',
  },
];

export interface PopularCategory {
  name: string;
  icon: string;
}

export const POPULAR_CATEGORIES: PopularCategory[] = [
  { name: 'Möbel', icon: 'sofa' },
  { name: 'Elektronik', icon: 'monitor' },
  { name: 'Kleidung', icon: 'shirt' },
  { name: 'Auto', icon: 'car' },
  { name: 'Haus & Garten', icon: 'home' },
  { name: 'Immobilien', icon: 'building' },
  { name: 'Business', icon: 'briefcase' },
  { name: 'Haustiere', icon: 'paw' },
  { name: 'Renovierung', icon: 'hammer' },
  { name: 'Hobby', icon: 'palette' },
  { name: 'Baby', icon: 'baby' },
  { name: 'Weitere Kategorien', icon: 'more' },
];

export interface WhyItem {
  title: string;
  description: string;
  icon: 'pin' | 'shield' | 'chat' | 'heart';
}

export const WHY_ITEMS: WhyItem[] = [
  {
    title: 'Lokal & Regional',
    description: 'Nur Angebote aus Oberösterreich – nah, persönlich, regional.',
    icon: 'pin',
  },
  {
    title: 'Sicher & Vertrauensvoll',
    description: 'Klare Regeln, Hinweise zur sicheren Übergabe, keine versteckten Kosten.',
    icon: 'shield',
  },
  {
    title: 'Einfach & Schnell',
    description: 'In wenigen Klicks inserieren, suchen und Kontakt aufnehmen.',
    icon: 'chat',
  },
  {
    title: 'Kostenlos starten',
    description: 'Privat inserieren und suchen – ohne Abo und ohne Startgebühr.',
    icon: 'heart',
  },
];

export const FOOTER_SERVICE_LINKS = [
  { label: 'Hilfe / FAQ', href: '#' },
  { label: 'Sicherheitstipps', href: '#' },
  { label: 'AGB', href: '#' },
  { label: 'Datenschutz', href: '#' },
  { label: 'Impressum', href: '#' },
];

export const FOOTER_BUSINESS_LINKS = [
  { label: 'Werbung schalten', href: '#' },
  { label: 'Profi-Profil', href: '#' },
  { label: 'Kooperationen', href: '#' },
];
