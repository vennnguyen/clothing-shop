"use client";

import { useState, useEffect } from "react";
import { useToastMessage } from "../../../../hooks/useToastMessage";

// Interface định nghĩa cấu trúc dữ liệu nhân viên
interface Employee {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    roleId: number;
    birthday: string;
    gender: string;
    address: string;
    status: number;
}

export default function EmployeeForm({
    open,
    setOpen,
    employee,
    refresh,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    employee: Employee | null;
    refresh: () => void;
}) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        roleId: 2, // Mặc định là Staff
        birthday: "",
        gender: "Nam",
        address: "",
        status: 1,
    });

    const { showSuccess, showError } = useToastMessage();

    // Khi mở form sửa → đổ dữ liệu vào input
    useEffect(() => {
        if (employee) {
            setForm({
                fullName: employee.fullName,
                email: employee.email,
                phone: employee.phone,
                password: "", // Không hiển thị password cũ
                roleId: employee.roleId,
                birthday: employee.birthday ? employee.birthday.split('T')[0] : "",
                gender: employee.gender || "Nam",
                address: employee.address || "",
                status: employee.status,
            });
        } else {
            setForm({
                fullName: "",
                email: "",
                phone: "",
                password: "",
                roleId: 2,
                birthday: "",
                gender: "Nam",
                address: "",
                status: 1,
            });
        }
    }, [employee, open]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'roleId' || name === 'status' ? parseInt(value) : value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Kiểm tra dữ liệu đầu vào
        if (!form.fullName || !form.email || !form.phone) {
            showError("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        if (!employee && !form.password) {
            showError("Vui lòng nhập mật khẩu");
            return;
        }

        const payload = employee ? { ...form, id: employee.id } : form;

        try {
            const url = employee ? `/api/employees/${employee.id}` : "/api/employees";
            const method = employee ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                showError(data.error || "Có lỗi xảy ra");
            } else {
                showSuccess(data.message || "Thành công");
                refresh();
                setOpen(false);
            }
        } catch (err) {
            console.error("Error:", err);
            showError("Lỗi kết nối server");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded shadow-lg my-8">
                <div className="bg-green-400 py-4 px-6 flex justify-center items-center">
                    <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
                        {employee ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Họ tên */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Họ tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-sky-400"
                                placeholder="Nguyễn Văn A"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-sky-400"
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-sky-400"
                                placeholder="0901234567"
                                required
                                maxLength={10}
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Mật khẩu {!employee && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-sky-400"
                                placeholder={employee ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                                required={!employee}
                            />
                        </div>

                        {/* Vai trò */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Vai trò</label>
                            <select
                                name="roleId"
                                value={form.roleId}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-sky-400"
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Staff</option>
                            </select>
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Giới tính</label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-sky-400"
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>

                        {/* Ngày sinh */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Ngày sinh</label>
                            <input
                                type="date"
                                name="birthday"
                                value={form.birthday}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-sky-400"
                            />
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Trạng thái</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-sky-400"
                            >
                                <option value={1}>Hoạt động</option>
                                <option value={0}>Khóa</option>
                            </select>
                        </div>
                    </div>

                    {/* Địa chỉ - Full width */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ</label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full p-2.5 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-sky-400"
                            placeholder="Số nhà, đường, phường, quận..."
                            rows={2}
                        />
                    </div>

                    <div className="pt-4 flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            {employee ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
