import { NextResponse } from "next/server";
import { query } from "../../../../utils/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const {
      phone,
      surname,
      firstName,
      password,
      birthdayDate,
      region,
      location,
      gender,
      card,
      email,
      hasCard,
    } = await request.json();

    // Проверяем, существует ли пользователь с таким телефоном
    const existingUser = await query(
      `SELECT id FROM users WHERE phone = $1`,
      [phone]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "Пользователь с таким телефоном уже существует" },
        { status: 400 }
      );
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const result = await query(
      `INSERT INTO users 
        (phone, name, email, password_hash, birth_date, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING id`,
      [phone, `${surname} ${firstName}`.trim(), email || null, hashedPassword, birthdayDate || null]
    );

    const userId = result.rows[0].id;

    return NextResponse.json(
      {
        success: true,
        userId: userId,
        user: {
          phone,
          surname,
          firstName,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
