"use client";
import { useCallback, useEffect, useState } from "react";
import { Product } from "../../types/interfaces";
import ProductTable from "../../../components/admin/products/ProductTable";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);

    const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

    const loadProducts = useCallback(async (searchKeyword = "") => {
        try {
            // Lưu ý: Có thể bỏ setIsLoading(true) ở đây nếu muốn tránh nháy loading khi gõ phím
            // setIsLoading(true); 

            const url = searchKeyword
                ? `/api/products?search=${encodeURIComponent(searchKeyword)}`
                : "/api/products";

            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    }, []); // Dependency array rỗng: Hàm này chỉ tạo 1 lần duy nhất

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-5">QUẢN LÝ SẢN PHẨM</h1>

            {/* Hiển thị Loading hoặc Bảng dữ liệu */}
            {isLoading ? (
                <div className="text-center py-10">Đang tải dữ liệu...</div>
            ) : (
                <ProductTable
                    products={products}
                    // Khi refresh (ví dụ sau khi thêm mới), ta gọi loadProducts() không tham số để load lại tất cả
                    refresh={() => loadProducts()}

                    // Truyền hàm loadProducts xuống để ProductTable gọi khi người dùng gõ tìm kiếm
                    onSearch={loadProducts}
                />
            )}
        </div>
    );
}
