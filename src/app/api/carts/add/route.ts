import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, productId, quantity, sizeId } = body;
        console.log(body);
        if (!userId || !productId || !quantity || !sizeId) {
            return NextResponse.json({ message: 'Thiếu thông tin' }, { status: 400 });
        }

        //Kiểm tra xem user đã có trong giỏ hàng chưa
        const [cartRows] = await pool.query<RowDataPacket[]>(`
                SELECT id FROM carts WHERE customerId = ?
            
            `, [userId]);
        let cartId = null;
        if (cartRows.length === 0) {
            //Chưa có giỏ hàng tạo giỏ hàng
            const [result] = await pool.query<ResultSetHeader>(`
                    INSERT INTO carts (customerId) VALUES (?)
                `, [userId]);
            //lấy id vừa tạo
            cartId = result.insertId;
        } else {
            //Đã có giỏ hàng
            cartId = cartRows[0].id;
        }
        //Thêm hoặc cập nhật sản phẩm vào cartDetails
        await pool.query(`
            INSERT INTO CartDetails (cartId, productId, quantity, sizeId) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + ?
        `, [cartId, productId, quantity, sizeId, quantity]);

        return NextResponse.json({ message: "Đã thêm vào giỏ hàng thành công!" }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Lỗi server khi thêm sản phẩm vào giỏ hàng' }, { status: 500 });
    }
}