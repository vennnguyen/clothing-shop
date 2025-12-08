import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { emailRegex, phoneRegex } from '../../../lib/validator';
import { Account } from '../../types/interfaces';


 //Lấy tất cả tài khoản
export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT a.id, a.email, a.roleId, a.birthday, a.status, a.createdDate, r.name as roleName
      FROM accounts a
      JOIN roles r ON a.roleId = r.id
      ORDER BY a.id DESC
    `);
    return NextResponse.json(rows); // Trả về AccountWithRole[]
  } catch (error) {
    console.error('GET /accounts error:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách tài khoản' }, { status: 500 });
  }
}

//  Thêm tài khoản mới
export async function POST(req: NextRequest) {
  try {
    const body: Account = await req.json();
    // kiểm tra email
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }

    // kiểm tra số điện thoại

    const createdDate = new Date().toISOString().split('T')[0];

    const [result] = await pool.query(
      'INSERT INTO accounts (email, password, roleId, birthday, status, createdDate) VALUES (?, ?, ?, ?, ?, ?)',
      [body.email, body.password, body.roleId || null, body.birthday || null, body.status || 1, createdDate]
    );

    return NextResponse.json({ message: 'Tạo tài khoản thành công', id: (result as any).insertId });
  } catch (error) {
    console.error('POST /accounts error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// Cập nhật tài khoản
export async function PUT(request: NextRequest) {
  try {
    const data: Account = await request.json();
    const { id, email, password, roleId, birthday, status } = data;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID tài khoản' }, { status: 400 });
    }

    await pool.query(
      'UPDATE accounts SET email = ?, password = ?, roleId = ?, birthday = ?, status = ? WHERE id = ?',
      [email, password, roleId || null, birthday || null, status || 1, id]
    );

    return NextResponse.json({ message: 'Cập nhật tài khoản thành công' });
  } catch (error) {
    console.error('PUT /accounts error:', error);
    return NextResponse.json({ error: 'Lỗi khi cập nhật tài khoản' }, { status: 500 });
  }
}

// Xóa tài khoản
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID tài khoản' }, { status: 400 });
    }

    await pool.query('DELETE FROM accounts WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Xóa tài khoản thành công' });
  } catch (error) {
    console.error('DELETE /accounts error:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa tài khoản' }, { status: 500 });
  }
}
