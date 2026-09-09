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
      { label: 'Meine Anzeigen', path: '/seller' },
      { label: 'Anzeige erstellen', path: '/seller/listings/new' },
      { label: 'Nachrichten', path: '/seller/messages' },
    ],
  },
];
