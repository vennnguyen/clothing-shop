import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");

        let sql = `
            SELECT p.*, dt.type_name
            FROM promotions p
            JOIN discount_types dt ON p.discount_type_id = dt.id;
        `
        const [rows] = await pool.query(sql);
        return NextResponse.json(rows);

    } catch (error) {
        return NextResponse.json({ error: "Lỗi khi tải khuyến mãi" }, { status: 500 })
    }
}