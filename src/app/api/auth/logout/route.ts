// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
    // Tạo phản hồi thành công
    const res = NextResponse.json({ message: "Đăng xuất thành công" });

    res.cookies.delete("token");

    return res;
}