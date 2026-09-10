export const LANDING_BRAND = 'NimmDa';
export const LANDING_TAGLINE = 'Dein lokaler Marktplatz.';

export interface ActionCard {
  title: string;
  description: string;
  cta: string;
  icon: 'bag' | 'wrench' | 'gift';
  iconSrc?: string;
  illustration: 'chair' | 'toolbox' | 'box';
  imageSrc?: string;
  imageAlt?: string;
  titleClass: string;
  iconClass: string;
  buttonClass: string;
  cardClass: string;
  link: string;
  queryParams?: Record<string, string>;
}

export const ACTION_CARDS: ActionCard[] = [
  {
    title: 'Kaufen',
    description: 'Finde tolle Produkte in deiner Nähe.',
    cta: 'Zum Marktplatz',
    icon: 'bag',
    iconSrc: '/assets/icons/shopping_bag.svg',
    illustration: 'chair',
    imageSrc: '/assets/images/Furniture.png?v=5',
    imageAlt: 'Furniture',
    titleClass: 'text-[#2f9e57]',
    iconClass: 'text-[#2f9e57]',
    buttonClass: 'bg-[#2f9e57] hover:bg-[#278a4b] text-white',
    cardClass: 'bg-[#eaf8ef]',
    link: '/anzeigen',
  },
  {
    title: 'Services',
    description: 'Finde Hilfe und Profis für dein Anliegen.',
    cta: 'Find services',
    icon: 'wrench',
    illustration: 'toolbox',
    imageSrc: '/assets/images/Services.png?v=3',
    imageAlt: 'Services',
    titleClass: 'text-[#6f4ea1]',
    iconClass: 'text-[#6f4ea1]',
    buttonClass: 'bg-[#6f4ea1] hover:bg-[#5d4188] text-white',
    cardClass: 'bg-[#f3eef8]',
    link: '/services',
  },
  {
    title: 'Kostenlos',
    description: 'Gib Dinge ab oder finde sie kostenlos.',
    cta: 'Kostenlos entdecken',
    icon: 'gift',
    illustration: 'box',
    imageSrc: '/assets/images/Free.png',
    imageAlt: 'Free',
    titleClass: 'text-[#d4a017]',
    iconClass: 'text-[#d4a017]',
    buttonClass: 'bg-[#f5c400] hover:bg-[#e0b400] text-white',
    cardClass: 'bg-[#fff8dc]',
    link: '/kostenlos',
  },
];

export const HERO_USPS = [
  { icon: 'shield', label: 'Sicher & vertrauensvoll', iconClass: 'text-[#2f6fb2]' },
  { icon: 'pin', label: 'Lokal in Oberösterreich', iconClass: 'text-[#2f6fb2]' },
  { icon: 'heart', label: 'Kostenlos & einfach', iconClass: 'text-[#e07a9a]' },
] as const;

export interface PopularCategory {
  name: string;
  slug: string;
  icon: string;
  iconSrc?: string;
  iconClass: string;
}

