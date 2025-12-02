import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

// GET chung /api/importreceipts → trả tất cả + chi tiết sản phẩm
export async function GET(req: NextRequest) {
  const [imports] = await pool.query("SELECT * FROM importreceipts");

  const importList = await Promise.all(
    (imports as any).map(async (imp: any) => {
      const [details] = await pool.query(
        "SELECT d.productId, p.name, d.quantity, d.price FROM importdetails d JOIN products p ON d.productId = p.id WHERE d.importReceiptId = ?",
        [imp.id]
      );
      imp.products = details;
      return imp;
    })
  );

  return NextResponse.json(importList);
}

// POST /api/importreceipts
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { createdDate, supplierId, accountId, total, status } = data;

  const [result] = await pool.query(
    "INSERT INTO importreceipts (createdDate, supplierId, accountId, total, status) VALUES (?, ?, ?, ?, ?)",
    [createdDate, supplierId, accountId, total, status || 'Chưa xử lý']
  );

  return NextResponse.json({ id: (result as any).insertId, ...data });
}
