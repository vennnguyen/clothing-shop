"use client";


import { useEffect, useState } from "react";
import { Product } from "../../types/interfaces";
import ProductTable from "../../../components/admin/products/ProductTable";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);

    const loadProducts = async () => {
        const res = await fetch("/api/products");
        setProducts(await res.json());
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-5">📦 Quản lý sản phẩm</h1>
            <ProductTable products={products} refresh={loadProducts} />
        </div>
    );
}
