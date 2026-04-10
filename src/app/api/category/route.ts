import { CONFIG } from "../../../../config/config";
import { query } from "../../../../utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const slug = searchParams.get("slug");
    const startIdx = parseInt(searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE_CATEGORY.toString()
    );
    const filters = searchParams.getAll("filter");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const getPriceRangeOnly = searchParams.get("getPriceRangeOnly") === "true";
    const inStock = searchParams.get("inStock") === "true";

    if (!slug) {
      return NextResponse.json(
        { message: "Параметр slug обязателен" },
        { status: 400 }
      );
    }

    // Сначала получаем категорию по slug
    const categoryResult = await query(
      "SELECT title FROM catalog WHERE slug = $1",
      [slug]
    );
    
    if (categoryResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Категория не найдена" },
        { status: 404 }
      );
    }
    
    const categoryTitle = categoryResult.rows[0].title;

    // Если нужно только получить диапазон цен
    if (getPriceRangeOnly) {
      const priceRangeResult = await query(
        `SELECT
          MIN(base_price) as min,
          MAX(base_price) as max
        FROM products
        WHERE $1 = ANY(tags)`,
        [categoryTitle]
      );

      return NextResponse.json({
        priceRange: {
          min: priceRangeResult.rows[0]?.min ?? 0,
          max: priceRangeResult.rows[0]?.max ?? CONFIG.FALLBACK_PRICE_RANGE.max,
        },
      });
    }

    // Строим WHERE условия
    const conditions: string[] = [`$1 = ANY(tags)`];
    const values: any[] = [categoryTitle];
    let paramCounter = 2;

    if (inStock) {
      conditions.push(`quantity > 0`);
    }

    if (priceFrom) {
      conditions.push(`base_price >= $${paramCounter}`);
      values.push(parseInt(priceFrom));
      paramCounter++;
    }

    if (priceTo) {
      conditions.push(`base_price <= $${paramCounter}`);
      values.push(parseInt(priceTo));
      paramCounter++;
    }

    const whereClause = conditions.join(' AND ');

    // Получаем общее количество
    const countResult = await query(
      `SELECT COUNT(*) FROM products WHERE ${whereClause}`,
      values
    );
    const totalCount = parseInt(countResult.rows[0].count);

    // Получаем товары с пагинацией
    const productsResult = await query(
      `SELECT
        id, img, title, description,
        base_price as "basePrice",
        discount_percent as "discountPercent",
        jsonb_build_object('rate', rating_rate, 'count', rating_count) as rating,
        tags, weight, quantity
      FROM products
      WHERE ${whereClause}
      ORDER BY id
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`,
      [...values, perPage, startIdx]
    );

    const products = productsResult.rows.map(p => ({
      ...p,
      rating: typeof p.rating === 'string' ? JSON.parse(p.rating) : p.rating
    }));

    return NextResponse.json({
      products,
      totalCount,
      priceRange: { min: 0, max: 0 },
    });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке продуктов" },
      { status: 500 }
    );
  }
}
