import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

// GET /api/suppliers?id=...&name=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  let query = "SELECT * FROM suppliers";
  const params: any[] = [];

  if (id) {
    query += " WHERE id = ?";
    params.push(id);
  } else if (name) {
    query += " WHERE name LIKE ?";
    params.push(`%${name}%`);
  }

  const [rows] = await pool.query(query, params);
  return NextResponse.json(rows);
}

// POST /api/suppliers
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, address, phone } = data;
  const [result] = await pool.query(
    "INSERT INTO suppliers (name, address, phone) VALUES (?, ?, ?)",
    [name, address, phone]
  );
  return NextResponse.json({ id: (result as any).insertId, ...data });
}
