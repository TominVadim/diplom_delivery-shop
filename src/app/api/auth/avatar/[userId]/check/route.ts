import { NextRequest, NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    const result = await query("SELECT avatar FROM users WHERE id = $1", [userId]);

    const exists = result.rows.length > 0 && result.rows[0].avatar !== null;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error checking avatar:", error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
