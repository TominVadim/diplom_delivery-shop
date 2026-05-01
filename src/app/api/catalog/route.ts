import { query } from "@/utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET: получение всех категорий, сортировка по order_num
export async function GET() {
  try {
    const result = await query(
      `SELECT 
        id, 
        order_num as "order",
        title, 
        slug, 
        img, 
        col_span as "colSpan",
        tablet_col_span as "tabletColSpan",
        mobile_col_span as "mobileColSpan"
      FROM catalog 
      ORDER BY order_num ASC`
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке каталога" },
      { status: 500 }
    );
  }
}

// POST: обновление порядка категорий (для drag&drop)
export async function POST(request: Request) {
  try {
    const updatedCategories = await request.json();
    
    if (!Array.isArray(updatedCategories)) {
      return NextResponse.json(
        { message: "Некорректный формат данных" },
        { status: 400 }
      );
    }

    // Обновляем order_num для каждой категории
    for (const category of updatedCategories) {
      await query(
        `UPDATE catalog 
         SET order_num = $1 
         WHERE id = $2`,
        [category.order, category.id]
      );
    }

    return NextResponse.json({ success: true, message: "Порядок обновлён" });
  } catch (error) {
    console.error("Ошибка при обновлении порядка каталога:", error);
    return NextResponse.json(
      { message: "Ошибка при обновлении порядка каталога" },
      { status: 500 }
    );
  }
}
