import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { RowDataPacket } from "mysql2";

//chi tiết giỏ hàng
export async function GET(req: NextRequest, { params }: { params: { customerId: string } }) {
    try {
        const { customerId } = await params;
        if (!customerId) return NextResponse.json({ message: "Thiếu ID" });
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT cd.productId, cd.quantity, cd.sizeId 
            FROM cartdetails cd
            JOIN carts c ON cd.cartId = c.id            
            WHERE c.customerId = ?
        `, [customerId]);
        return NextResponse.json(rows);
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}