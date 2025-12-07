import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { checkDependencies } from "../../../../lib/db-utils";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    try {
        const categoryId = params.id;
        if (!categoryId) {
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

        const dependencyChecks = [
            {
                table: "products",
                column: "categoryId",
                type: "HAS_PRODUCT",
                message: "Danh mục đã có sản phẩm. Không thể xóa!"
            }
        ];

        const conflictError = await checkDependencies(pool, id, dependencyChecks);
        if (conflictError) {
            return NextResponse.json({
                type: conflictError.type,
                message: conflictError.message,
            }, { status: 409 })
        }

        await pool.query(`DELETE FROM categories WHERE id = ? `, [id]);

        return NextResponse.json({ message: "Xóa thành công!" }, { status: 200 });
    } catch (error) {
        console.error('DELETE Error:', error);
        return NextResponse.json({ error: 'Lỗi server khi xóa danh mục' }, { status: 500 });
    }

}