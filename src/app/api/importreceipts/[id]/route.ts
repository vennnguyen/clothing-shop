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
// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   const id = params.id;

//   // Xóa chi tiết trước (nếu muốn tránh FK constraint)
//   await pool.query("DELETE FROM importdetails WHERE importReceiptId = ?", [id]);

//   // Xóa phiếu nhập
//   await pool.query("DELETE FROM importreceipts WHERE id = ?", [id]);
//   return NextResponse.json({ success: true });
// }

// DELETE /api/importreceipts/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const importReceiptId = params.id;

  try {
    // 1. Lấy tất cả chi tiết của phiếu nhập
    const [details]: any = await pool.query(
      "SELECT productId, sizeId, quantity FROM importdetails WHERE importReceiptId = ?",
      [importReceiptId]
    );

    // 2. Trừ số lượng tương ứng trong productsizes
    await Promise.all(
      details.map((item: { productId: number; sizeId: number; quantity: number }) =>
        pool.query(
          "UPDATE productsizes SET quantity = quantity - ? WHERE productId = ? AND sizeId = ?",
          [item.quantity, item.productId, item.sizeId]
        )
      )
    );

    // 3. Xóa chi tiết import
    await pool.query("DELETE FROM importdetails WHERE importReceiptId = ?", [importReceiptId]);

    // 4. Xóa phiếu nhập
    await pool.query("DELETE FROM importreceipts WHERE id = ?", [importReceiptId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Lỗi khi xóa phiếu nhập" }, { status: 500 });
  }
}
