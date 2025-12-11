// src/app/api/cart/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db"; // Đảm bảo đường dẫn đúng tới file db của bạn
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, productId, sizeId } = body;

        if (!userId || !productId || !sizeId) {
            return NextResponse.json({ message: 'Thiếu thông tin' }, { status: 400 });
        }

        // 1. Tìm cartId của user
        const [cartRows] = await pool.query<RowDataPacket[]>(`
            SELECT id FROM carts WHERE customerId = ?
        `, [userId]);

        if (cartRows.length === 0) {
            return NextResponse.json({ message: 'Giỏ hàng không tồn tại' }, { status: 404 });
        }

        const cartId = cartRows[0].id;

        // 2. Xóa sản phẩm khỏi bảng cartdetails
        await pool.query(`
            DELETE FROM cartdetails 
            WHERE cartId = ? AND productId = ? AND sizeId = ?
        `, [cartId, productId, sizeId]);

        return NextResponse.json({ message: "Đã xóa sản phẩm thành công" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Lỗi server khi xóa sản phẩm' }, { status: 500 });
    }
}