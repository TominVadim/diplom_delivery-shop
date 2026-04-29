export interface SearchResultsProps {
  isLoading: boolean;
  query: string;
  results: Array<{
    id: number;
    name: string;
    description: string;
    basePrice: number;
    discountPercent: number;
    img: string;
    tags: string[];
  }>;
  resetSearch: () => void;
}
