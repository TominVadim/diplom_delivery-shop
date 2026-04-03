import { CONFIG } from "../../../../../config/config";
import { query } from "../../../../../utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userPurchasesLimit = url.searchParams.get("userPurchasesLimit");
    const startIdx = parseInt(url.searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      url.searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE.toString()
    );

    // TODO: Временно берем первого пользователя (потом заменим на авторизованного)
    const userResult = await query(`SELECT id FROM users LIMIT 1`);
    
    if (userResult.rows.length === 0) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }
    
    const userId = userResult.rows[0].id;

    // Получаем ID купленных товаров
    const purchasesResult = await query(
      `SELECT product_id FROM purchases WHERE user_id = $1 ORDER BY purchase_date DESC`,
      [userId]
    );
    
    if (purchasesResult.rows.length === 0) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }
    
    const productIds = purchasesResult.rows.map(p => p.product_id);
    const totalCount = productIds.length;

    // Если запрошен лимит (для главной страницы)
    if (userPurchasesLimit) {
      const limit = parseInt(userPurchasesLimit);
      const limitedIds = productIds.slice(0, limit);
      
      const productsResult = await query(
        `SELECT 
          id, img, title, description, 
          base_price as "basePrice", 
          discount_percent as "discountPercent",
          jsonb_build_object('rate', rating_rate, 'count', rating_count) as rating,
          tags, weight, quantity
        FROM products 
        WHERE id = ANY($1::int[])`,
        [limitedIds]
      );
      
      const products = productsResult.rows.map(p => ({
        ...p,
        rating: typeof p.rating === 'string' ? JSON.parse(p.rating) : p.rating
      }));
      
      return NextResponse.json(products);
    }

    // Пагинированный список
    const paginatedIds = productIds.slice(startIdx, startIdx + perPage);
    
    const productsResult = await query(
      `SELECT 
        id, img, title, description, 
        base_price as "basePrice", 
        discount_percent as "discountPercent",
        jsonb_build_object('rate', rating_rate, 'count', rating_count) as rating,
        tags, weight, quantity
      FROM products 
      WHERE id = ANY($1::int[])`,
      [paginatedIds]
    );
    
    // Сохраняем порядок как в массиве productIds
    const productsMap = new Map();
    productsResult.rows.forEach(p => productsMap.set(p.id, p));
    
    const products = paginatedIds.map(id => {
      const p = productsMap.get(id);
      return {
        ...p,
        rating: typeof p?.rating === 'string' ? JSON.parse(p.rating) : p?.rating
      };
    }).filter(Boolean);

    return NextResponse.json({ products, totalCount });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке купленных продуктов" },
      { status: 500 }
    );
  }
}
