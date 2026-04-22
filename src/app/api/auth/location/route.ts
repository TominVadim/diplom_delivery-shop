import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../../utils/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, location } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "ID пользователя обязателен" },
        { status: 400 }
      );
    }

    await query(
      "UPDATE users SET location = $1 WHERE id = $2",
      [location || null, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка обновления города:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
