import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { emailRegex, phoneRegex } from '../../../lib/validator';
import { Account } from '../../types/interfaces';
import bcrypt from 'bcrypt';

 //Lấy tất cả tài khoản
export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT a.id, a.email, a.roleId, a.birthday, a.status, a.createdDate, a.fullName, r.name as roleName
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

    const createdDate = new Date().toISOString().split('T')[0];

    // mã hóa password đơn giản (nên dùng thư viện bcrypt trong thực tế)
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;

    const [result] = await pool.query(
      'INSERT INTO accounts (email, password, roleId, birthday, status, createdDate) VALUES (?, ?, ?, ?, ?, ?)',
      [body.email, body.password, body.roleId || null, body.birthday || null, body.status || 1, createdDate]
    );

    // lấy account vừa tạo có roleName
    const [rows]: any = await pool.query(`
      SELECT a.id, a.email, a.roleId, a.birthday, a.status, a.createdDate, a.fullName, r.name as roleName
      FROM accounts a
      JOIN roles r ON a.roleId = r.id
      WHERE a.id = ?
    `, [(result as any).insertId]);

    return NextResponse.json({ message: 'Tạo tài khoản thành công', account: (rows as any)[0] });
  } catch (error) {
    console.error('POST /accounts error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
