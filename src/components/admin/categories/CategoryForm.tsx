"use client";

import { useState, useEffect } from "react";
import { Category } from "../../../app/types/interfaces";
import { useToastMessage } from "../../../../hooks/useToastMessage";


export default function CategoryForm({
    open,
    setOpen,
    category,
    refresh,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    category: Category | null;
    refresh: () => void;
}) {
    const [form, setForm] = useState({
        name: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { showSuccess, showError } = useToastMessage();
    // Khi mở form sửa → đổ dữ liệu vào input
    useEffect(() => {
        if (category) {
            setForm({
                name: category.name,
            });
        } else {
            setForm({ name: "" });
        }
    }, [category, open]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const payload = {
            id: category?.id ?? null,
            name: form.name,
        };

        try {
            const res = await fetch("/api/categories", {
                method: category ? "PUT" : "POST",
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                showError(data.message);
                throw new Error("Có lỗi xảy ra khi lưu danh mục");
            } else {
                showSuccess(data.message);
            }
            refresh();
            setOpen(false);

        } catch (err) {
            console.log("Error:", err);
        }
    };


    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded shadow-lg">
                <div className="bg-green-400 py-4 px-6 flex justify-center items-center">
                    <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide ">
                        {category ? "Cập nhật danh mục" : "Thêm danh mục"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tên danh mục</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            // className={`w-full p-2.5 border rounded-lg outline-none transition-all ${errors.name
                            //     ? "border-red-500 focus:ring-red-200 bg-red-50"
                            //     : "border-gray-300 focus:ring-2 focus:ring-sky-400"
                            //     }`}
                            className="w-full p-2.5 border rounded-lg outline-none transition-all border-gray-300 focus:ring-2 focus:ring-sky-400"
                            placeholder="Ví dụ: Áo thun ..."
                            required
                        />
                        {/* Dòng text báo lỗi */}
                        {/* {errors.name && <p className="text-red-500 text-xs mt-1 italic">{errors.name}</p>} */}
                    </div>

                    <div className="pt-4 flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors cursor-pointer"
                            disabled={isLoading}
                        >
                            Hủy bỏ
                        </button>

                        <button
                            type="submit"
                            className={`cursor-pointer px-8 py-2.5 bg-green-400 hover:bg-green-500 text-white font-bold rounded-lg shadow-md transition-all transform active:scale-95 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu...' : (category ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
