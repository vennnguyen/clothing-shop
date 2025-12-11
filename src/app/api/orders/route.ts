
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { Order } from '../../types/interfaces';
import { formatDateTime, formatMoney, formatPhone } from '../../../utils/format';


//tạo đơn hàng
// export async function POST(req: NextRequest) {
//   try {
//     const body: Order = await req.json();

//     if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
//       return NextResponse.json({ error: 'Đơn hàng phải có ít nhất 1 sản phẩm' }, { status: 400 });
//     }


//     const createdDate = new Date().toISOString().split('T')[0];
//     const shippedDate = body.shippedDate || null;
//     const status = body.status || 1; //mặc định là 1 - Chưa xử lý

//     //insert vào bảng orders
//     const [orderResult] = await pool.query(
//       'INSERT INTO orders (createdDate, shippedDate, status, cost) VALUES (?, ?, ?, ?)',
//       [createdDate, shippedDate, status, body.cost]
//     );

//     const orderId = (orderResult as any).insertId;

//     //insert từng item vào orderdetails
//     for (const item of body.items) {
//       await pool.query(
//         'INSERT INTO orderdetails (orderId, productId, price, quantity) VALUES (?, ?, ?, ?)',
//         [orderId, item.productId, item.price, item.quantity]
//       );
//     }

//     return NextResponse.json({ message: 'Tạo đơn hàng thành công', orderId });
//   } catch (error) {
//     console.error('POST /orders error:', error);
//     return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
//   }
// }
//lấy đơn hàng
export async function GET() {
  try {
    //lấy tất cả đơn hàng
    const [orders] = await pool.query(`
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
    ORDER BY o.createdDate DESC
`);
    // const [orders] = await pool.query('SELECT * FROM products')
    // Format ngày
    const formattedOrders = (orders as any[]).map((order) => ({
      ...order,
      createdDate: formatDateTime(order.createdDate),
      shippedDate: order.shippedDate ? formatDateTime(order.shippedDate) : null,
      cost: formatMoney(order.cost),
      phone: formatPhone(order.phone),
    }));

    const [details] = await pool.query('SELECT * FROM orderdetails');

    //ghép chi tiết vào đơn hàng
    const ordersWithDetails = (formattedOrders as any[]).map(order => ({
      ...order,
      items: (details as any[]).filter(d => d.orderId === order.id),
    }));

    return NextResponse.json(ordersWithDetails);
  } catch (error) {
    console.error('GET /orders error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
