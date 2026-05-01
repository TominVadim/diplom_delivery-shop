import { NextRequest, NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("avatar") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Файл и ID пользователя обязательны" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Пожалуйста, выберите изображение" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Размер файла не должен превышать 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type;
    const avatarData = `data:${mimeType};base64,${base64}`;

    await query("UPDATE users SET avatar = $1 WHERE id = $2", [avatarData, userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка загрузки аватара:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
