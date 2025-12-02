import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

// =============================
// GET importdetail (theo body)
// =============================
export async function GET(req: NextRequest) {
  const { importReceiptId, productId } = await req.json();

  const [rows] = await pool.query(
    "SELECT * FROM importdetails WHERE importReceiptId = ? AND productId = ?",
    [importReceiptId, productId]
  );

  return NextResponse.json(rows[0] || null);
}

// =============================
// PUT update importdetail
// =============================


// =============================
// DELETE importdetail
// =============================
export async function DELETE(req: NextRequest) {
  const { importReceiptId, productId } = await req.json();

  await pool.query(
    "DELETE FROM importdetails WHERE importReceiptId = ? AND productId = ?",
    [importReceiptId, productId]
  );

  return NextResponse.json({ success: true });
}
