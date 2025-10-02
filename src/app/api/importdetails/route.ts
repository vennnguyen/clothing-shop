
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { ImportDetail } from "../../types/interfaces";
//lấy chi tiết nhập hàng
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM importdetails");
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
//thêm chi tiết nhập hàng
export async function POST(req: NextRequest) {
  try {
    const importdetails:ImportDetail = await req.json();
    await pool.query(
      "INSERT INTO importdetails (productId, supplierId, quantity, price) VALUES (?, ?, ?, ?)",
      [importdetails.productId, importdetails.supplierId, importdetails.quantity, importdetails.price]
    );
    return NextResponse.json({ message: "Thêm chi tiết nhập hàng thành công" });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
