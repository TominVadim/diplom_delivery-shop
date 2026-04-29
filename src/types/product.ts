export interface ProductCardProps {
  id: number;
  img: string;
  name: string;
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
  onRemoveFromFavorites?: () => void;
}
