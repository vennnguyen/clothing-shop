
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
    const body = await req.json();
    const { name } = body;

    await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
    return NextResponse.json({ message: "Thêm danh mục thành công" });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name } = body;
    await pool.query(
      "UPDATE categories SET name = ? WHERE id = ?",
      [name, id]
    );

    return NextResponse.json({ message: "Cập nhật danh mục thành công" });

  } catch (error) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}