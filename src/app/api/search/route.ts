import { NextResponse } from "next/server";
import { query } from "../../../../utils/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query") || "";

    if (!searchQuery) {
      return NextResponse.json([]);
    }

    // Поиск товаров по названию или описанию
    const productsResult = await query(
      `SELECT 
        id, 
        title, 
        tags as categories
      FROM products
      WHERE (title ILIKE $1 OR description ILIKE $1)
        AND quantity > 0`,
      [`%${searchQuery}%`]
    );

    const products = productsResult.rows;

    if (!products.length) {
      return NextResponse.json([]);
    }

    // Группировка по категориям (тегам)
    const groupedByCategory: Record<string, any[]> = {};

    for (const product of products) {
      const categories = product.categories || []; // tags в PostgreSQL
      for (const category of categories) {
        const normalizedCategory = category.toLowerCase();

        if (!groupedByCategory[normalizedCategory]) {
          groupedByCategory[normalizedCategory] = [];
        }

        groupedByCategory[normalizedCategory].push({
          id: product.id,
          title: product.title,
          categories: product.categories,
        });
      }
    }

    const result = Object.entries(groupedByCategory).map(
      ([category, products]) => ({
        category,
        products,
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ошибка поиска:", error);
    return NextResponse.json({ error: "Ошибка поиска" }, { status: 500 });
  }
}
