import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/pg";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      id,
      name,
      description,
      basePrice,
      discountPercent,
      weight,
      quantity,
      article,
      brand,
      manufacturer,
      isHealthyFood,
      isNonGMO,
      tags,
      img,
    } = body;

    if (!id || !name || !basePrice) {
      return NextResponse.json(
        { error: "Не указаны обязательные поля (id, name, basePrice)" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      const result = await client.query(
        `INSERT INTO products (
          id, name, description, base_price, discount_percent,
          weight, quantity, article, brand, manufacturer,
          is_healthy_food, is_non_gmo, tags, img,
          rating_rate, rating_count, rating_distribution
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING id`,
        [
          id,
          name,
          description || "",
          basePrice,
          discountPercent || 0,
          weight || "",
          quantity || 0,
          article || "",
          brand || "",
          manufacturer || "",
          isHealthyFood || false,
          isNonGMO || false,
          tags || [],
          img || `/images/products/img-${id}.jpeg`,
          0,
          0,
          JSON.stringify({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }),
        ]
      );

      return NextResponse.json({
        success: true,
        product: { id: result.rows[0].id, img: img || `/images/products/img-${id}.jpeg`, name },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Ошибка добавления товара" },
      { status: 500 }
    );
  }
}
