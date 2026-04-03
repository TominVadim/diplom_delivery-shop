import { NextResponse } from "next/server";
import { query } from "../../../../utils/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query") || "";

    if (!searchQuery) {
      return NextResponse.json([]);
    }

    const productsResult = await query(
      `SELECT 
        id, img, title, description, 
        base_price as "basePrice", 
        discount_percent as "discountPercent",
        jsonb_build_object('rate', rating_rate, 'count', rating_count) as rating,
        tags, weight, quantity
      FROM products
      WHERE (title ILIKE $1 OR description ILIKE $1)
        AND quantity > 0`,
      [`%${searchQuery}%`]
    );

    const products = productsResult.rows.map(p => ({
      ...p,
      rating: typeof p.rating === 'string' ? JSON.parse(p.rating) : p.rating
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Ошибка поиска:", error);
    return NextResponse.json(
      { error: "Ошибка поиска" },
      { status: 500 }
    );
  }
}
