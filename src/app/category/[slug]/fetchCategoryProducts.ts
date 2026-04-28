import { query } from "../../../../utils/db";

interface FetchProductsOptions {
  page: number;
  limit: number;
  inStock?: boolean;
  priceFrom?: number;
  priceTo?: number;
  filters?: string[]; // our_production, healthy_food, non_gmo
}

export async function fetchProductsByCategory(slug: string, options: FetchProductsOptions) {
  const { page, limit, inStock, priceFrom, priceTo, filters = [] } = options;
  const offset = (page - 1) * limit;

  let whereClause = `$1 = ANY(p.tags)`;
  const params: any[] = [slug];

  // Фильтр по наличию
  if (inStock === true) {
    whereClause += ` AND p.quantity > 0`;
  }

  // Фильтр по цене от
  if (priceFrom !== undefined) {
    params.push(priceFrom);
    whereClause += ` AND p.base_price >= $${params.length}`;
  }

  // Фильтр по цене до
  if (priceTo !== undefined) {
    params.push(priceTo);
    whereClause += ` AND p.base_price <= $${params.length}`;
  }

  // Фильтры товаров (our_production, healthy_food, non_gmo)
  if (filters.length > 0) {
    const filterConditions: string[] = [];
    
    if (filters.includes("our_production")) {
      filterConditions.push(`p.is_our_production = true`);
    }
    if (filters.includes("healthy_food")) {
      filterConditions.push(`p.is_healthy_food = true`);
    }
    if (filters.includes("non_gmo")) {
      filterConditions.push(`p.is_non_gmo = true`);
    }
    
    if (filterConditions.length > 0) {
      whereClause += ` AND (${filterConditions.join(" OR ")})`;
    }
  }

  // Count query
  const countResult = await query(
    `SELECT COUNT(*) as total FROM products p WHERE ${whereClause}`,
    params
  );
  const totalCount = parseInt(countResult.rows[0].total);

  // Data query
  const productsResult = await query(
    `SELECT
      p.id, p.img, p.name, p.description,
      p.base_price as "basePrice",
      p.discount_percent as "discountPercent",
      jsonb_build_object('rate', p.rating_rate, 'count', p.rating_count) as rating,
      p.tags, p.weight, p.quantity
    FROM products p
    WHERE ${whereClause}
    ORDER BY p.id
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  const products = productsResult.rows.map((p: any) => ({
    ...p,
    rating: typeof p.rating === 'string' ? JSON.parse(p.rating) : p.rating
  }));

  return { items: products, totalCount };
}
