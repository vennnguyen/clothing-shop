
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { Card } from "../../types/interfaces";
//lấy giỏ hàng
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM cards");
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
//thêm giỏ hàng
export async function POST(req: NextRequest) {
  try {
    const card:Card = await req.json();
    const [result] = await pool.query("INSERT INTO cards (customerId) VALUES (?)", [card.customerId]);
    return NextResponse.json({ message: "Tạo thẻ thành công", id: (result as any).insertId });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
