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
  location?: string;
}

export interface SellerChatLine {
  id: string;
  from: 'self' | 'other';
  text: string;
  time: string;
}

export interface SellerThread {
  id: string;
  listingId?: string;
  participant: string;
  initials: string;
  productTitle: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: SellerChatLine[];
}

