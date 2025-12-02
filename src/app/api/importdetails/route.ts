import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

// GET /api/importdetails?id=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const importReceiptId = searchParams.get("importReceiptId");
  const productId = searchParams.get("productId");

  let query = "SELECT * FROM importdetails";
  const params: any[] = [];

  if (importReceiptId && productId) {
    query += " WHERE importReceiptId = ? AND productId = ?";
    params.push(importReceiptId, productId);
  } else if (importReceiptId) {
    query += " WHERE importReceiptId = ?";
    params.push(importReceiptId);
  }

  const [rows] = await pool.query(query, params);
  return NextResponse.json(rows);
}

// POST /api/importdetails
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { importReceiptId, productId, quantity, price } = data;

  const [result] = await pool.query(
    "INSERT INTO importdetails (importReceiptId, productId, quantity, price) VALUES (?, ?, ?, ?)",
    [importReceiptId, productId, quantity || null, price || null]
  );

  return NextResponse.json({ importReceiptId, productId, quantity, price });
}


export async function PUT(req: NextRequest) {
  const { importReceiptId, productId, quantity, price } = await req.json();

  await pool.query(
    "UPDATE importdetails SET quantity = ?, price = ? WHERE importReceiptId = ? AND productId = ?",
    [quantity ?? null, price ?? null, importReceiptId, productId]
  );

  return NextResponse.json({
    success: true,
    importReceiptId,
    productId,
    quantity,
    price,
  });
}

// export async function DELETE(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const importReceiptId = searchParams.get("importReceiptId");

//   if (!importReceiptId) {
//     return NextResponse.json({ error: "Thiếu importReceiptId" }, { status: 400 });
//   }

//   await pool.query(
//     "DELETE FROM importdetails WHERE importReceiptId = ?",
//     [Number(importReceiptId)]
//   );

//   return NextResponse.json({ success: true });
// }

export async function DELETE(req: NextRequest) {
  const { importReceiptId, productId } = await req.json();

  await pool.query(
    "DELETE FROM importdetails WHERE importReceiptId = ? AND productId = ?",
    [importReceiptId, productId]
  );

  return NextResponse.json({ success: true });
}