import { NextResponse } from "next/server";
import { query } from "../../../../utils/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      name,
      phone,
      birthDate,
      region,
      location,
      gender,
      loyaltyCard,
    } = await request.json();

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users
        (phone, name, email, password_hash, birth_date, region, location, gender, loyalty_card, created_at, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, true)
       RETURNING id`,
      [phone, name, email || null, hashedPassword, birthDate || null, region || null, location || null, gender || null, loyaltyCard || null]
    );

    const userId = result.rows[0].id;

    return NextResponse.json(
      {
        success: true,
        userId: userId,
        user: {
          phone,
          name,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return NextResponse.json(
      { error: "Ошибка регистрации" },
      { status: 500 }
    );
  }
}
