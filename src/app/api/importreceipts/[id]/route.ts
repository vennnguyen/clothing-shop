import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

// GET /api/importreceipts/:id → trả cả chi tiết sản phẩm
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  // Lấy phiếu nhập
  const [imports] = await pool.query("SELECT * FROM importreceipts WHERE id = ?", [id]);
  if ((imports as any).length === 0) return NextResponse.json(null);

  const importData = (imports as any)[0];

  // Lấy chi tiết sản phẩm
  const [details] = await pool.query(
    "SELECT d.productId, p.name, d.quantity, d.price FROM importdetails d JOIN products p ON d.productId = p.id WHERE d.importReceiptId = ?",
    [id]
  );

  importData.products = details;
  return NextResponse.json(importData);
}

// PUT /api/importreceipts/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json();
  const { createdDate, supplierId, accountId, total, status } = data;

  await pool.query(
    "UPDATE importreceipts SET createdDate = ?, supplierId = ?, accountId = ?, total = ?, status = ? WHERE id = ?",
    [createdDate, supplierId, accountId, total, status, id]
  );

  return NextResponse.json({ id, ...data });
}

// DELETE /api/importreceipts/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  // Xóa chi tiết trước (nếu muốn tránh FK constraint)
  await pool.query("DELETE FROM importdetails WHERE importReceiptId = ?", [id]);

  // Xóa phiếu nhập
  await pool.query("DELETE FROM importreceipts WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
