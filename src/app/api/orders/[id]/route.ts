import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
        }

        const [orderRows]: any = await pool.query(
            "SELECT * FROM Orders WHERE id = ?",
            [id]
        );

        const order = orderRows[0];

        if (!order) {
            return NextResponse.json(
                { error: "Không tìm thấy đơn hàng" },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("GET Detail Error:", error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = Number(params.id);
    if (!orderId) {
      return NextResponse.json({ error: "Thiếu orderId" }, { status: 400 });
    }

    const { statusId } = await req.json();

    if (!statusId) {
      return NextResponse.json(
        { error: "Thiếu statusId" },
        { status: 400 }
      );
    }

    // Kiểm tra đơn hàng tồn tại
    const [orders]: any = await pool.query(
      "SELECT id FROM orders WHERE id = ?",
      [orderId]
    );

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Đơn hàng không tồn tại" },
        { status: 404 }
      );
    }

    // Update trạng thái
    await pool.query(
      "UPDATE orders SET statusId = ? WHERE id = ?",
      [statusId, orderId]
    );

    return NextResponse.json({
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}