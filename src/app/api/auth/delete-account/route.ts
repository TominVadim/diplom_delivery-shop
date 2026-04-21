import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../../utils/db";

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
    const { phone, email } = body;

    if (!phone && !email) {
      return NextResponse.json(
        { error: "Необходимо указать телефон или email" },
        { status: 400 }
      );
    }

    let userQuery = "";
    let params: any[] = [];

    if (phone) {
      const formattedPhone = formatPhoneForDB(phone);
      userQuery = "SELECT id FROM users WHERE phone = $1";
      params = [formattedPhone];
    } else if (email) {
      userQuery = "SELECT id FROM users WHERE email = $1";
      params = [email];
    }

    const userResult = await query(userQuery, params);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id;

    await query("DELETE FROM verification_tokens WHERE user_id = $1", [userId]);
    await query("DELETE FROM purchases WHERE user_id = $1", [userId]);
    await query("DELETE FROM users WHERE id = $1", [userId]);

    return NextResponse.json(
      { message: "Аккаунт успешно удален" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении аккаунта:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
