
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { CardDetail } from "../../types/interfaces";

//chi tiết giỏ hàng
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM carddetails");
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

//thêm chi tiết giỏ hàng
export async function POST(req: NextRequest) {
  try {
    const carddetail:CardDetail = await req.json();
    await pool.query("INSERT INTO carddetails (cardId, productId, quantity) VALUES (?, ?, ?)", [
      carddetail.cardId,
      carddetail.productId,
      carddetail.quantity,
    ]);
    return NextResponse.json({ message: "Thêm chi tiết thẻ thành công" });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
