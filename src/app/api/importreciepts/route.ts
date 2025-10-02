
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { ImportReciept } from "../../types/interfaces";
//lấy phiếu nhập
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM importreciepts");
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
//thêm phiếu nhập
export async function POST(req: NextRequest) {
  try {
    const importreciepts:ImportReciept = await req.json();
    const date = new Date().toISOString().split("T")[0];
    const [result] = await pool.query(
      "INSERT INTO importreciepts (createdDate, supplierId, accountId, cost) VALUES (?, ?, ?, ?)",
      [date, importreciepts.supplierId, importreciepts.accountId, importreciepts.cost]
    );
    return NextResponse.json({ message: "Tạo phiếu nhập thành công", id: (result as any).insertId });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
