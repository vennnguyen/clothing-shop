
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { OrderDetail } from "../../types/interfaces";
//lấy chi tiết đơn hàng
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM orderdetails");
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
//thêm chi tiết đơn hàng
export async function POST(req: NextRequest) {
  try {
    const orderdetails:OrderDetail = await req.json();
    await pool.query(
      "INSERT INTO orderdetails (orderId, productId, price, quantity) VALUES (?, ?, ?, ?)",
      [orderdetails.orderId, orderdetails.productId, orderdetails.price, orderdetails.quantity]
    );
    return NextResponse.json({ message: "Thêm chi tiết đơn hàng thành công" });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
