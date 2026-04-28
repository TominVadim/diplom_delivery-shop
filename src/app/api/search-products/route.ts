import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/pg";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query || query.trim().length < 3) {
      return NextResponse.json([], { status: 400 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
          id, name, article, base_price, quantity
         FROM products
         WHERE name ILIKE $1 OR article::text ILIKE $1
         ORDER BY name
         LIMIT 50`,
        [`%${query}%`]
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Search products error:", error);
    return NextResponse.json(
      { error: "Ошибка поиска товаров" },
      { status: 500 }
    );
  }
}
