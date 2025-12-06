// app/layout.tsx
import Link from "next/link";
import "../globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { getUserFromCookie } from "../../lib/auth";
import HeaderUserArea from "../../components/ui/HeaderUserArea";
import MainNavigation from "../../components/ui/MainNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Trang chủ",
    description: "Website bán hàng mỹ phẩm",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const user = await getUserFromCookie();
    return (
        <html lang="vi">
            <body className={inter.className}>

                {/* HEADER */}
                <header className="bg-white shadow sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <Link href="/">
                            <h1 className="text-xl font-bold text-orange-600">
                                Clothing Shop
                            </h1>
                        </Link>

                        <MainNavigation user={user} />
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="container mx-auto">
                    {children}
                    <ToastContainer />
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
