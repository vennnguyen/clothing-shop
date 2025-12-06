// components/LogoutButton.tsx
"use client"; // Bắt buộc vì dùng sự kiện onClick

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
interface LogoutButtonProps {
    redirectTo?: string; // Muốn chuyển hướng về đâu sau khi logout?
    className?: string;  // Class CSS tùy chỉnh
}

export default function LogoutButton({
    redirectTo = "/login",
    className
}: LogoutButtonProps) {

    const router = useRouter();

    const handleLogout = async () => {
        try {
            // 1. Gọi API để xóa cookie bên server
            await fetch("/api/auth/logout", {
                method: "POST",
            });

            // 2. Chuyển hướng
            // router.push(redirectTo);

            // // 3. Refresh để xóa cache dữ liệu cũ (quan trọng với Next.js)
            // router.refresh();

            window.location.href = "/";
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={className || "bg-white text-red-600 p-1 cursor-pointer"}
        >
            <LogOut size={17} />
        </button>
    );
}
{/* <LogoutButton redirectTo="/" className="text-sm text-gray-700" />
<LogoutButton redirectTo="/admin/login" className="btn-admin-logout" /> */}