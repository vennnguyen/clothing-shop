import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../../../lib/db";

const JWT_SECRET = process.env.JWT_SECRET
export async function POST(req: NextRequest) {
    try {
        const { identifier, password } = await req.json();
        if (!identifier || !password) {
            return NextResponse.json({ message: "Thiếu thông tin!" }, { status: 400 });
        }

        let user;
        let type: "customer" | "account" = "customer"

        // Kiểm tra nếu là số -> login customer theo phone
        if (/^\d+$/.test(identifier)) {
            const [rows]: any = await pool.query(
                "SELECT id, fullName AS name, password, 'customer' AS userType FROM customers WHERE phone = ? LIMIT 1",
                [identifier]
            );

            user = rows[0];
            type = "customer";
        } else {
            const [rows]: any = await pool.query(
                `SELECT a.id, a.email AS name, a.password, r.name AS role, 'account' AS userType 
         FROM accounts a 
         JOIN roles r ON r.id = a.roleId 
         WHERE email = ? LIMIT 1`,
                [identifier]
            );
            user = rows[0];
            type = "account";
        }

        if (!user) {
            return NextResponse.json({ message: "Tài khoản không tồn tại" }, { status: 404 })
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return NextResponse.json({ message: "Tài khoản hoặc mật khẩu không đúng" }, { status: 401 })
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                role: type === "account" ? user.role : "customer",
                userType: type,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const res = NextResponse.json({ message: "Đăng nhập thành công", role: type === "account" ? user.role : "customer" })
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return res;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }

}