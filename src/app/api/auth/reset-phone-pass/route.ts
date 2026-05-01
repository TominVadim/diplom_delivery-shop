import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query } from "@/utils/db";

function formatPhoneForDB(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  let cleaned = digits;
  if (cleaned.startsWith('8')) {
    cleaned = '7' + cleaned.slice(1);
  }
  if (cleaned.startsWith('7') && cleaned.length === 11) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { phoneNumber, newPassword } = body;

    if (!phoneNumber || !newPassword) {
      return NextResponse.json(
        { error: "Телефон и пароль обязательны" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 6 символов" },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneForDB(phoneNumber);
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    const result = await query(
      `UPDATE users 
       SET password_hash = $1
       WHERE phone = $2 AND phone_verified = true
       RETURNING id, phone`,
      [passwordHash, formattedPhone]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Пользователь с таким номером не найден или телефон не верифицирован" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Пароль успешно обновлён" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
