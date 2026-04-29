import { NextResponse } from "next/server";
import { query } from "../../../../utils/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query") || "";

    if (!searchQuery || searchQuery.length < 2) {
      return NextResponse.json([]);
    }

    // Поиск товаров по названию или описанию
    const productsResult = await query(
      `SELECT
        id,
        name,
        description,
        base_price as "basePrice",
        discount_percent as "discountPercent",
        img,
        tags
      FROM products
      WHERE (name ILIKE $1 OR description ILIKE $1)
        AND quantity > 0
      LIMIT 20`,
      [`%${searchQuery}%`]
    );

    const products = productsResult.rows;

    // Преобразуем данные для удобного использования
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      discountPercent: product.discountPercent,
      img: product.img,
      tags: product.tags || [],
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Ошибка поиска:", error);
    return NextResponse.json({ error: "Ошибка поиска" }, { status: 500 });
  }
}
