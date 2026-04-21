import { NextRequest, NextResponse } from "next/server";
import { getResetCode, deleteResetCode } from "@/lib/resetCodes";

function getPhoneKey(phone: string): string {
  return phone.replace(/\D/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { phone, code } = body;

    console.log("=== DEBUG verify-code ===");
    console.log("Received phone:", phone);
    console.log("Received code:", code);

    if (!phone || !code) {
      return NextResponse.json(
        { error: "Телефон и код обязательны" },
        { status: 400 }
      );
    }

    const key = getPhoneKey(phone);
    console.log("Generated key:", key);
    
    const stored = getResetCode(key);
    console.log("Stored code:", stored);

    if (!stored) {
      return NextResponse.json(
        { error: "Код не найден. Запросите новый код" },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      deleteResetCode(key);
      return NextResponse.json(
        { error: "Код просрочен. Запросите новый код" },
        { status: 400 }
      );
    }

    if (stored.code !== code) {
      console.log("Code mismatch:", stored.code, "!=", code);
      return NextResponse.json(
        { error: "Неверный код подтверждения" },
        { status: 400 }
      );
    }

    deleteResetCode(key);

    return NextResponse.json(
      { success: true, message: "Код подтверждён" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
