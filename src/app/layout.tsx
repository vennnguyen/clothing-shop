import { ToastContainer } from "react-toastify";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ 
    subsets: ["latin", "vietnamese"],
});

export const metadata = {
    title: "Clothing Shop",
    description: "Website bán hàng quần áo ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <head>
                <meta charSet="utf-8" />
            </head>
            <body className={inter.className}>
                {children}
                {/* <ToastContainer /> */}
            </body>
        </html>
    );
}