"use client";

import { useState, useEffect } from "react";
import { Product } from "../../../app/types/interfaces";
// import { Product } from "@/types/product";

export default function ProductForm({
    open,
    setOpen,
    product,
    refresh,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    product: Product | null;
    refresh: () => void;
}) {
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
    });

    // Khi mở form sửa → đổ dữ liệu vào input
    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                price: String(product.price),
                category: String(product.categoryId),
            });
        } else {
            setForm({ name: "", price: "", category: "" });
        }
    }, [product, open]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            price: Number(form.price),
            category: Number(form.category),
        };

        try {
            if (product) {
                // Update
                await fetch(`/api/products/${product.id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
            } else {
                // Create
                await fetch(`/api/products`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }

            refresh();
            setOpen(false);
        } catch (err) {
            console.log("Error:", err);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                    {product ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block mb-1">Tên sản phẩm</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Nhập tên..."
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-1">Giá</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="0"
                            required
                        />
                    </div>

                    {/* category */}
                    <div>
                        <label className="block mb-1">Kho</label>
                        <input
                            type="number"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="0"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            {product ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
