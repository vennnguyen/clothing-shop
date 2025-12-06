// components/MainNavigation.tsx
"use client"; // 👈 Bắt buộc để dùng usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderUserArea from "./HeaderUserArea";

interface NavProps {
    user: any; // Nhận user từ layout truyền xuống
}

export default function MainNavigation({ user }: NavProps) {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại (VD: /products)

    // Hàm kiểm tra active
    // Nếu path hiện tại trùng với href -> Trả về màu cam đậm
    // Nếu không -> Trả về màu xám
    const isActive = (href: string) => {
        return pathname === href
            ? "text-orange-600 font-bold" // Active styles
            : "text-gray-700 hover:text-orange-500"; // Normal styles
    };

    return (
        <nav className="flex items-center gap-6 me-9">
            <Link href="/" className={isActive("/")}>
                Trang chủ
            </Link>

            <Link href="/products" className={isActive("/products")}>
                Sản phẩm
            </Link>

            <Link href="/cart" className={isActive("/cart")}>
                Giỏ hàng
            </Link>

            {/* Component user vẫn giữ nguyên */}
            <HeaderUserArea user={user} />
        </nav>
    );
}