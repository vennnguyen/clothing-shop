"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "../ui/LogoutButton";
interface User {
    id?: number;
    name?: string;
    role?: string;
}
export default function Sidebar({ user }: { user: User | null }) {
    // const router = useRouter();
    const pathname = usePathname();
    const menuItems = [
        { name: "Dashboard", path: "/admin" },
        { name: "Sản phẩm", path: "/admin/products" },
        { name: "Danh mục", path: "/admin/categories" },
        { name: "Nhà cung cấp", path: "/admin/suppliers" },
        { name: "Phiếu nhập", path: "/admin/imports" },
    ];

    // Hàm kiểm tra mục có phải đang active không
    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-gray-900 text-white p-5 h-screen flex flex-col">
            <h2 className="text-xl font-bolder mb-6">Admin Panel</h2>

            <nav className="space-y-2 flex-1">
                {menuItems.map(item => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`block px-3 py-2 rounded-md transition ${isActive(item.path)
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-700 hover:text-blue-300"
                            }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="border-t border-gray-700 pt-4 flex items-center justify-center">
                <div className="flex items-center text-gray-300 mb-2 w-full">
                    <span className="whitespace-nowrap mr-1">Xin chào,</span>
                    {user ? (
                        // Khi có dữ liệu: Hiện email + truncate
                        <span className="font-semibold truncate" title={user.name}>
                            {user.name}
                        </span>
                    ) : (
                        // Khi chưa có dữ liệu: Hiện thanh loading xám (Skeleton)
                        <div className="h-5 w-32 bg-gray-700 animate-pulse rounded"></div>
                    )}
                </div>
                <div>
                    <LogoutButton redirectTo="/admin/login" className="bg-gray-900 text text-red-600 p-1 cursor-pointer" />
                </div>
            </div>
        </aside>
    );
}
