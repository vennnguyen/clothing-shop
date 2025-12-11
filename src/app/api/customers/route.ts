
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { Customer } from "../../types/interfaces";
import bcrypt from 'bcrypt';
import { error } from "console";

//lấy khách hàng
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM customers");
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
//thêm khách hàng
export async function POST(req: NextRequest) {
  try {
    const Customer:Customer = await req.json();
    // kiểm tra tồn tại số điện thoại
    const [existingCustomer]: any = await pool.query(
      `SELECT * FROM customers WHERE phone = ?`,
      [Customer.phone]
    );
    if (existingCustomer.length > 0) {
      return NextResponse.json({ message: "Số điện thoại đã tồn tại" }, { status: 400 });
    }

    const createdDate = new Date().toISOString().split("T")[0];
    // mã hóa password
    const hashedPassword = await bcrypt.hash(Customer.password, 10);
    
    const [result] = await pool.query(
      "INSERT INTO customers (email, password, createdDate, dateOfBirth, phone, fullName, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [Customer.email, hashedPassword, createdDate, Customer.dateOfBirth, Customer.phone, Customer.fullName, Customer.gender]
    );
    const newCustomer = { id: (result as any).insertId, ...Customer, createdDate };
    return NextResponse.json({ message: "Tạo khách hàng thành công", customer: newCustomer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
