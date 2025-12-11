import { Account } from "../../../types/interfaces";
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db"; 
import bcrypt from 'bcrypt';

// Lấy thông tin tài khoản theo ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const accountId = parseInt(params.id, 10);
        const [rows]: any = await pool.query(`
        SELECT a.id, a.email, a.roleId, a.birthday, a.status, a.createdDate, a.password, r.name as roleName
        FROM accounts a
        JOIN roles r ON a.roleId = r.id
        WHERE a.id = ?
        `, [accountId]);
        if ((rows as any).length === 0) {
            return NextResponse.json({ error: 'Tài khoản không tồn tại' }, { status: 404 });
        }
        return NextResponse.json((rows as any)[0]);
    } catch (error) {
        console.error('GET /accounts/[id] error:', error);
        return NextResponse.json({ error: 'Lỗi khi lấy thông tin tài khoản' }, { status: 500 });
    }
}

//Xóa tài khoản theo ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const accountId = parseInt(params.id, 10);
        //thay đổi status tài khoản
        await pool.query(
            `UPDATE accounts
             SET status = '0'
             WHERE id = ?`,
            [accountId]
        );
        return NextResponse.json({ message: 'Tài khoản đã được xóa' });
    } catch (error) {
        console.error('DELETE /accounts/[id] error:', error);
        return NextResponse.json({ error: 'Lỗi khi xóa tài khoản' }, { status: 500 });
    }
}

// Cập nhật thông tin tài khoản theo ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const accountId = parseInt((await params).id, 10);
        const body: Partial<Account> = await req.json();
        const fields = [];
        const values = [];
        if (body.email) {
            fields.push('email = ?');
            values.push(body.email);
        }
        if (body.fullName) {
            fields.push('fullName = ?');
            values.push(body.fullName);
        }
        if (body.password) {
            fields.push('password = ?');
            const hashedPassword = await bcrypt.hash(body.password, 10);
            values.push(hashedPassword);
        }
        if (body.roleId !== undefined) {
            fields.push('roleId = ?');
            values.push(body.roleId);
        }
        if (body.birthday) {
            fields.push('birthday = ?');
            values.push(body.birthday);
        }
        if (body.status !== undefined) {
            fields.push('status = ?');
            values.push(body.status);
        }
        if (fields.length === 0) {
            return NextResponse.json({ error: 'Không có trường để cập nhật' }, { status: 400 });
        }
        values.push(accountId);
        const sql = `UPDATE accounts SET ${fields.join(', ')} WHERE id = ?`;
        await pool.query(sql, values);
        
        // Lấy account vừa cập nhật có roleName
        const [rows]: any = await pool.query(`
        SELECT a.id, a.email, a.roleId, a.birthday, a.status, a.createdDate, a.fullName, r.name as roleName
        FROM accounts a
        JOIN roles r ON a.roleId = r.id
        WHERE a.id = ?
        `, [accountId]);
        return NextResponse.json({ message: 'Cập nhật tài khoản thành công', account: (rows as any)[0] });
    } catch (error) {
        console.error('PUT /accounts/[id] error:', error);
        return NextResponse.json({ error: error.message || 'Lỗi khi cập nhật tài khoản' }, { status: 500 });
    }
}
