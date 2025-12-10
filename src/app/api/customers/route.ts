
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import bcrypt from 'bcrypt';

// GET /api/customers - Lấy danh sách khách hàng (hỗ trợ tìm kiếm)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let sql = `
      SELECT 
        id,
        fullName,
        email,
        phone,
        gender,
        dateOfBirth,
        createdDate
      FROM Customers
    `;

    const values: any[] = [];
    
    if (search) {
      sql += ` WHERE fullName LIKE ? OR email LIKE ? OR phone LIKE ?`;
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY createdDate DESC`;

    const [rows] = await pool.query(sql, values);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/customers error:', error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách khách hàng" }, { status: 500 });
  }
}

// POST /api/customers - Thêm khách hàng mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password, gender, dateOfBirth } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Check email/phone đã tồn tại
    const [existing]: any = await pool.query(
      'SELECT id FROM Customers WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email hoặc số điện thoại đã tồn tại' }, { status: 400 });
    }

    // Hash password nếu cần (hoặc lưu plain text như hiện tại)
    // const hashedPassword = await bcrypt.hash(password, 10);

    const createdDate = new Date().toISOString().split("T")[0];
    const [result] = await pool.query(
      `INSERT INTO Customers (fullName, email, phone, password, gender, dateOfBirth, createdDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, phone, password, gender, dateOfBirth, createdDate]
    );

    return NextResponse.json({ 
      message: "Thêm khách hàng thành công", 
      id: (result as any).insertId 
    });
  } catch (error) {
    console.error('POST /api/customers error:', error);
    return NextResponse.json({ error: "Lỗi khi thêm khách hàng" }, { status: 500 });
  }
}
