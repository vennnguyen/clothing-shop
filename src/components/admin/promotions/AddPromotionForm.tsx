"use client";
import { useState, useEffect, useCallback } from "react";
import { Product } from "../../../app/types/interfaces";
import { ArrowLeft } from "lucide-react";
interface AddPromotionFormProps {
    changeMode: (mode: string) => void;
}
export default function AddPromotionForm({ changeMode }: AddPromotionFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        value: 0,
        startDate: "",
        endDate: "",
        status: 1,
    })

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const today = new Date().toISOString().split("T")[0];

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/products`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Loi khi tai san pham", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const toggleProductSelection = (productId: number) => {
        setSelectedProductIds((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        )
    };

    const handleSelectAll = () => {
        if (selectedProductIds.length === products.length) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(products.map(p => p.id));
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData, appliedProductIds: selectedProductIds,
        };
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[560px]">
            <div
                className="flex items-center gap-2 text-l font-bold mb-5 cursor-pointer"
                onClick={() => changeMode("list")}
            >
                <ArrowLeft size={14} />
                <span>Quay lại danh sách</span>
            </div>
            <h2 className="text-xl font-semibold mb-6 border-b pb-2">1. Thông tin khuyến mãi</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Tên khuyến mãi */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Tên chương trình</label>
                    <input
                        type="text"
                        required
                        className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ví dụ: Sale mùa hè"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Loại giảm giá */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Loại giảm giá</label>
                    <select
                        className="border p-2 rounded"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="percent">Phần trăm (%)</option>
                        <option value="money">Số tiền cố định (đ)</option>
                    </select>
                </div>

                {/* Giá trị giảm */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Giá trị giảm ({formData.type === 'percent' ? '%' : 'VNĐ'})</label>
                    <input
                        type="number"
                        required
                        className="border p-2 rounded"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    />
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Trạng thái</label>
                    <select
                        className="border p-2 rounded"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                    >
                        <option value={1}>Hoạt động</option>
                        <option value={0}>Tạm dừng</option>
                    </select>
                </div>

                {/* Ngày bắt đầu */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Ngày bắt đầu</label>
                    <input
                        type="date"
                        required
                        className="border p-2 rounded"
                        min={today}
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                </div>

                {/* Ngày kết thúc */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Ngày kết thúc</label>
                    <input
                        type="date"
                        required
                        className="border p-2 rounded"
                        min={today}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 border-b pb-2">2. Sản phẩm áp dụng ({selectedProductIds.length})</h2>

            {/* Thanh tìm kiếm sản phẩm nhanh */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm tên sản phẩm..."
                    className="border p-2 rounded w-full md:w-1/3"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="max-h-80 overflow-y-auto border rounded mb-6">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="p-3 border-b text-center">
                                <input
                                    className="cursor-pointer"
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedProductIds.length === products.length && products.length > 0}
                                />
                            </th>
                            <th className="p-3 border-b">Tên sản phẩm</th>
                            <th className="p-3 border-b text-right">Giá gốc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={3} className="text-center p-4">Đang tải sản phẩm...</td></tr>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className={`hover:bg-blue-50 cursor-pointer ${selectedProductIds.includes(product.id) ? 'bg-blue-50' : ''}`}
                                    onClick={() => toggleProductSelection(product.id)}
                                >
                                    <td className="p-3 border-b text-center">
                                        <input
                                            className="cursor-pointer"
                                            type="checkbox"
                                            checked={selectedProductIds.includes(product.id)}
                                            onChange={() => { }} // Đã xử lý ở cấp độ tr
                                        />
                                    </td>
                                    <td className="p-3 border-b">{product.name}</td>
                                    <td className="p-3 border-b text-right font-mono">
                                        {product.price?.toLocaleString()}đ
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={3} className="text-center p-4">Không tìm thấy sản phẩm nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    // className="px-6 py-2 border rounded hover:bg-gray-100"
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    // className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    className={`cursor-pointer px-8 py-2.5 bg-green-400 hover:bg-green-500 text-white font-bold rounded-lg shadow-md transition-all transform active:scale-95 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                >
                    Lưu khuyến mãi
                </button>
            </div>
        </form>
    )
}