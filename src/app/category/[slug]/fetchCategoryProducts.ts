import { query } from "../../../../utils/db";

interface FetchProductsOptions {
  page: number;
  limit: number;
  inStock?: boolean;
  priceFrom?: number;
  priceTo?: number;
}

export async function fetchProductsByCategory(slug: string, options: FetchProductsOptions) {
  const { page, limit, inStock, priceFrom, priceTo } = options;
  const offset = (page - 1) * limit;

  let whereClause = `$1 = ANY(p.tags)`;
  const params: any[] = [slug];

  if (inStock === true) {
    whereClause += ` AND p.quantity > 0`;
  }

  if (priceFrom !== undefined) {
    params.push(priceFrom);
    whereClause += ` AND p.base_price >= $${params.length}`;
  }

  if (priceTo !== undefined) {
    params.push(priceTo);
    whereClause += ` AND p.base_price <= $${params.length}`;
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
      p.id, p.img, p.title, p.description,
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
