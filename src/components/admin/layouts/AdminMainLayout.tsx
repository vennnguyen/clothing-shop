"use client"; // File này chạy ở Client

import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from "next/navigation";
import Sidebar from "../SideBar";

// Nhận user và children từ cha truyền xuống
export default function AdminMainLayout({
    children,
    user
}: {
    children: React.ReactNode,
    user: any
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Logic ẩn hiện sidebar giữ nguyên */}
            {!isLoginPage && <Sidebar user={user} />}

            <main className={`flex-1 ${!isLoginPage ? "p-5" : ""}`}>
                {children}
                <ToastContainer />
            </main>
        </div>
    );
}