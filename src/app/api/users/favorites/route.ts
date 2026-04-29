import { NextRequest, NextResponse } from "next/server";
import { query } from "@/utils/db";

// GET - получение списка избранных товаров пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }

    const result = await query(
      "SELECT favorites FROM users WHERE id = $1",
      [parseInt(userId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ favorites: [] });
    }

    return NextResponse.json({
      favorites: result.rows[0].favorites || [],
    });
  } catch (error) {
    console.error("Ошибка получения избранного:", error);
    return NextResponse.json(
      { error: "Ошибка получения избранного" },
      { status: 500 }
    );
  }
}

// POST - добавление или удаление товара из избранного
export async function POST(request: NextRequest) {
  try {
    const { userId, productId, action } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "userId и productId обязательны" },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(userId);
    const productIdNum = parseInt(productId);

    if (action === "add") {
      // Добавляем productId в массив favorites, если его там ещё нет
      await query(
        `UPDATE users 
         SET favorites = array_append(favorites, $1)
         WHERE id = $2 AND NOT ($1 = ANY(favorites))`,
        [productIdNum, userIdNum]
      );
    } else if (action === "remove") {
      // Удаляем productId из массива favorites
      await query(
        `UPDATE users 
         SET favorites = array_remove(favorites, $1)
         WHERE id = $2`,
        [productIdNum, userIdNum]
      );
    } else {
      return NextResponse.json(
        { error: "Неверное действие. Используйте 'add' или 'remove'" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка изменения избранного:", error);
    return NextResponse.json(
      { error: "Ошибка изменения избранного" },
      { status: 500 }
    );
  }
}
