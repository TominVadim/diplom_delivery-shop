import { CONFIG } from "@/config/config";
import { query } from "@/utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const articlesLimit = url.searchParams.get("articlesLimit");
    const startIdx = parseInt(url.searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      url.searchParams.get("perPage") ||
        CONFIG.ITEMS_PER_PAGE_MAIN_ARTICLES.toString()
    );

    // Получение ограниченного количества статей (для главной)
    if (articlesLimit) {
      const limit = parseInt(articlesLimit);
      const result = await query(
        `SELECT id, img, title, text, created_at as "createdAt"
         FROM articles
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );
      return NextResponse.json(result.rows);
    }

    // Пагинированный список статей
    const countResult = await query(`SELECT COUNT(*) FROM articles`);
    const totalCount = parseInt(countResult.rows[0].count);

    const articlesResult = await query(
      `SELECT id, img, title, text, created_at as "createdAt"
       FROM articles
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [perPage, startIdx]
    );

    return NextResponse.json({ articles: articlesResult.rows, totalCount });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке статей" },
      { status: 500 }
    );
  }
}
