"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToastMessage } from "../../../../hooks/useToastMessage";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { showSuccess, showError } = useToastMessage();
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        const res = await fetch("/api/auth/login-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password }),
        });

        const data = await res.json();

        if (res.ok) {
            showSuccess(data.message || "Đăng nhập thành công!");
            router.push("/");
            router.refresh();
        } else {
            showError(data.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">
                    Đăng nhập
                </h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-medium">Số điện thoại</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Nhập số điện thoại..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Mật khẩu</label>
                        <input
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
                        className="cursor-pointer w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                <p className="text-center mt-5 text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="text-orange-600 font-medium hover:underline">
                        Đăng ký
                    </a>
                </p>
            </div>
        </div>
    );
}
