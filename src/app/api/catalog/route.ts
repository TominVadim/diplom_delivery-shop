import { query } from "../../../../utils/db";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const result = await query(
      `SELECT 
        id as "_id",
        order_num as "order",
        title,
        img,
        col_span as "colSpan",
        tablet_col_span as "tabletColSpan",
        mobile_col_span as "mobileColSpan"
      FROM catalog
      ORDER BY order_num ASC`
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке каталога" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const updatedCategories: any[] = await request.json();

    // Обновляем каждую категорию
    for (const category of updatedCategories) {
      await query(
        `UPDATE catalog 
         SET 
           order_num = $1,
           title = $2,
           img = $3,
           col_span = $4,
           tablet_col_span = $5,
           mobile_col_span = $6,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $7`,
        [
          category.order,
          category.title,
          category.img,
          category.colSpan,
          category.tabletColSpan,
          category.mobileColSpan,
          parseInt(category._id)
        ]
      );
    }

    return NextResponse.json({
      success: true,
      updatedCount: updatedCategories.length,
    });
  } catch (error) {
    console.error("Ошибка при обновлении порядка категорий:", error);
    return NextResponse.json(
      { message: "Ошибка при обновлении порядка категорий" },
      { status: 500 }
    );
  }
}
