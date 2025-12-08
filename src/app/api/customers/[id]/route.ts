import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (isNaN(Number(id))) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Lấy customer theo id
    const [rows]: any = await pool.query(
      `SELECT *
       FROM customers
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy customer" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET Customer Error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
