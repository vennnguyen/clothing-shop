"use client";

import { useState } from "react";
import { useToastMessage } from "../../../../hooks/useToastMessage";
import { useRouter } from "next/navigation";
interface RegisterFormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    gender?: string;
    dateOfBirth?: string;
}
export default function RegisterPage() {
    const { showError, showSuccess } = useToastMessage();
    const router = useRouter();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        gender: "Nam",
        dateOfBirth: "",
    });
    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const validateForm = () => {
        const newErrors: RegisterFormErrors = {};

        // Validate Họ tên
        if (!form.fullName.trim()) {
            newErrors.fullName = "Vui lòng nhập họ và tên";
        }

        // Validate Email
        if (!form.email.trim()) {
            newErrors.email = "Vui lòng nhập email";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        // Validate Số điện thoại
        if (!form.phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!/^\d{10,11}$/.test(form.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
        }

        // Validate Ngày sinh
        if (!form.dateOfBirth) {
            newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
        }

        // Validate Mật khẩu
        if (!form.password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        } else if (form.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        // Validate Xác nhận mật khẩu
        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);

        // Nếu object lỗi có key thì tức là có lỗi -> trả về false
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Tự động xóa lỗi khi người dùng bắt đầu nhập lại
        // Ép kiểu name thành keyof RegisterFormErrors để TypeScript không báo lỗi
        if (errors[name as keyof RegisterFormErrors]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showError("Vui lòng kiểm tra lại các thông tin nhập vào");
            return;
        }

        try {
            const res = await fetch(`/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            // Nếu API trả về lỗi (status != 200-299), ném lỗi xuống catch
            if (!res.ok) {
                showError(data.message || "Đăng ký thất bại!");
                return;
            }

            // Nếu thành công
            showSuccess(data.message || "Đăng ký thành công!");
            router.push('/login');

        } catch (error: any) {
            console.error(error);
            // Hiển thị đúng message lỗi nhận được từ server (nếu có)
            showError(error?.message || "Có lỗi xảy ra, vui lòng thử lại sau");
        }
    };
    // Helper class để hiển thị viền đỏ khi có lỗi
    // Sử dụng keyof RegisterFormErrors để đảm bảo chỉ truyền đúng tên trường
    const getInputClass = (fieldName: keyof RegisterFormErrors) => {
        return `w-full border px-4 py-2 rounded-lg outline-none transition-colors ${errors[fieldName]
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:ring-2 focus:ring-blue-400"
            }`;
    };
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">

                <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
                    Đăng ký tài khoản
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Full Name */}
                    <div>
                        <label className="font-medium block mb-1">Họ và tên</label>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className={getInputClass("fullName")}
                            placeholder="Nhập họ tên"
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="font-medium block mb-1">Giới tính</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nu">Nữ</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="font-medium block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            className={getInputClass("email")}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Date of birth */}
                    <div>
                        <label className="font-medium block mb-1">Ngày sinh</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            className={getInputClass("dateOfBirth")}
                        />
                        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="font-medium block mb-1">Số điện thoại</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            className={getInputClass("phone")}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="font-medium block mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            className={getInputClass("password")}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm password - full width */}
                    <div className="md:col-span-2">
                        <label className="font-medium block mb-1">Nhập lại mật khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Xác nhận mật khẩu"
                            className={getInputClass("confirmPassword")}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Button full width */}
                    <button
                        type="submit"
                        className="cursor-pointer md:col-span-2 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Đăng ký
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center mt-5 text-gray-600">
                    Đã có tài khoản?{" "}
                    <a href="/login" className="text-orange-600 font-medium hover:underline">
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
}
