
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { Customer } from "../../types/interfaces";
//lấy khách hàng
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM customers");
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
//thêm khách hàng
export async function POST(req: NextRequest) {
  try {
    const Customer:Customer = await req.json();
    const createdDate = new Date().toISOString().split("T")[0];
    const [result] = await pool.query(
      "INSERT INTO customers (email, password, createdDate) VALUES (?, ?, ?)",
      [Customer.email, Customer.password, createdDate]
    );
    return NextResponse.json({ message: "Tạo khách hàng thành công", id: (result as any).insertId });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
