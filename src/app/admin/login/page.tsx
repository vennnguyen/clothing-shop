"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToastMessage } from "../../../../hooks/useToastMessage";

export default function LoginPage() {
    // 1. Đổi state phone -> email
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { showSuccess, showError } = useToastMessage();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // 2. Cập nhật validation cho Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return showError("Email không hợp lệ!");
        }

        setLoading(true);

        // 3. Cập nhật body gửi lên server
        const res = await fetch("/api/auth/login-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }), // Gửi email thay vì phone
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            showSuccess(data.message || "Đăng nhập thành công!");
            // router.refresh();
            // router.push("/admin");
            setTimeout(() => {
                window.location.href = "/admin";
            }, 1500)
        } else {
            showError(data.message || "Đăng nhập thất bại!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">
                    Đăng nhập Admin
                </h2>

                <form onSubmit={handleLogin} className="space-y-5">

                    {/* 4. Đổi Input Phone -> Email */}
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            suppressHydrationWarning
                            type="email" // Đổi type thành email
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password giữ nguyên */}
                    <div>
                        <label className="block mb-1 font-medium">Mật khẩu</label>
                        <input
                            suppressHydrationWarning
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Nhập mật khẩu..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        suppressHydrationWarning
                        type="submit"
                        disabled={loading}
                        className={`cursor-pointer w-full bg-orange-600 text-white py-2 rounded-lg font-semibold transition 
                        ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-700"}`}
                    >
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}