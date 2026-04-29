import { CONFIG } from "../../../config/config";

interface FetchFavoritesOptions {
  pagination: { startIdx: number; perPage: number };
  filter?: string | string[];
  priceFrom?: string;
  priceTo?: string;
  inStock?: boolean;
  userId?: string | null;
}

export interface ProductItem {
  id: number;
  img: string;
  name: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  rating: { rate: number; count: number };
  tags: string[];
  weight: string;
  quantity: number;
}

interface FetchFavoritesResponse {
  items: ProductItem[];
  totalCount: number;
  priceRange?: { min: number; max: number };
}

const fetchFavorites = async (options: FetchFavoritesOptions): Promise<FetchFavoritesResponse> => {
  const { pagination, filter, priceFrom, priceTo, inStock, userId } = options;

  if (!userId) {
    return {
      items: [],
      totalCount: 0,
    };
  }

  const perPage = pagination.perPage || CONFIG.ITEMS_PER_PAGE_CATEGORY;

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/users/favorites/products`);

  url.searchParams.append("startIdx", pagination.startIdx.toString());
  url.searchParams.append("perPage", perPage.toString());
  url.searchParams.append("userId", userId);

  if (filter) {
    if (Array.isArray(filter)) {
      filter.forEach((f) => url.searchParams.append("filter", f));
    } else {
      url.searchParams.append("filter", filter);
    }
  }

  if (priceFrom) {
    url.searchParams.append("priceFrom", priceFrom);
  }

  if (priceTo) {
    url.searchParams.append("priceTo", priceTo);
  }

  if (inStock !== undefined) {
    url.searchParams.append("inStock", inStock.toString());
  }

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error(`Серверная ошибка получения избранных продуктов: ${res.status}`);
    }

    const data = await res.json();

    return {
      items: data.products || [],
      totalCount: data.totalCount || 0,
      priceRange: data.priceRange,
    };
  } catch (err) {
    console.error("Ошибка в fetchFavorites:", err);
    throw err;
  }
};

export default fetchFavorites;
