import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    
    try {
        const categoryId = params.id;
        if(!categoryId) {
            return new Response(JSON.stringify({ error: 'Thiếu ID danh mục' }), { status: 400 });
        }
        const [res]: any = await pool.query(
            'SELECT * FROM products WHERE categoryId = ?',
            [categoryId]
        )
        const product = res[0];
        
                if (!product) {
                    return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
                }
                return new Response(JSON.stringify(product), { status: 200 });
    }
    catch (error) {
        console.error('GET Category Error:', error);
        return new Response(JSON.stringify({ error: 'Lỗi server' }), { status: 500 });
    }
}