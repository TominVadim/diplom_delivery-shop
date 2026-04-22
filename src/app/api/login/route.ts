import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../utils/db';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { message: 'Телефон и пароль обязательны' },
        { status: 400 }
      );
    }

    // Ищем пользователя по телефону
    const result = await query(
      `SELECT id, phone, name, email, password_hash, region, location, gender, loyalty_card, has_card
       FROM users WHERE phone = $1`,
      [phone]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Сравниваем пароль с хэшем
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Неверный пароль' },
        { status: 401 }
      );
    }

    // Возвращаем данные пользователя (без пароля)
    const responseData = {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        region: user.region,
        location: user.location,
        gender: user.gender,
        loyalty_card: user.loyalty_card,
        has_card: user.has_card,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
