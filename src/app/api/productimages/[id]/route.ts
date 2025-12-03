import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import pool from '../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

        // 1. Truy vấn thông tin sản phẩm (Bảng Products)
        const [rows]: any = await pool.query(
            'SELECT * FROM productimages WHERE productId = ?',
            [id]
        );


        return NextResponse.json(rows);

    } catch (error) {
        console.error('GET productsimage Error:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}