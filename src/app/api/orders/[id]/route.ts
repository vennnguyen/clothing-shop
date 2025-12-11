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
