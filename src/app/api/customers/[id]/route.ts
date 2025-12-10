import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import bcrypt from 'bcrypt';

// GET /api/customers/:id - Lấy thông tin chi tiết 1 khách hàng
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isNaN(Number(id))) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const [rows]: any = await pool.query(
      `SELECT id, fullName, email, phone, gender, dateOfBirth, createdDate
       FROM Customers
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy khách hàng" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET Customer Error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT /api/customers/:id - Cập nhật thông tin khách hàng
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fullName, email, phone, password, gender, dateOfBirth } = body;

    // Check email/phone trùng (trừ chính nó)
    const [existing]: any = await pool.query(
      'SELECT id FROM Customers WHERE (email = ? OR phone = ?) AND id != ?',
      [email, phone, id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email hoặc số điện thoại đã tồn tại' }, { status: 400 });
    }

    let sql = `UPDATE Customers SET 
      fullName = ?, 
      email = ?, 
      phone = ?, 
      gender = ?, 
      dateOfBirth = ?`;

    const values: any[] = [fullName, email, phone, gender, dateOfBirth];

    // Nếu có password mới
    if (password) {
      sql += ', password = ?';
      values.push(password); // Hoặc hash nếu muốn
    }

    sql += ' WHERE id = ?';
    values.push(id);

    await pool.query(sql, values);

    return NextResponse.json({ message: 'Cập nhật khách hàng thành công' });
  } catch (error) {
    console.error('PUT Customer Error:', error);
    return NextResponse.json({ error: 'Lỗi khi cập nhật khách hàng' }, { status: 500 });
  }
}

// DELETE /api/customers/:id - Xóa khách hàng (kiểm tra đơn hàng trước)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check xem khách hàng có đơn hàng không
    const [orders]: any = await pool.query(
      'SELECT COUNT(*) as count FROM Orders WHERE customerId = ?',
      [id]
    );

    if (orders[0].count > 0) {
      return NextResponse.json({ 
        error: 'Không thể xóa khách hàng đã có đơn hàng. Vui lòng xóa đơn hàng trước.' 
      }, { status: 400 });
    }

    await pool.query('DELETE FROM Customers WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Xóa khách hàng thành công' });
  } catch (error) {
    console.error('DELETE Customer Error:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa khách hàng' }, { status: 500 });
  }
}
