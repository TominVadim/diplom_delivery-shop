import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const userId = parseInt(resolvedParams.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      );
    }
    
    const { role } = await request.json();
    
    if (!role || !['user', 'admin', 'manager'].includes(role)) {
      return NextResponse.json(
        { error: 'Неверная роль' },
        { status: 400 }
      );
    }
    
    const userCheck = await query(
      'SELECT id, role FROM users WHERE id = $1',
      [userId]
    );
    
    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    await query(
      'UPDATE users SET role = $1 WHERE id = $2',
      [role, userId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Роль успешно обновлена',
      user: {
        id: userId,
        role: role,
      },
    });
  } catch (error) {
    console.error('Ошибка обновления роли:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления роли' },
      { status: 500 }
    );
  }
}
