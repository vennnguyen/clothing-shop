"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Category, Product } from "../../../app/types/interfaces";
import AddProductImage, { ImageInput } from "./AddProductImage"; // Import component ảnh
import { XIcon } from "lucide-react";
interface ProductFormProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    product: Product | null;
    refresh: () => void;
}

interface FormDataState {
    name: string;
    price: number | string;
    quantity: number | string;
    category: string;
    description: string;
    size: string;
}
interface FormErrors {
    name?: string;
    price?: string;
    quantity?: string;
    category?: string;
    size?: string;
    images?: string; // Thêm lỗi cho phần ảnh
}
export default function ProductForm({ open, setOpen, product, refresh }: ProductFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    // State cho thông tin text
    const [form, setForm] = useState<FormDataState>({
        name: "",
        price: "",
        quantity: "",
        category: "",
        description: "",
        size: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    // State cho danh sách ảnh (được quản lý tại đây để gửi đi)
    const [images, setImages] = useState<ImageInput[]>([{ id: 1 }, { id: 2 }, { id: 3 }]);
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
    useEffect(() => {
        getAllCategories();
    }, [])
    // Reset form khi mở modal
    useEffect(() => {
        if (open) {
            setErrors({});
            if (product) {
                // Mode: EDIT (Sửa)
                setForm({
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity || 0,
                    category: String(product.category),
                    description: product.description || "",
                    size: product.sizes || "",
                });
                // TODO: Nếu edit, bạn cần logic để load ảnh cũ từ server vào state 'images' ở đây
            } else {
                // Mode: ADD (Thêm mới)
                setForm({ name: "", price: "", quantity: "", category: "", description: "", size: "" });
                setImages([{ id: 1 }, { id: 2 }, { id: 3 }]); // Reset ảnh về rỗng
            }
        }
    }, [product, open]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };
    const validateForm = () => {
        const newErrors: FormErrors = {};
        let isValid = true;

        // Validate Tên
        if (!form.name.trim()) {
            newErrors.name = "Tên sản phẩm không được để trống";
            isValid = false;
        }

        // Validate Giá
        if (!form.price || Number(form.price) <= 0) {
            newErrors.price = "Giá phải lớn hơn 0";
            isValid = false;
        }

        // Validate Số lượng
        if (form.quantity === "" || Number(form.quantity) < 0) {
            newErrors.quantity = "Số lượng không hợp lệ";
            isValid = false;
        }

        // Validate Danh mục
        if (!form.category) {
            newErrors.category = "Vui lòng chọn danh mục";
            isValid = false;
        }

        // Validate Size
        if (!form.size) {
            newErrors.size = "Vui lòng chọn size";
            isValid = false;
        }

        // Validate Ảnh
        const validImageCount = images.filter((img) => img.file).length;

        // 2. Kiểm tra điều kiện: Nếu là Thêm mới (!product) và số lượng < 3
        if (!product && validImageCount < 3) {
            // Gán thông báo lỗi chi tiết
            newErrors.images = `Vui lòng chọn tối thiểu 3 hình ảnh (đã chọn: ${validImageCount}/3)`;
            isValid = false;
        }

        setErrors(newErrors); // Cập nhật state lỗi để hiển thị ra màn hình
        return isValid;
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            // SỬ DỤNG FORMDATA ĐỂ GỬI CẢ FILE VÀ TEXT
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("price", String(form.price));
            formData.append("quantity", String(form.quantity));
            formData.append("category", form.category);
            formData.append("description", form.description);
            formData.append("size", form.size);

            // Duyệt qua mảng images và append file thực tế vào formData
            images.forEach((img) => {
                if (img.file) {
                    formData.append("images", img.file); // 'images' là tên field backend hứng
                }
            });

            const url = product ? `/api/products/${product.id}` : `/api/products`;
            const method = product ? "PUT" : "POST";

            // Lưu ý: Khi dùng FormData, KHÔNG cần header 'Content-Type': 'application/json'
            const res = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!res.ok) throw new Error("Có lỗi xảy ra khi lưu sản phẩm");

            refresh();
            setOpen(false);
        } catch (err) {
            console.error("Error:", err);
            alert("Lỗi! Vui lòng kiểm tra lại kết nối hoặc dữ liệu.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        // Overlay nền đen
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">

            {/* Container Modal - Đã mở rộng thành max-w-6xl để chứa layout 2 cột */}
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">

                {/* Header xanh dương giống thiết kế */}
                <div className="bg-green-400 py-4 px-6 flex justify-between items-center">
                    <div className="w-300 text-center">
                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
                            {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                        </h2>
                    </div>
                    <div className="">
                        <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">
                            <i className="fa-solid fa-xmark text-2xl"></i> {/* Hoặc dùng SVG X */}
                            <XIcon className="mt-1" />
                        </button>
                    </div>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Cột trái: Component Ảnh (5 phần) */}
                        <div className="lg:col-span-5">
                            <AddProductImage images={images} setImages={setImages} />

                            {errors.images && (
                                <p className="text-red-500 text-sm mt-2 text-center font-medium">
                                    <i className="fa-solid fa-circle-exclamation mr-1"></i>
                                    {errors.images}
                                </p>
                            )}
                        </div>

                        {/* Cột phải: Form thông tin (7 phần) */}
                        <div className="lg:col-span-7 space-y-5 lg:border-l lg:border-gray-200 lg:pl-8">

                            {/* Tên sản phẩm */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tên sản phẩm</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 border rounded-lg outline-none transition-all ${errors.name
                                        ? "border-red-500 focus:ring-red-200 bg-red-50"
                                        : "border-gray-300 focus:ring-2 focus:ring-sky-400"
                                        }`}
                                    placeholder="Ví dụ: Áo thun Cotton..."
                                />
                                {/* Dòng text báo lỗi */}
                                {errors.name && <p className="text-red-500 text-xs mt-1 italic">{errors.name}</p>}
                            </div>
                            {/* Hàng 2 cột: Số lượng & Giá */}
                            {/* Số lượng & Giá */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Số lượng</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        className={`w-full p-2.5 border rounded-lg outline-none ${errors.quantity ? "border-red-500 bg-red-50" : "border-gray-300 focus:ring-sky-400"}`}
                                    />
                                    {errors.quantity && <p className="text-red-500 text-xs mt-1 italic">{errors.quantity}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Giá bán</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        className={`w-full p-2.5 border rounded-lg outline-none ${errors.price ? "border-red-500 bg-red-50" : "border-gray-300 focus:ring-sky-400"}`}
                                    />
                                    {errors.price && <p className="text-red-500 text-xs mt-1 italic">{errors.price}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none bg-white"
                                        required
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((cat) => (
                                            <option value={cat.id} key={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1 italic">{errors.category}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Size</label>
                                    <select
                                        name="size"
                                        value={form.size}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none bg-white"
                                    >
                                        <option value="">-- Chọn --</option>
                                        <option value="1">S</option>
                                        <option value="2">M</option>
                                        <option value="3">L</option>
                                        <option value="4">XL</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1 italic">{errors.size}</p>}
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả chi tiết</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none resize-none"
                                    placeholder="Mô tả về chất liệu, kiểu dáng..."
                                ></textarea>
                            </div>

                            {/* Footer Buttons */}
                            <div className="pt-4 flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                                    disabled={isLoading}
                                >
                                    Hủy bỏ
                                </button>

                                <button
                                    type="submit"
                                    className={`px-8 py-2.5 bg-green-400 hover:bg-green-500 text-white font-bold rounded-lg shadow-md transition-all transform active:scale-95 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang lưu...' : (product ? 'Cập nhật' : 'Thêm sản phẩm')}
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}