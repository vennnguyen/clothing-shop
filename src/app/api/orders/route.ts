
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { Order } from '../../types/interfaces';
import { formatDate, formatMoney, formatPhone } from '../../../utils/format';



//lấy đơn hàng
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    Number(status)
    let sql = `
      SELECT 
        o.id AS orderId,
        o.createdDate,
        o.shippedDate,
        o.cost,

        c.id AS customerId,
        c.fullName,
        c.email,
        c.phone,

        a.houseNumber,
        a.ward,
        a.city,

        s.name AS statusName
      FROM Orders o
      LEFT JOIN Customers c ON o.customerId = c.id
      LEFT JOIN Address a ON o.shippingAddressId = a.id
      LEFT JOIN Status s ON o.statusId = s.id
    `;

    const values: any[] = [];
    const conditions: string[] = [];
    if (status && !isNaN(Number(status))) {
  conditions.push(`o.statusId = ?`);
  values.push(Number(status));
}


    if (search) {
      if (!isNaN(Number(search))) {
        // tìm theo orderId
        conditions.push(`o.id = ?`);
        values.push(Number(search));
      } else {
        // tìm theo tên / phone
        conditions.push(`(c.fullName LIKE ? OR c.phone LIKE ?)`);
        values.push(`%${search}%`, `%${search}%`);
      }
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(" AND ");
    }

    sql += ` ORDER BY o.id ASC`;

    // Lấy đơn hàng
    const [orders]: any = await pool.query(sql, values);

    // Format dữ liệu
    const formattedOrders = orders.map((order: any) => ({
      ...order,
      createdDate: formatDate(order.createdDate),
      shippedDate: order.shippedDate
        ? formatDate(order.shippedDate)
        : null,
      cost: formatMoney(order.cost),
      phone: formatPhone(order.phone),
    }));

    // Lấy chi tiết đơn
    const [details]: any = await pool.query(`
      SELECT *
      FROM orderdetails
    `);

    // Ghép chi tiết vào đơn
    const ordersWithDetails = formattedOrders.map((order: any) => ({
      ...order,
      items: details.filter(
        (d: any) => d.orderId === order.orderId
      ),
    }));

    return NextResponse.json(ordersWithDetails);

  } catch (error) {
    console.error("GET /orders error:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}

// cập nhật đơn 
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