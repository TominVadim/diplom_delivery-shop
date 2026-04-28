import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/pg";
import fs from "fs/promises";
import path from "path";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body.id;

    if (!productId) {
      return NextResponse.json(
        { error: "ID товара не указан" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const imgResult = await client.query(
        `SELECT img FROM products WHERE id = $1`,
        [productId]
      );

      await client.query(`DELETE FROM products WHERE id = $1`, [productId]);

      if (imgResult.rows[0]?.img) {
        const imgPath = imgResult.rows[0].img;
        const filename = path.basename(imgPath);
        const fullPath = path.join(process.cwd(), "public", "images", "products", filename);
        try {
          await fs.unlink(fullPath);
        } catch (err) {
          console.error("Ошибка удаления файла изображения:", err);
        }
      }

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Ошибка удаления товара" },
      { status: 500 }
    );
  }
}
