"use client";


import { useEffect, useState } from "react";
import { Product } from "../../types/interfaces";
import ProductTable from "../../../components/admin/products/ProductTable";
import CategoryTable from "../../../components/admin/categories/CategoryTable";

export default function ProductsPage() {
    const [categories, setCategories] = useState<Product[]>([]);

    const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/categories", { cache: 'no-store' }); // Đảm bảo luôn lấy dữ liệu mới nhất
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setCategories(data);
            // console.log(data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-5">QUẢN LÝ DANH MỤC</h1>

            {/* Hiển thị Loading hoặc Bảng dữ liệu */}
            {isLoading ? (
                <div className="text-center py-10">Đang tải dữ liệu...</div>
            ) : (
                <CategoryTable categories={categories} refresh={loadCategories} />
            )}
        </div>
    );
}
