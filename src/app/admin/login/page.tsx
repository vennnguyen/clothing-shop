"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToastMessage } from "../../../../hooks/useToastMessage";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { showSuccess, showError } = useToastMessage();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation phone number
        const phoneRegex = /^[0-9]{9,11}$/;
        if (!phoneRegex.test(phone)) {
            return showError("Số điện thoại không hợp lệ!");
        }

        setLoading(true);

        const res = await fetch("/api/auth/login-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            showSuccess(data.message || "Đăng nhập thành công!");
            router.push("/admin/dashboard"); // Điều hướng đúng trang admin
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

                    {/* Phone number */}
                    <div>
                        <label className="block mb-1 font-medium">Số điện thoại</label>
                        <input
                            suppressHydrationWarning
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Nhập số điện thoại..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
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
