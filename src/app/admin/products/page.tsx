"use client";
import { useEffect, useState } from "react";
import { Product } from "../../types/interfaces";
import ProductTable from "../../../components/admin/products/ProductTable";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);

    const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

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
        loadProducts();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-5">QUẢN LÝ SẢN PHẨM</h1>

            {/* Hiển thị Loading hoặc Bảng dữ liệu */}
            {isLoading ? (
                <div className="text-center py-10">Đang tải dữ liệu...</div>
            ) : (
                <ProductTable products={products} refresh={loadProducts} />
            )}
        </div>
    );
}
