// components/MainNavigation.tsx
"use client"; // 👈 Bắt buộc để dùng usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderUserArea from "./HeaderUserArea";
import { useCart } from "../providers/CartContext";
import { ShoppingCart, HomeIcon, Home } from "lucide-react";

interface NavProps {
    user: any; // Nhận user từ layout truyền xuống
}

export default function MainNavigation({ user }: NavProps) {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại (VD: /products)
    const { cartCount } = useCart();
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
            <Link
                href="/"
                className={`${isActive("/")} flex items-center gap-1 hover:text-orange-600`}
            >
                <HomeIcon size={18} />
                <span className="font-semibold">Trang chủ</span>
            </Link>

            {/* <Link href="/products" className={isActive("/products")}>
                Sản phẩm
            </Link> */}

            <Link
                href="/cart"
                className={`${isActive("/cart")} relative flex items-center gap-1 hover:text-orange-600 transition-all duration-200`}
            >
                <ShoppingCart size={18} />
                <span className="font-semibold">Giỏ hàng</span>

                {cartCount > 0 && (
                    <span
                        className="
                            absolute -top-2 -right-4 
                            bg-orange-600 text-white text-[11px] font-bold 
                            h-[18px] min-w-[18px] px-[5px]
                            flex items-center justify-center 
                            rounded-full border-[2px] border-white shadow-md 
                            animate-bounce
                        "
                    >
                        {cartCount > 9 ? "9+" : cartCount}
                    </span>
                )}
            </Link>


            {/* Component user vẫn giữ nguyên */}
            <HeaderUserArea user={user} />
        </nav>
    );
}