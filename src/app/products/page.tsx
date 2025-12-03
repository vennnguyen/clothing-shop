// app/products/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { Category, Product } from "../types/interfaces";


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true)
    // Fake API – bạn đổi sang fetch("/api/products") khi dùng DB thật
    const getAllCategories = async () => {
        try {
            const res = await fetch("/api/categories", { cache: 'no-store' }); // Đảm bảo luôn lấy dữ liệu mới nhất
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục", error);
        }
    }
    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/products", { cache: 'no-store' }); // Đảm bảo luôn lấy dữ liệu mới nhất
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProducts(data);
            console.log(data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getAllCategories()
        loadProducts();
    }, []);

    return (
        <div>
            {/* Tiêu đề */}
            <h1 className="text-3xl font-bold mb-6 text-pink-600">Danh sách sản phẩm</h1>

            {/* Bộ lọc danh mục */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${selectedCategory === null
                        ? "bg-pink-500 text-white"
                        : "bg-white hover:bg-gray-100"
                        }`}
                >
                    Tất cả
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${selectedCategory === cat.id
                            ? "bg-pink-500 text-white"
                            : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((prod) => (
                    <div
                        key={prod.id}
                        className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                    >
                        {/* Hình sản phẩm */}
                        <div className="h-40 bg-gray-200 flex items-center justify-center rounded-t-lg text-gray-500">
                            Hình ảnh
                        </div>

                        {/* Thông tin */}
                        <div className="p-4">
                            <h3 className="font-semibold text-lg">{prod.name}</h3>
                            <p className="text-pink-600 font-bold mt-1">
                                {prod.price.toLocaleString()}đ
                            </p>

                            <button className="mt-3 w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
