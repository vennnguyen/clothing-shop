"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "../ui/LogoutButton";
import { BarChart3, Boxes, FilePlus2, Grid3X3, LayoutDashboard, ShoppingCart, ShieldCheck, Truck, UserSquare2, Users } from "lucide-react";

interface User {
    id?: number;
    name?: string;
    role?: string;
}
export default function Sidebar({ user }: { user: User | null }) {
    // console.log('Sidebar user:', user);
    // const router = useRouter();
    const pathname = usePathname();

    const menuItems = [];
    if (user.role === "Admin") {
        menuItems.push(
            { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
            { name: "Sản phẩm", path: "/admin/products", icon: <Boxes size={20} /> },
            { name: "Danh mục", path: "/admin/categories", icon: <Grid3X3 size={20} /> },
            { name: "Nhà cung cấp", path: "/admin/suppliers", icon: <Truck size={20} /> },
            { name: "Phiếu nhập", path: "/admin/imports", icon: <FilePlus2 size={20} /> },
            { name: "Tài khoản", path: "/admin/accounts", icon: <Users size={20} /> },
            { name: "Phân quyền", path: "/admin/roles", icon: <ShieldCheck size={20} /> },
            { name: "Đơn hàng", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
            { name: "Khách hàng", path: "/admin/customers", icon: <UserSquare2 size={20} /> },
            { name: "Thống kê", path: "/admin/statistics", icon: <BarChart3 size={20} /> },
        );
    } else if (user.role === "Sales") {
        menuItems.push(
            { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
            { name: "Đơn hàng", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
            { name: "Khách hàng", path: "/admin/customers", icon: <UserSquare2 size={20} /> },
            { name: "Thống kê", path: "/admin/statistics", icon: <BarChart3 size={20} /> },
        );
    } else {
        menuItems.push(
            { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
            { name: "Sản phẩm", path: "/admin/products", icon: <Boxes size={20} /> },
            { name: "Nhà cung cấp", path: "/admin/suppliers", icon: <Truck size={20} /> },
            { name: "Phiếu nhập", path: "/admin/imports", icon: <FilePlus2 size={20} /> },
            { name: "Danh mục", path: "/admin/categories", icon: <Grid3X3 size={20} /> },
        );
    }


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
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer
                            ${isActive(item.path)
                                ? "bg-blue-600 text-white shadow-md"
                                : "hover:bg-gray-700 hover:text-blue-300"
                            }
                        `}
                    >
                        {item.icon}
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
