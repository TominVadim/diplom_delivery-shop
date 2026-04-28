import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/pg";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: "Не указаны userId или name" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query(
        `UPDATE users SET name = $1 WHERE id = $2`,
        [name.trim(), userId]
      );

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating user name:", error);
    return NextResponse.json(
      { error: "Ошибка обновления имени" },
      { status: 500 }
    );
  }
}
