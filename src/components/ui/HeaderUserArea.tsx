// components/HeaderUserArea.tsx
"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton"; // Import nút Logout bạn đã làm ở bước trước
import { usePathname } from "next/navigation";

interface HeaderUserAreaProps {
    user?: {
        name: string;
        role: string;
    } | null;
}

export default function HeaderUserArea({ user }: HeaderUserAreaProps) {
    const pathname = usePathname();

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <span className="">
                    Xin chào, <span className="font-bold text-orange-600">{user.name}</span>
                </span>
                <LogoutButton
                    // className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition"
                    redirectTo="/"
                />
            </div>
        );
    }

    // 2. Nếu CHƯA đăng nhập
    const isActive = pathname === "/login";

    return (
        <Link
            suppressHydrationWarning
            href="/login"
            className={
                isActive
                    ? "text-orange-600 font-bold" // Style khi đang ở trang login
                    : "text-gray-700 hover:text-orange-500 font-medium" // Style bình thường
            }
        >
            Đăng nhập
        </Link>
    );
}