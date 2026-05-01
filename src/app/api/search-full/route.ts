import { NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query") || "";

    if (!searchQuery) {
      return NextResponse.json([]);
    }

    const result = await query(
      `SELECT
        id,
        name,
        description,
        base_price,
        discount_percent,
        rating_rate,
        rating_count,
        img,
        tags,
        quantity
      FROM products
      WHERE (name ILIKE $1 OR description ILIKE $1)
        AND quantity > 0
      ORDER BY id`,
      [`%${searchQuery}%`]
    );

    // Формируем объект rating как в ProductCardProps
    const products = result.rows.map(row => ({
      ...row,
      basePrice: row.base_price,
      discountPercent: row.discount_percent,
      rating: {
        rate: parseFloat(row.rating_rate) || 0,
        count: parseInt(row.rating_count) || 0
      }
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Ошибка search-full:", error);
    return NextResponse.json({ error: "Ошибка поиска" }, { status: 500 });
  }
}
