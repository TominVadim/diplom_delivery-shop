import { NextResponse } from "next/server";
import { query } from "../../../../utils/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    // Ищем пользователя по телефону
    const userResult = await query(
      `SELECT id, phone, name, email, password_hash 
       FROM users 
       WHERE phone = $1`,
      [phone]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Неверный пароль" },
        { status: 401 }
      );
    }

    // Разбираем name на surname и firstName (если есть пробел)
    const nameParts = user.name ? user.name.split(' ') : ['', ''];
    const surname = nameParts[0] || '';
    const firstName = nameParts.slice(1).join(' ') || '';

    const responseData = {
      success: true,
      user: {
        _id: user.id,
        phone: user.phone,
        surname: surname,
        firstName: firstName,
        email: user.email,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
