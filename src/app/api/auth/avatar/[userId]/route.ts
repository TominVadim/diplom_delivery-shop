import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../../../utils/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "ID пользователя обязателен" },
        { status: 400 }
      );
    }

    const result = await query("SELECT avatar FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0 || !result.rows[0].avatar) {
      return NextResponse.json(
        { error: "Аватар не найден" },
        { status: 404 }
      );
    }

    const avatarData = result.rows[0].avatar;
    const base64Data = avatarData.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Ошибка получения аватара:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
