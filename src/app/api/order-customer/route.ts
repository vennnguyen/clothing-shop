import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
    const connection = await pool.getConnection();

    try {
        const body = await req.json();
        const { userId, addressId, items, totalCost } = body;

        if (!userId || !addressId || !items || items.length === 0) {
            return NextResponse.json({ message: 'Thiếu thông tin đơn hàng' }, { status: 400 });
        }
        await connection.beginTransaction();

        const [orderRes] = await connection.query<ResultSetHeader>(`
            INSERT INTO orders (createdDate, shippingAddressId, statusId, cost, customerId) 
            VALUES (NOW(), ?, 1, ?, ?)
        `, [addressId, totalCost, userId]);

        const orderId = orderRes.insertId;

        for (const item of items) {
            // 2. Thêm chi tiết đơn hàng
            await connection.query(`
                INSERT INTO OrderDetails (orderId, productId, sizeId, price, quantity) 
                VALUES (?, ?, ?, ?, ?)
            `, [orderId, item.id, item.sizeId, item.price, item.quantity]);

            // 3. Trừ tồn kho (CÓ KIỂM TRA ĐỦ SỐ LƯỢNG KHÔNG)
            // Thêm điều kiện: AND quantity >= ?
            const [updateRes] = await connection.query<ResultSetHeader>(`
                UPDATE ProductSizes 
                SET quantity = quantity - ? 
                WHERE productId = ? AND sizeId = ? AND quantity >= ?
            `, [item.quantity, item.id, item.sizeId, item.quantity]);

            // Nếu affectedRows === 0 nghĩa là không tìm thấy dòng nào thỏa mãn (do hết hàng hoặc sai ID)
            if (updateRes.affectedRows === 0) {
                // Ném lỗi để nhảy xuống catch -> Rollback ngay lập tức
                throw new Error(`Sản phẩm (ID: ${item.id}, Size: ${item.sizeId}) không đủ số lượng tồn kho!`);
            }
        }

        const [cartRows] = await connection.query<RowDataPacket[]>(
            `SELECT id FROM carts WHERE customerId = ?`, [userId]
        );
        if (cartRows.length > 0) {
            const cartId = cartRows[0].id;
            await connection.query(`DELETE FROM cartdetails WHERE cartId = ?`, [cartId]);
        }

        await connection.commit();

        return NextResponse.json({ message: "Đặt hàng thành công" }, { status: 200 });

    } catch (error) {
        await connection.rollback();
        console.error("Lỗi tạo đơn hàng:", error);
        return NextResponse.json({ message: 'Lỗi server khi tạo đơn hàng' }, { status: 500 });
    } finally {
        connection.release();
    }
}