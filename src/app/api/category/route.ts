import { CONFIG } from "../../../../config/config";
import { query } from "../../../../utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const startIdx = parseInt(searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE_CATEGORY.toString()
    );
    const filters = searchParams.getAll("filter");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const getPriceRangeOnly = searchParams.get("getPriceRangeOnly") === "true";
    const inStock = searchParams.get("inStock") === "true";

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 }
      );
    }

    // Если нужно только получить диапазон цен
    if (getPriceRangeOnly) {
      const priceRangeResult = await query(
        `SELECT 
          MIN(base_price) as min, 
          MAX(base_price) as max
        FROM products
        WHERE $1 = ANY(tags)`,
        [category]
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
    const values: any[] = [category];
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

    // Фильтры (в PostgreSQL нет isOurProduction и т.д., пока пропустим)
    // TODO: добавить дополнительные поля в таблицу products при необходимости
    
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
