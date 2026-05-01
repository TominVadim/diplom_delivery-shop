import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import bcrypt from 'bcrypt';

// Функция для конвертации форматированного телефона в формат БД (+7XXXXXXXXXX)
function normalizePhoneForDB(formattedPhone: string): string {
  // Удаляем все нецифровые символы
  const digits = formattedPhone.replace(/\D/g, '');
  
  // Если есть цифры, форматируем как +7XXXXXXXXXX
  if (digits.length >= 11) {
    // Если начинается с 8, заменяем на 7
    let normalized = digits;
    if (normalized.startsWith('8')) {
      normalized = '7' + normalized.slice(1);
    }
    return '+' + normalized;
  }
  
  return formattedPhone;
}

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { message: 'Телефон и пароль обязательны' },
        { status: 400 }
      );
    }

    // Конвертируем из формата "+7 (XXX) XXX-XX-XX" в "+7XXXXXXXXXX"
    const dbPhone = normalizePhoneForDB(phone);
    
    console.log('Phone from form:', phone);
    console.log('Phone for DB query:', dbPhone);

    // Ищем пользователя по телефону в формате БД
    const result = await query(
      `SELECT id, phone, name, email, password_hash, region, location, gender, loyalty_card, has_card, role
       FROM users WHERE phone = $1`,
      [dbPhone]
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
        role: user.role || 'user',
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
