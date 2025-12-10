import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import bcrypt from 'bcrypt';

// GET /api/employees/:id - Lấy thông tin chi tiết 1 nhân viên
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [rows]: any = await pool.query(
      `SELECT a.*, r.name AS roleName 
       FROM Accounts a 
       LEFT JOIN Roles r ON a.roleId = r.id 
       WHERE a.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy nhân viên' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('GET /api/employees/[id] error:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy thông tin nhân viên' }, { status: 500 });
  }
}

// PUT /api/employees/:id - Cập nhật thông tin nhân viên
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fullName, email, phone, password, roleId, birthday, gender, address, status } = body;

    // Check email/phone trùng (trừ chính nó)
    const [existing]: any = await pool.query(
      'SELECT id FROM Accounts WHERE (email = ? OR phone = ?) AND id != ?',
      [email, phone, id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email hoặc số điện thoại đã tồn tại' }, { status: 400 });
    }

    let sql = `UPDATE Accounts SET 
      fullName = ?, 
      email = ?, 
      phone = ?, 
      roleId = ?, 
      birthday = ?, 
      gender = ?, 
      address = ?, 
      status = ?`;

    const values: any[] = [fullName, email, phone, roleId, birthday, gender, address, status];

    // Nếu có password mới thì hash và update
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += ', password = ?';
      values.push(hashedPassword);
    }

    sql += ' WHERE id = ?';
    values.push(id);

    await pool.query(sql, values);

    return NextResponse.json({ message: 'Cập nhật nhân viên thành công' });
  } catch (error) {
    console.error('PUT /api/employees/[id] error:', error);
    return NextResponse.json({ error: 'Lỗi khi cập nhật nhân viên' }, { status: 500 });
  }
}

// DELETE /api/employees/:id - Xóa nhân viên
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Không cho xóa admin (id = 1)
    if (id === '1') {
      return NextResponse.json({ error: 'Không thể xóa tài khoản Admin' }, { status: 400 });
    }

    await pool.query('DELETE FROM Accounts WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    console.error('DELETE /api/employees/[id] error:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa nhân viên' }, { status: 500 });
  }
}
