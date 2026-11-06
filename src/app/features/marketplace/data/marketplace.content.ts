export interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  images?: string[];
  category: string;
  location: string;
  description?: string;
  createdAt?: string;
  sellerId?: string;
  promoted?: boolean;
}
