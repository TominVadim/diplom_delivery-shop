import pool from '@/lib/pg';

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Утилита для пагинации
export function getPagination(startIdx: number, perPage: number) {
  return {
    offset: startIdx,
    limit: perPage,
  };
}

// Утилита для фильтрации по цене
export function buildPriceFilter(priceFrom?: string | null, priceTo?: string | null) {
  const conditions: string[] = [];
  const values: number[] = [];
  
  if (priceFrom) {
    conditions.push(`base_price >= $${values.length + 1}`);
    values.push(parseInt(priceFrom));
  }
  if (priceTo) {
    conditions.push(`base_price <= $${values.length + 1}`);
    values.push(parseInt(priceTo));
  }
  
  return {
    whereClause: conditions.length ? `AND ${conditions.join(' AND ')}` : '',
    values,
  };
}