export const POPULAR_CATEGORIES: PopularCategory[] = [
  {
    name: 'Möbel & Haushalt',
    slug: 'moebel-haushalt',
    icon: 'sofa',
    iconSrc: '/assets/icons/sofa_icon.svg',
    iconClass: 'text-[#1b3a5f]',
  },
  {
    name: 'Elektronik',
    slug: 'elektronik',
    icon: 'monitor',
    iconSrc: '/assets/icons/monitor_icon.svg',
    iconClass: 'text-[#2f6fb2]',
  },
  {
    name: 'Kleidung & Schuhe',
    slug: 'kleidung-schuhe',
    icon: 'shirt',
    iconSrc: '/assets/icons/shirt_icon.svg',
    iconClass: 'text-[#1b3a5f]',
  },
  {
    name: 'Auto & Zubehör',
    slug: 'auto-zubehoer',
    icon: 'car',
    iconSrc: '/assets/icons/car_icon.svg',
    iconClass: 'text-[#1b3a5f]',
  },
  {
    name: 'Haus & Garten',
    slug: 'haus-garten',
    icon: 'home',
    iconSrc: '/assets/icons/home_garden_icon.svg',
    iconClass: 'text-[#2f9e57]',
  },
  {
    name: 'Immobilien',
    slug: 'immobilien',
    icon: 'building',
    iconSrc: '/assets/icons/building_icon.svg',
    iconClass: 'text-[#1b3a5f]',
  },
  {
    name: 'Arbeitswelt & Business',
    slug: 'arbeitswelt-business',
    icon: 'briefcase',
    iconSrc: '/assets/icons/briefcase_icon.svg',
    iconClass: 'text-[#1b3a5f]',
  },
  {
    name: 'Tiere & Zubehör',
    slug: 'tiere-zubehoer',
    icon: 'paw',
    iconSrc: '/assets/icons/paw_icon.svg',
    iconClass: 'text-[#2f9e57]',
  },
  {
    name: 'Bau & Renovierung',
    slug: 'bau-renovierung',
    icon: 'hammer',
    iconSrc: '/assets/icons/hammer_icon.svg',
    iconClass: 'text-[#1b3a5f]',
  },
  {
    name: 'Freizeit & Hobby',
    slug: 'freizeit-hobby',
    icon: 'bike',
    iconSrc: '/assets/icons/bike_icon.svg',
    iconClass: 'text-[#5b5fc7]',
  },
  {
    name: 'Baby & Kind',
    slug: 'baby-kind',
    icon: 'stroller',
    iconSrc: '/assets/icons/stroller_icon.svg',
    iconClass: 'text-[#e05a6c]',
  },
  {
    name: 'Dienstleistungen',
    slug: 'dienstleistungen',
    icon: 'wrench',
    iconClass: 'text-[#6f4ea1]',
  },
  {
    name: 'Weitere Kategorien',
    slug: 'weitere',
    icon: 'grid',
    iconSrc: '/assets/icons/grid_icon.svg',
    iconClass: 'text-[#1b3a5f]',
  },
];

export function categoryBySlug(slug: string): PopularCategory | undefined {
  return POPULAR_CATEGORIES.find((category) => category.slug === slug);
}

export function categoryByName(name: string): PopularCategory | undefined {
  return POPULAR_CATEGORIES.find((category) => category.name === name);
}

export function categoryListingsPath(category: PopularCategory): string {
  if (category.slug === 'weitere') {
    return '/anzeigen';
  }
  if (category.slug === 'dienstleistungen') {
    return '/services';
  }
  return `/anzeigen/${category.slug}`;
}

export interface HowStep {
  step: string;
  title: string;
  description: string;
  icon: 'search' | 'chat' | 'handshake' | 'heart';
  circleClass: string;
}

export const HOW_STEPS: HowStep[] = [
  {
    step: '01',
    title: 'Finden',
    description: 'Suche nach dem, was du brauchst – in deiner Nähe.',
    icon: 'search',
    circleClass: 'bg-[#2f9e57] text-white',
  },
  {
    step: '02',
    title: 'Kontaktieren',
    description: 'Schreib der Person direkt über NimmDa.',
    icon: 'chat',
    circleClass: 'bg-[#6f4ea1] text-white',
  },
  {
    step: '03',
    title: 'Treffen & Abwickeln',
    description: 'Trefft euch lokal und wickelt den Deal sicher ab.',
    icon: 'handshake',
    circleClass: 'bg-[#f5c400] text-slate-900',
  },
  {
    step: '04',
    title: 'Weiterempfehlen',
    description: 'Empfiehl NimmDa weiter und stärke die Region.',
    icon: 'heart',
    circleClass: 'bg-[#e07a9a] text-white',
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

export const FOOTER_ABOUT_LINKS = [
  { label: 'Über NimmDa', href: '#' },
  { label: 'Team', href: '#' },
  { label: 'Presse', href: '#' },
  { label: 'Kontakt', href: '#' },
];
