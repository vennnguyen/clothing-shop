import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM Sizes ORDER BY id ASC");

    return NextResponse.json(
      { success: true, data: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /sizes error:", error);

    return NextResponse.json(
      { success: false, message: "Không lấy được danh sách size" },
      { status: 500 }
    );
  }
}
