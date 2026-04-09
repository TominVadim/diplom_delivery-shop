import { CONFIG } from "../../../../../config/config";
import { query } from "../../../../../utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userPurchasesLimit = url.searchParams.get("userPurchasesLimit");
    
    let page = parseInt(url.searchParams.get("page") || "1");
    let limit = parseInt(url.searchParams.get("limit") || CONFIG.ITEMS_PER_PAGE.toString());

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = CONFIG.ITEMS_PER_PAGE;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    const userResult = await query(`SELECT id FROM users LIMIT 1`);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    const userId = userResult.rows[0].id;

    const purchasesResult = await query(
      `SELECT product_id FROM purchases WHERE user_id = $1 ORDER BY purchase_date DESC`,
      [userId]
    );

    if (purchasesResult.rows.length === 0) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    const productIds = purchasesResult.rows.map(p => p.product_id);
    const totalCount = productIds.length;

    if (userPurchasesLimit) {
      const rLimit = parseInt(userPurchasesLimit);
      const limitedIds = productIds.slice(0, rLimit);

      if (limitedIds.length === 0) {
        return NextResponse.json([]);
      }

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

      const productsMap = new Map();
      productsResult.rows.forEach(p => productsMap.set(p.id, p));

      const products = limitedIds.map(id => {
        const p = productsMap.get(id);
        return {
          ...p,
          rating: typeof p?.rating === 'string' ? JSON.parse(p.rating) : p?.rating
        };
      }).filter(Boolean);

      return NextResponse.json(products);
    }

    const paginatedIds = productIds.slice(offset, offset + limit);

    if (paginatedIds.length === 0) {
      return NextResponse.json({ products: [], totalCount });
    }

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
