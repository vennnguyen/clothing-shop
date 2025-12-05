import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  const customerId = parseInt(params.customerId);

  // Lấy orders
  const [orders]: any[] = await pool.query(
    `SELECT * FROM Orders WHERE customerId = ?`,
    [customerId]
  );

  // Lấy chi tiết đơn hàng cho mỗi order
  for (const order of orders) {
    const [details]: any[] = await pool.query(
      `SELECT * FROM OrderDetails WHERE orderId = ?`,
      [order.id]
    );
    order.details = details;
  }

  return NextResponse.json(orders);
}
