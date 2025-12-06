
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { Category } from "../../types/interfaces";
import { CalendarPlus } from "lucide-react";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    let sql = `
      SELECT * 
      FROM categories cat
    `;

    const values: any[] = [];
    if (search) {
      if (!isNaN(Number(search))) {
        sql += ` WHERE cat.id = ?`;
        values.push(Number(search));
      } else {
        sql += ` WHERE cat.name LIKE ?`;
        values.push(`%${search}%`);
      }
    }
    const [rows] = await pool.query(sql, values);
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
    if (!name || name.trim() === "") {
      return NextResponse.json({ message: "Tên danh mục không được để trống!" }, { status: 400 });
    }

    const [check] = await pool.query(`SELECT id FROM categories WHERE name = ?`, [name.trim()])
    if (Array.isArray(check) && check.length > 0) {
      return NextResponse.json({ message: "Tên danh mục đã tồn tại!" }, { status: 409 });
    }
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