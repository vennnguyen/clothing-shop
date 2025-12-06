import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req: NextResponse) {
    try {
        const body = await req.json();
        const { fullName, email, phone, password, gender, dateOfBirth } = body;
        if (!fullName || !email || !phone || !password) {
            return NextResponse.json({ message: "Thiếu dữ liệu gửi lên!" }, { status: 400 });
        }

        const [existingEmail]: any = await pool.query(`SELECT id FROM customers where email = ?`, [email]);
        if (existingEmail.length > 0) {
            // console.log("trùng mail");
            return NextResponse.json({ message: "Email đã tồn tại" }, { status: 400 });
        }

        const [existingPhone]: any = await pool.query(`SELECT id FROM customers WHERE phone = ?`, [phone]);
        if (existingPhone.length > 0) {
            // console.log("trùng phone");
            return NextResponse.json({ message: "Số điện thoại đã được sử dụng" }, { status: 400 });
        }
        //mã hóa mật khẩu 
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO customers (fullName, email, phone, password, gender, dateOfBirth, createdDate)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [fullName, email, phone, hashedPassword, gender, dateOfBirth]
        );

        return NextResponse.json({ message: "Đăng ký thành công!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Lỗi đăng ký" + error }, { status: 500 })
    }
}