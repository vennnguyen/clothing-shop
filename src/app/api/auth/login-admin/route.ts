import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import pool from "../../../../lib/db";
const JWT_SECRET = "supersecretkey";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json(); // Nhận email

        // 1. Tìm trong bảng accounts + roles
        const [rows]: any = await pool.query(
            `SELECT a.id, a.email, a.password, r.name AS role 
       FROM accounts a 
       JOIN roles r ON r.id = a.roleId 
       WHERE a.email = ? LIMIT 1`,
            [email]
        );
        const user = rows[0];

        if (!user) return NextResponse.json({ message: "Email không tồn tại!" }, { status: 404 });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return NextResponse.json({ message: "Sai mật khẩu!" }, { status: 401 });

        // 2. Tạo Token (Lấy role động từ DB)
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({
            id: user.id,
            name: user.email,
            role: user.role,      // 👈 Role lấy từ DB (admin, staff...)
            userType: "account",  // 👈 Đánh dấu là tài khoản nội bộ
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1d") // Admin nên cho hết hạn sớm hơn (1 ngày) để bảo mật
            .setIssuedAt()
            .sign(secret);

        // 3. Trả về
        const res = NextResponse.json({ message: "Chào sếp!", role: user.role });
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60, // 1 ngày
            path: "/",
            sameSite: "lax",
        });

        return res;

    } catch (error) {
        return NextResponse.json({ message: "Lỗi Server" }, { status: 500 });
    }
}