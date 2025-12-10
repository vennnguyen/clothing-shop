import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcrypt';

// GET /api/employees - Lấy danh sách nhân viên (hỗ trợ tìm kiếm)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let sql = `
      SELECT 
        a.id,
        a.fullName,
        a.email,
        a.phone,
        a.birthday,
        a.gender,
        a.address,
        a.status,
        a.createdDate,
        r.id AS roleId,
        r.name AS roleName
      FROM Accounts a
      LEFT JOIN Roles r ON a.roleId = r.id
    `;

    const values: any[] = [];
    
    if (search) {
      sql += ` WHERE a.fullName LIKE ? OR a.email LIKE ? OR a.phone LIKE ?`;
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY a.createdDate DESC`;

    const [rows] = await pool.query(sql, values);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/employees error:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách nhân viên' }, { status: 500 });
  }
}

// POST /api/employees - Thêm nhân viên mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password, roleId, birthday, gender, address } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!fullName || !email || !phone || !password || !roleId) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Check email đã tồn tại
    const [existing]: any = await pool.query(
      'SELECT id FROM Accounts WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email hoặc số điện thoại đã tồn tại' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert
    const [result] = await pool.query(
      `INSERT INTO Accounts (fullName, email, phone, password, roleId, birthday, gender, address, status, createdDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURDATE())`,
      [fullName, email, phone, hashedPassword, roleId, birthday, gender, address]
    );

    return NextResponse.json({ 
      message: 'Thêm nhân viên thành công', 
      id: (result as any).insertId 
    });
  } catch (error) {
    console.error('POST /api/employees error:', error);
    return NextResponse.json({ error: 'Lỗi khi thêm nhân viên' }, { status: 500 });
  }
}
