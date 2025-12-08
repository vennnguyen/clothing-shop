import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import pool from "../../../../lib/db";

const JWT_SECRET = process.env.JWT_SECRET; // Nhớ bỏ vào .env

export async function POST(req: NextRequest) {
    try {
        const { phone, password } = await req.json(); // Nhận phone thay vì identifier

        // 1. Tìm trong bảng customers
        const [rows]: any = await pool.query(
            "SELECT id, fullName, password, email FROM customers WHERE phone = ? LIMIT 1",
            [phone]
        );
        const user = rows[0];

        if (!user) return NextResponse.json({ message: "SĐT chưa đăng ký!" }, { status: 404 });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return NextResponse.json({ message: "Sai mật khẩu!" }, { status: 401 });

        // 2. Tạo Token (Luôn set role là customer)
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: "customer",      // Cứng role
            userType: "customer",  //  Cứng type
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .setIssuedAt()
            .sign(secret);

        // 3. Trả về
        const res = NextResponse.json({ message: "Đăng nhập thành công", role: "customer" });
        res.cookies.set("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            secure: false,
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
            sameSite: "lax",
        });

        return res;

    } catch (error) {
        return NextResponse.json({ message: "Lỗi Server" }, { status: 500 });
    }
}