import { NextRequest, NextResponse } from "next/server";
import { query } from "@/utils/db";
import { CONFIG } from "@/config/config";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startIdx = parseInt(searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE_CATEGORY.toString()
    );
    const filters = searchParams.getAll("filter");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const getPriceRangeOnly = searchParams.get("getPriceRangeOnly") === "true";
    const inStock = searchParams.get("inStock") === "true";
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    // Получаем массив избранных ID товаров пользователя
    const userResult = await query(
      "SELECT favorites FROM users WHERE id = $1",
      [parseInt(userId)]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    const favoriteProductIds: number[] = userResult.rows[0].favorites || [];

    if (favoriteProductIds.length === 0) {
      if (getPriceRangeOnly) {
        return NextResponse.json({
          priceRange: CONFIG.FALLBACK_PRICE_RANGE,
        });
      }
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    // Строим WHERE условие
    let whereClause = `p.id = ANY($1::int[])`;
    const params: any[] = [favoriteProductIds];

    let paramCounter = 2;

    // Фильтр по наличию
    if (inStock) {
      whereClause += ` AND p.quantity > 0`;
    }

    // Фильтр по цене
    if (priceFrom !== null && priceFrom !== undefined && priceFrom !== "") {
      whereClause += ` AND p.base_price >= $${paramCounter}`;
      params.push(parseInt(priceFrom));
      paramCounter++;
    }

    if (priceTo !== null && priceTo !== undefined && priceTo !== "") {
      whereClause += ` AND p.base_price <= $${paramCounter}`;
      params.push(parseInt(priceTo));
      paramCounter++;
    }

    // Дополнительные фильтры (our_production, healthy_food, non_gmo)
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

    // Если нужно только получить диапазон цен
    if (getPriceRangeOnly) {
      const priceRangeResult = await query(
        `SELECT 
          MIN(p.base_price) as min, 
          MAX(p.base_price) as max 
         FROM products p 
         WHERE ${whereClause}`,
        params
      );

      return NextResponse.json({
        priceRange: {
          min: priceRangeResult.rows[0]?.min || CONFIG.FALLBACK_PRICE_RANGE.min,
          max: priceRangeResult.rows[0]?.max || CONFIG.FALLBACK_PRICE_RANGE.max,
        },
      });
    }

    // Получаем общее количество товаров
    const countResult = await query(
      `SELECT COUNT(*) as total FROM products p WHERE ${whereClause}`,
      params
    );
    const totalCount = parseInt(countResult.rows[0].total);

    // Получаем товары с пагинацией
    const productsResult = await query(
      `SELECT
        p.id, p.img, p.name, p.description,
        p.base_price as "basePrice",
        p.discount_percent as "discountPercent",
        COALESCE(jsonb_build_object('rate', p.rating_rate, 'count', p.rating_count), '{"rate": 0, "count": 0}') as rating,
        p.tags, p.weight, p.quantity
      FROM products p
      WHERE ${whereClause}
      ORDER BY p.id
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`,
      [...params, perPage, startIdx]
    );

    const products = productsResult.rows.map((p: any) => ({
      ...p,
      rating: typeof p.rating === 'string' ? JSON.parse(p.rating) : p.rating
    }));

    // Вычисляем актуальный диапазон цен для отфильтрованных товаров
    let actualPriceRange = CONFIG.FALLBACK_PRICE_RANGE;
    if (products.length > 0) {
      const prices = products.map((p: any) => p.basePrice);
      actualPriceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }

    return NextResponse.json({
      products,
      totalCount,
      priceRange: actualPriceRange,
    });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке избранных продуктов" },
      { status: 500 }
    );
  }
}
