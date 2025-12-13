import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = Number(params.id);

    if (!orderId) {
      return NextResponse.json(
        { error: "Thiếu orderId" },
        { status: 400 }
      );
    }

    /* =========================
       1. Lấy thông tin đơn hàng
    ========================== */
    const [orderRows]: any = await pool.query(
      `
      SELECT
        o.id AS orderId,
        o.createdDate,
        o.shippedDate,
        o.cost,

        c.fullName,
        c.phone,

        s.name AS statusName,

        a.houseNumber,
        a.ward,
        a.city
      FROM orders o
      LEFT JOIN customers c ON o.customerId = c.id
      LEFT JOIN status s ON o.statusId = s.id
      LEFT JOIN address a ON o.shippingAddressId = a.id
      WHERE o.id = ?
      `,
      [orderId]
    );

    if (orderRows.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    const orderInfo = orderRows[0];

    /* =========================
       2. Lấy chi tiết sản phẩm
    ========================== */
    const [items]: any = await pool.query(
      `
      SELECT
        p.id AS productId,
        p.name AS productName,
        s.sizeName,
        od.quantity,
        od.price,

        -- Ảnh chính
        (
          SELECT imageUrl
          FROM productimages
          WHERE productId = p.id AND isMain = true
          LIMIT 1
        ) AS imageUrl
      FROM orderdetails od
      JOIN products p ON od.productId = p.id
      JOIN sizes s ON od.sizeId = s.id
      WHERE od.orderId = ?
      `,
      [orderId]
    );

    /* =========================
       3. Trả dữ liệu
    ========================== */
    return NextResponse.json({
      orderId: orderInfo.orderId,
      createdDate: orderInfo.createdDate,
      shippedDate: orderInfo.shippedDate,
      status: orderInfo.statusName,
      customer: {
        fullName: orderInfo.fullName,
        phone: orderInfo.phone,
      },
      address: {
        houseNumber: orderInfo.houseNumber,
        ward: orderInfo.ward,
        city: orderInfo.city,
      },
      items,
      totalCost: orderInfo.cost,
    });
  } catch (error) {
    console.error("GET order detail error:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}
