import { Role } from "../../types/interfaces";
import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import { ResultSetHeader } from "mysql2";

// Lấy tất cả vai trò
export async function GET() {
    try {
        const [rows]: any = await pool.query('SELECT id, name FROM roles ORDER BY id ASC');
        return NextResponse.json(rows as Role[]);
    } catch (error) {
        console.error('GET /role error:', error);
        return NextResponse.json({ error: 'Lỗi khi lấy danh sách vai trò' }, { status: 500 });
    }
}

// Thêm vai trò mới
export async function POST(request: Request) {
    try {
        const body: Role = await request.json();
        const { name } = body;
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO roles (name) VALUES (?)',
            [name]
        );
        return NextResponse.json({ id: result.insertId, name }, { status: 201 });
    } catch (error) {
        console.error('POST /role error:', error);
        return NextResponse.json({ error: 'Lỗi khi thêm vai trò' }, { status: 500 });
    }
}

// Cập nhật vai trò
export async function PUT(request: Request) {
    try {
        const body: Role = await request.json();
        const { id, name } = body;
        await pool.query(
            'UPDATE roles SET name = ? WHERE id = ?',
            [name, id]
        );
        return NextResponse.json({ message: 'Cập nhật vai trò thành công' });
    } catch (error) {
        console.error('PUT /role error:', error);
        return NextResponse.json({ error: 'Lỗi khi cập nhật vai trò' }, { status: 500 });;
    }
}

// Xóa vai trò
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id'); 
        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID vai trò' }, { status: 400 });
        }

        await pool.query('DELETE FROM roles WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Xóa vai trò thành công' });
    } catch (error) {
        console.error('DELETE /role error:', error);
        return NextResponse.json({ error: 'Lỗi khi xóa vai trò' }, { status: 500 });
    }
}
