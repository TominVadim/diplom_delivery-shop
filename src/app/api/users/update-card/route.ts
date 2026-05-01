import { NextRequest, NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, cardNumber } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "ID пользователя обязателен" },
        { status: 400 }
      );
    }

    if (!cardNumber || cardNumber.length !== 16) {
      return NextResponse.json(
        { error: "Номер карты должен содержать 16 цифр" },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const userCheck = await query("SELECT id FROM users WHERE id = $1", [userId]);
    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Обновляем номер карты
    await query(
      "UPDATE users SET loyalty_card = $1, has_card = true WHERE id = $2",
      [cardNumber, userId]
    );

    return NextResponse.json({
      success: true,
      message: "Данные карты обновлены",
      cardNumber: cardNumber,
    });
  } catch (error) {
    console.error("Ошибка обновления карты:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
