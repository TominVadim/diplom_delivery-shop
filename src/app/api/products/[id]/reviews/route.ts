import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/pg";

export const dynamic = "force-dynamic";

// GET - получение отзывов для продукта
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Неверный ID продукта" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, user_id, user_name, rating, comment, created_at
         FROM reviews
         WHERE product_id = $1
         ORDER BY created_at DESC`,
        [productId]
      );

      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Ошибка при получении отзывов:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

// POST - добавление нового отзыва
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();
    const { userId, userName, rating, comment } = body;

    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Неверный ID продукта" },
        { status: 400 }
      );
    }

    if (!userId || !userName || !rating || !comment) {
      return NextResponse.json(
        { message: "Заполните все поля" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Рейтинг должен быть от 1 до 5" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");

      // Проверка, не оставлял ли пользователь уже отзыв на этот товар
      const existingReview = await client.query(
        `SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2`,
        [productId, userId]
      );

      if (existingReview.rows.length > 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { message: "Вы уже оставляли отзыв на этот товар" },
          { status: 400 }
        );
      }

      // Добавляем отзыв
      await client.query(
        `INSERT INTO reviews (product_id, user_id, user_name, rating, comment)
         VALUES ($1, $2, $3, $4, $5)`,
        [productId, userId, userName, rating, comment]
      );

      // Обновляем rating_distribution в products
      const productResult = await client.query(
        `SELECT rating_distribution, rating_count, rating_rate
         FROM products WHERE id = $1`,
        [productId]
      );

      if (productResult.rows.length > 0) {
        const product = productResult.rows[0];
        let distribution = product.rating_distribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
        
        // Увеличиваем счетчик для соответствующего рейтинга
        const ratingKey = String(rating);
        distribution[ratingKey] = (distribution[ratingKey] || 0) + 1;
        
        const newCount = (product.rating_count || 0) + 1;
        
        // Пересчитываем средний рейтинг
        let total = 0;
        for (let i = 1; i <= 5; i++) {
          total += i * (distribution[String(i)] || 0);
        }
        const newAverage = total / newCount;
        const roundedAverage = Math.round(newAverage * 10) / 10;

        await client.query(
          `UPDATE products 
           SET rating_distribution = $1, rating_count = $2, rating_rate = $3
           WHERE id = $4`,
          [distribution, newCount, roundedAverage, productId]
        );
      }

      await client.query("COMMIT");
      
      return NextResponse.json({ success: true, message: "Отзыв добавлен" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Ошибка при добавлении отзыва:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
