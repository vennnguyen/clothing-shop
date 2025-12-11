// src/app/api/cart/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { RowDataPacket } from "mysql2";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, productId, sizeId, quantity } = body;

        // Validation cơ bản
        if (!userId || !productId || !sizeId || quantity < 1) {
            return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
        }

        // 1. Tìm cartId của user
        const [cartRows] = await pool.query<RowDataPacket[]>(`
            SELECT id FROM Carts WHERE customerId = ?
        `, [userId]);

        if (cartRows.length === 0) {
            return NextResponse.json({ message: 'Giỏ hàng không tồn tại' }, { status: 404 });
        }
        const cartId = cartRows[0].id;

        // 2. Cập nhật số lượng (UPDATE)
        // Phải đúng cả cartId, productId VÀ sizeId
        await pool.query(`
            UPDATE CartDetails 
            SET quantity = ? 
            WHERE cartId = ? AND productId = ? AND sizeId = ?
        `, [quantity, cartId, productId, sizeId]);

        return NextResponse.json({ message: "Cập nhật thành công" }, { status: 200 });
    } catch (error) {
        console.error("Lỗi update cart:", error);
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
    }
}