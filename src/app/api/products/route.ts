import { CONFIG } from "../../../../config/config";
import { query } from "../../../../utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const tag = url.searchParams.get("tag");
    const randomLimit = url.searchParams.get("randomLimit");
    const startIdx = parseInt(url.searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      url.searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE.toString()
    );

    if (!tag) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 }
      );
    }

    // Случайные товары
    if (randomLimit) {
      const limit = parseInt(randomLimit);
      const result = await query(
        `SELECT
          id, img, title, description,
          base_price as "basePrice",
          discount_percent as "discountPercent",
          jsonb_build_object('rate', rating_rate, 'count', rating_count) as rating,
          tags, weight, quantity
        FROM products
        WHERE $1 = ANY(tags) AND quantity > 0
        ORDER BY RANDOM()
        LIMIT $2`,
        [tag, limit]
      );
      return NextResponse.json(result.rows);
    }

    // Пагинированный список
    const countResult = await query(
      `SELECT COUNT(*) FROM products 
       WHERE $1 = ANY(tags) AND quantity > 0`,
      [tag]
    );
    const totalCount = parseInt(countResult.rows[0].count);

    const productsResult = await query(
      `SELECT
        id, img, title, description,
        base_price as "basePrice",
        discount_percent as "discountPercent",
        jsonb_build_object('rate', rating_rate, 'count', rating_count) as rating,
        tags, weight, quantity
      FROM products
      WHERE $1 = ANY(tags) AND quantity > 0
      ORDER BY id
      LIMIT $2 OFFSET $3`,
      [tag, perPage, startIdx]
    );

    const products = productsResult.rows.map(p => ({
      ...p,
      rating: typeof p.rating === 'string' ? JSON.parse(p.rating) : p.rating
    }));

    return NextResponse.json({ products, totalCount });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке продуктов" },
      { status: 500 }
    );
  }
}

