import { NextResponse, NextRequest } from "next/server";
import pool from "../../../../../lib/db";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const orderId = id;
    const conn = await pool.getConnection();

    try {
        // CẬP NHẬT CÂU SELECT: Lấy houseNumber, ward, city từ bảng Address
        const [orderRes] = await conn.query(`
        SELECT 
            o.id, o.createdDate, o.cost, o.statusId,
            c.fullName as customerName, c.phone as customerPhone, c.email as customerEmail,
            st.name as statusName,
            a.houseNumber, a.ward, a.city 
        FROM Orders o
        LEFT JOIN customers c ON o.customerId = c.id
        LEFT JOIN status st ON o.statusId = st.id
        LEFT JOIN address a ON o.shippingAddressId = a.id
        WHERE o.id = ?
    `, [orderId]);

        const order = (orderRes as any)[0];

        if (!order) {
            return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
        }

        // (Phần lấy items giữ nguyên không đổi)
        const [itemsRes] = await conn.query(`
        SELECT 
            od.productId, od.quantity, od.price,
            p.name as productName,
            s.sizeName,
            (SELECT imageUrl FROM productimages pi WHERE pi.productId = p.id AND pi.isMain = 1 LIMIT 1) as image
        FROM orderdetails od
        JOIN products p ON od.productId = p.id
        JOIN sizes s ON od.sizeId = s.id
        WHERE od.orderId = ?
    `, [orderId]);

        return NextResponse.json({ order, items: itemsRes });

    } catch (error: any) {
        console.error("Get Order Detail Error:", error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    } finally {
        conn.release();
    }
}