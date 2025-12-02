import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

// PUT /api/suppliers/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json();
  const { name, address, phone } = data;

  await pool.query(
    "UPDATE suppliers SET name = ?, address = ?, phone = ? WHERE id = ?",
    [name, address, phone, id]
  );
  return NextResponse.json({ id, ...data });
}

// DELETE /api/suppliers/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  await pool.query("DELETE FROM suppliers WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
