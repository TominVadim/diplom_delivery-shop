import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const offset = (page - 1) * pageSize;
    
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sort = searchParams.get('sort') || 'desc';
    
    const managerRegion = searchParams.get('managerRegion');
    const managerLocation = searchParams.get('managerLocation');
    const role = searchParams.get('role');
    
    const whereConditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;
    
    if (role) {
      whereConditions.push(`role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }
    
    if (managerLocation && managerRegion) {
      whereConditions.push(`location = $${paramIndex}`);
      params.push(managerLocation);
      paramIndex++;
      whereConditions.push(`region = $${paramIndex}`);
      params.push(managerRegion);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    // Получаем общее количество
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM users 
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // Сортировка
    let orderByClause = '';
    const sortField = sortBy === 'userId' ? 'id' : sortBy;
    orderByClause = `ORDER BY ${sortField} ${sort === 'asc' ? 'ASC' : 'DESC'}`;
    
    // Получаем пользователей с пагинацией
    const usersQuery = `
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        birth_date, 
        location, 
        region, 
        gender, 
        role, 
        email_verified, 
        phone_verified, 
        created_at
      FROM users 
      ${whereClause}
      ${orderByClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    params.push(pageSize, offset);
    const usersResult = await query(usersQuery, params);
    
    const users = usersResult.rows.map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      birthDate: user.birth_date,
      location: user.location || '',
      region: user.region || '',
      gender: user.gender || '',
      role: user.role || 'user',
      emailVerified: user.email_verified,
      phoneVerified: user.phone_verified,
      createdAt: user.created_at,
    }));
    
    return NextResponse.json({
      users,
      totalCount,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    return NextResponse.json(
      { error: 'Ошибка получения списка пользователей' },
      { status: 500 }
    );
  }
}
