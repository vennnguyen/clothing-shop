import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    // ======================================================
    // 1. LOGIC KHI CHƯA ĐĂNG NHẬP (Chưa có token)
    // ======================================================
    if (!token) {
        // Nếu đang vào trang đăng nhập (của Admin hoặc User) thì CHO QUA luôn
        if (pathname === "/admin/login" || pathname === "/login") {
            return NextResponse.next();
        }

        // Nếu cố tình vào các trang Admin nội bộ (VD: /admin/dashboard)
        // -> Chuyển hướng về trang đăng nhập ADMIN
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        // Các trang khác (VD: Profile) -> Chuyển hướng về login thường
        // Lưu ý: Logic này phụ thuộc vào matcher ở dưới. 
        // Nếu matcher không bắt các trang thường thì dòng này không chạy.
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ======================================================
    // 2. LOGIC KHI ĐÃ ĐĂNG NHẬP (Có token)
    // ======================================================
    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);
        const userType = payload.userType as string; // 'customer' | 'account'

        // QUYỀN HẠN: Chặn Customer vào khu vực Admin
        // Lưu ý: Không được chặn /admin/login ở đây, để logic redirect phía dưới xử lý
        if (userType === "customer" && pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // TRẢI NGHIỆM: Đã login rồi thì không cho vào trang login nữa
        if (pathname === "/login" || pathname === "/admin/login") {
            if (userType === "account") {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
            if (userType === "customer") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

    } catch (error) {
        // Token lỗi/hết hạn -> Xóa cookie và bắt đăng nhập lại
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete("token");
        return res;
    }

    return NextResponse.next();
}

// Cấu hình Matcher
export const config = {
    matcher: [
        // Các route cần bảo vệ hoặc cần kiểm tra
        "/admin/:path*",
        "/login",
        "/profile/:path*", // Ví dụ thêm trang cá nhân
    ],
};