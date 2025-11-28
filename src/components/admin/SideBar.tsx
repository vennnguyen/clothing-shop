import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white p-5 h-screen">
            <h2 className="text-xl font-bolder mb-6">Admin Panel</h2>

            <nav className="space-y-3">
                <Link href="/admin" className="block hover:text-blue-400">Dashboard</Link>
                <Link href="/admin/products" className="block hover:text-blue-400">Sản phẩm</Link>
                {/* <Link href="/admin/orders" className="block hover:text-blue-400">Đơn hàng</Link>
                <Link href="/admin/customers" className="block hover:text-blue-400">Khách hàng</Link>
                <Link href="/admin/categories" className="block hover:text-blue-400">Danh mục</Link>
                <Link href="/admin/users" className="block hover:text-blue-400">Tài khoản</Link> */}
            </nav>
        </aside>
    );
}
