// app/api/importdetails/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

// GET /api/importdetails
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
  const { importReceiptId, productId, quantity, price, sizeId } = data;

  // 1. Thêm vào importdetails
  await pool.query(
    "INSERT INTO importdetails (importReceiptId, productId, quantity, price, sizeId) VALUES (?, ?, ?, ?, ?)",
    [importReceiptId, productId, quantity || 0, price || 0, sizeId]
  );

  // 2. Cập nhật quantity trong productsizes
  await pool.query(
    "UPDATE productsizes SET quantity = quantity + ? WHERE productId = ? AND sizeId = ?",
    [quantity || 0, productId, sizeId]
  );

  return NextResponse.json({ importReceiptId, productId, quantity, price, sizeId });
}

// PUT /api/importdetails
// export async function PUT(req: NextRequest) {
//   const { importReceiptId, productId, quantity, price, sizeId } = await req.json();

//   // 1. Lấy quantity cũ
//   const [rows]: any = await pool.query(
//     "SELECT quantity, sizeId FROM importdetails WHERE importReceiptId = ? AND productId = ?",
//     [importReceiptId, productId]
//   );
//   const oldQuantity = rows[0]?.quantity || 0;
//   const oldSizeId = rows[0]?.sizeId;

//   // 2. Cập nhật importdetails
//   await pool.query(
//     "UPDATE importdetails SET quantity = ?, price = ? WHERE importReceiptId = ? AND productId = ? AND sizeId = ?",
//     [quantity ?? 0, price ?? 0, importReceiptId, productId, sizeId]
//   );

//   // 3. Cập nhật productsizes
//   if (oldSizeId === sizeId) {
//     console.log("1");
    
//     // cùng size => delta = quantity mới - quantity cũ
//     const delta = (quantity || 0) - oldQuantity;
//     await pool.query(
//       "UPDATE productsizes SET quantity = quantity + ? WHERE productId = ? AND sizeId = ?",
//       [delta, productId, sizeId]
//     );
//   } else {
//     console.log("2");

//     // đổi size => trừ cũ + cộng mới
//     await pool.query(
//       "UPDATE productsizes SET quantity = quantity - ? WHERE productId = ? AND sizeId = ?",
//       [oldQuantity, productId, oldSizeId]
//     );
//     await pool.query(
//       "UPDATE productsizes SET quantity = quantity + ? WHERE productId = ? AND sizeId = ?",
//       [quantity || 0, productId, sizeId]
//     );
//   }

//   return NextResponse.json({ success: true, importReceiptId, productId, quantity, price, sizeId });
// }
export async function PUT(req: NextRequest) {
  try {
    const { importReceiptId, productId, quantity, price, sizeId } = await req.json();

    // 1. Lấy quantity cũ cho đúng product + size
    const [rows]: any = await pool.query(
      "SELECT quantity FROM importdetails WHERE importReceiptId = ? AND productId = ? AND sizeId = ?",
      [importReceiptId, productId, sizeId]
    );
    const oldQuantity = rows[0]?.quantity ?? 0; // nếu chưa có => thêm mới

    // 2. Cập nhật importdetails (thêm mới nếu chưa có)
    if (rows.length > 0) {
      // đã tồn tại -> update
      await pool.query(
        "UPDATE importdetails SET quantity = ?, price = ? WHERE importReceiptId = ? AND productId = ? AND sizeId = ?",
        [quantity, price, importReceiptId, productId, sizeId]
      );
    } else {
      // chưa có -> insert
      await pool.query(
        "INSERT INTO importdetails (importReceiptId, productId, sizeId, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [importReceiptId, productId, sizeId, quantity, price]
      );
    }

    // 3. Cập nhật productsizes
    if (oldQuantity) {
      // delta = số lượng mới - số lượng cũ
      const delta = quantity - oldQuantity;
      await pool.query(
        "UPDATE productsizes SET quantity = quantity + ? WHERE productId = ? AND sizeId = ?",
        [delta, productId, sizeId]
      );
    } else {
      // size mới -> cộng vào
      await pool.query(
        "UPDATE productsizes SET quantity = quantity + ? WHERE productId = ? AND sizeId = ?",
        [quantity, productId, sizeId]
      );
    }

    return NextResponse.json({ success: true, importReceiptId, productId, sizeId, quantity, price });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Lỗi khi cập nhật importdetail" }, { status: 500 });
  }
}


// DELETE /api/importdetails
export async function DELETE(req: NextRequest) {
  const { importReceiptId, productId } = await req.json();

  // 1. Lấy thông tin để trừ quantity
  const [rows]: any = await pool.query(
    "SELECT quantity, sizeId FROM importdetails WHERE importReceiptId = ? AND productId = ?",
    [importReceiptId, productId]
  );

  const oldQuantity = rows[0]?.quantity || 0;
  const oldSizeId = rows[0]?.sizeId;

  // 2. Trừ quantity khỏi productsizes
  await pool.query(
    "UPDATE productsizes SET quantity = quantity - ? WHERE productId = ? AND sizeId = ?",
    [oldQuantity, productId, oldSizeId]
  );

  // 3. Xóa importdetail
  await pool.query(
    "DELETE FROM importdetails WHERE importReceiptId = ? AND productId = ?",
    [importReceiptId, productId]
  );

  return NextResponse.json({ success: true });
}
