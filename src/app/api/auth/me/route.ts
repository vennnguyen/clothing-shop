import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    // Lấy token từ cookie
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    // Giải mã token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    return NextResponse.json({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,     
      userType: payload.userType, 
    });
  } catch (error) {
    return NextResponse.json({ message: "Token không hợp lệ" }, { status: 401 });
  }
}