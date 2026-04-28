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
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID товара не указан" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE products SET
          name = $1,
          description = $2,
          base_price = $3,
          discount_percent = $4,
          weight = $5,
          quantity = $6,
          article = $7,
          brand = $8,
          manufacturer = $9,
          is_healthy_food = $10,
          is_non_gmo = $11,
          tags = $12
         WHERE id = $13`,
        [
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
          id,
        ]
      );

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Ошибка обновления товара" },
      { status: 500 }
    );
  }
}
