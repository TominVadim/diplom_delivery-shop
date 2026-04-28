import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/pg";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const brand = searchParams.get("brand");
    const productId = searchParams.get("productId");
    const limit = parseInt(searchParams.get("limit") || "4");

    if (!brand || !productId) {
      return NextResponse.json(
        { message: "Не указаны параметры brand или productId" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT 
          id, 
          name, 
          img, 
          base_price as "basePrice", 
          discount_percent as "discountPercent",
          jsonb_build_object('rate', rating_rate, 'count', rating_count) as rating,
          tags
        FROM products 
        WHERE id != $1 
          AND brand = $2
        ORDER BY RANDOM()
        LIMIT $3`,
        [parseInt(productId), brand, limit]
      );

      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Ошибка при получении товаров бренда:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
