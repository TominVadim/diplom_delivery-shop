export interface ProductCardProps {
  id: number;           // было _id: number
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent?: number;
  rating: {
    rate: number;
    count: number;
  };
  tags: string[];
  weight?: string;
  quantity: number;
}
