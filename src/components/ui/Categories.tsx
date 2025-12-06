"use client";

import React from "react";
// 1. Import useRouter để điều hướng URL
import { useRouter } from "next/navigation";
import { Category } from "../../app/types/interfaces";

interface CategoriesProps {
    categories: Category[];
    selectedId?: string; // Nhận selectedId từ cha truyền vào
}

const Categories = ({ categories, selectedId }: CategoriesProps) => {
    // 2. Bỏ useState, thay bằng router
    const router = useRouter();

    // Hàm xử lý: Khi click thì đổi URL, không phải đổi state
    const handleSelectCategory = (id: number | null) => {
        if (id === null) {
            router.push("/"); // Về trang chủ (Tất cả)
        } else {
            router.push(`/?categoryId=${id}`); // Thêm tham số vào URL
        }
    };

    const buttonBaseClass = "cursor-pointer whitespace-nowrap w-full text-left px-4 py-3 rounded-lg text-sm font-medium border transition-all";
    const activeClass = "cursor-pointer bg-orange-500 text-white border-orange-500 shadow-md";
    const inactiveClass = "bg-white text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-gray-300";

    return (
        <div className="flex flex-col gap-3 w-50">
            {/* Nút Tất cả */}
            <button
                onClick={() => handleSelectCategory(null)}
                className={`${buttonBaseClass} ${
                    // 3. So sánh dựa trên selectedId từ props (URL) thay vì state nội bộ
                    !selectedId ? activeClass : inactiveClass
                    }`}
            >
                Tất cả
            </button>

            {/* Danh sách categories */}
            {categories.map((cat) => {
                // Chuyển cả 2 về string hoặc number để so sánh chính xác
                // selectedId từ URL thường là string, cat.id là number
                const isActive = selectedId && Number(selectedId) === cat.id;

                return (
                    <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`${buttonBaseClass} ${isActive ? activeClass : inactiveClass
                            }`}
                    >
                        {cat.name}
                    </button>
                );
            })}
        </div>
    );
};

export default Categories;