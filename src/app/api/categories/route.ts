
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { Category } from "../../types/interfaces";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
//thêm danh mục
export async function POST(req: NextRequest) {
  try {
    const category:Category = await req.json();
    const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)", [category.name]);
    return NextResponse.json({ message: "Tạo danh mục thành công", id: (result as any).insertId });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
