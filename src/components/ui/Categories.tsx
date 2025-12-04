"use client";
import React, { useState } from "react";
import { Category } from "../../app/types/interfaces";

interface CategoriesProps {
    categories: Category[];
}

const Categories = ({ categories }: CategoriesProps) => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // Style chung cho tất cả các nút để đồng bộ
    const buttonBaseClass = "whitespace-nowrap w-full text-left px-4 py-3 rounded-lg text-sm font-medium border transition-all";
    const activeClass = "bg-pink-500 text-white border-pink-500 shadow-md";
    const inactiveClass = "bg-white text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-gray-300";

    return (
        // SỬA: Dùng flex-col thay vì flex-column
        <div className="flex flex-col gap-3 w-50">

            {/* Nút Tất cả */}
            <button
                onClick={() => setSelectedCategory(null)}
                className={`${buttonBaseClass} ${selectedCategory === null ? activeClass : inactiveClass
                    }`}
            >
                Tất cả
            </button>

            {/* Danh sách categories */}
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`${buttonBaseClass} ${selectedCategory === cat.id ? activeClass : inactiveClass
                        }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
};

export default Categories;