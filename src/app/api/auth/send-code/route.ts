import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../../utils/db";
import { setResetCode } from "@/lib/resetCodes";

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

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

function getPhoneKey(phone: string): string {
  return phone.replace(/\D/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { phone, type = "reset" } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Телефон обязателен" },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneForDB(phone);

    if (type === "reset") {
      const userCheck = await query(
        `SELECT id FROM users WHERE phone = $1`,
        [formattedPhone]
      );

      if (userCheck.rows.length === 0) {
        return NextResponse.json(
          { error: "Номер телефона не зарегистрирован в системе" },
          { status: 404 }
        );
      }
    }

    const code = generateCode();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const key = getPhoneKey(phone);
    
    setResetCode(key, code, expiresAt);

    console.log(`\n=== Код для восстановления пароля ===`);
    console.log(`Телефон: ${formattedPhone}`);
    console.log(`Ключ для Map: ${key}`);
    console.log(`Код: ${code}`);
    console.log(`Действителен до: ${new Date(expiresAt).toLocaleTimeString()}`);
    console.log(`=====================================\n`);

    return NextResponse.json(
      { success: true, message: "Код отправлен" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
