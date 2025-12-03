// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Trang chủ",
    description: "Website bán hàng mỹ phẩm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <body className={inter.className}>

                {/* HEADER */}
                <header className="bg-white shadow sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-orange-600">
                            Clothing Shop
                        </h1>

                        <nav className="flex gap-6 text-gray-700">
                            <a href="/" className="hover:text-orange-500">Trang chủ</a>
                            <a href="/products" className="hover:text-orange-500">Sản phẩm</a>
                            <a href="/cart" className="hover:text-orange-500">Giỏ hàng</a>
                            <a href="/login" className="hover:text-orange-500">Đăng nhập</a>
                        </nav>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="container mx-auto">
                    {children}
                </main>

                {/* FOOTER */}
                <footer className="bg-gray-100 py-6 mt-12">
                    <div className="container mx-auto text-center text-gray-600">
                        © {new Date().getFullYear()} MyBeauty Shop — All Rights Reserved.
                    </div>
                </footer>

            </body>
        </html>
    );
}
