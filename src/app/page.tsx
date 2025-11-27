// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Chào mừng đến với Website Bán Quần Áo</h1>
            <p>Trang chủ đang được xây dựng...</p>

            <div className="mt-5 p-4 border rounded bg-gray-100">
                <h2 className="font-semibold">Menu nhanh:</h2>
                <ul className="list-disc ml-5 mt-2">
                    <li>
                        <Link href="/admin/products" className="text-blue-600 hover:underline">
                            Đi tới trang Quản lý sản phẩm (Admin)
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}