export interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  category: string;
  location: string;
  createdAt?: string;
  sellerId?: string;
}
