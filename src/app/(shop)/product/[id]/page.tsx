'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Minus, ChevronUp, ChevronDown } from 'lucide-react';
import { ProductDetail, ProductImages } from '../../../types/interfaces';
import ImageSlider from '../../../../components/ui/ImageSlider';
import { useParams } from 'next/navigation';

// Hàm format tiền tệ VNĐ
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const ProductPage = () => {
    const { id } = useParams();
    // Biến này để đảm bảo chỉ render các component nặng (như Slider) ở Client
    const [isClient, setIsClient] = useState(false);

    // State lưu 1 object ProductDetail hoặc null (khi chưa load)
    const [product, setProduct] = useState<ProductDetail | null>(null);

    // FIX LỖI: Khởi tạo là chuỗi rỗng '', KHÔNG ĐƯỢC gọi product.images ở đây vì product đang null
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    // useEffect chạy 1 lần khi mount
    useEffect(() => {
        setIsClient(true);
        getProduct();
    }, []);

    // FIX LỖI: Dùng useEffect để set ảnh mặc định KHI VÀ CHỈ KHI product đã có dữ liệu
    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            // Ưu tiên ảnh chính (isMain), nếu không có thì lấy ảnh đầu tiên
            const mainImage = product.images.find(img => img.isMain) || product.images[0];
            setSelectedImage(mainImage.imageUrl);
        }
        if (product && product.sizes && product.sizes.length > 0) {
            const sizes = product.sizes;
            setSelectedSize(sizes[0].sizeName);
        }
    }, [product]); // Chạy lại mỗi khi biến product thay đổi
    useEffect(() => {
        setQuantity(1);
    }, [selectedSize]);
    // Hàm xử lý hiển thị ảnh (giữ nguyên logic cũ)
    const getDisplayImage = (url: string) => {
        if (!url) return 'https://via.placeholder.com/500?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        const baseUrl = 'http://localhost:3000';
        return `${baseUrl}${url}`;
    };

    const getProduct = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/products/${id}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            setProduct(data);
            console.log(data)
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const getQuantityBasedOnSize = () => {
        if (!product || !product.sizes) return 0;
        const sizeData = product.sizes.find(s => s.sizeName === selectedSize);
        return sizeData ? sizeData.quantity : 0;
    }
    const stockQuantity = getQuantityBasedOnSize();
    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'decrease' && quantity > 1) setQuantity(prev => prev - 1);
        if (type === 'increase') {

            if (quantity < Number(stockQuantity)) {
                setQuantity(prev => prev + 1);
            }
        }
    };
    // Nếu đang load hoặc không có sản phẩm, hiển thị loading
    if (!isClient || isLoading || !product) {
        return (
            <div className="bg-gray-50 min-h-screen py-8 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-gray-300 rounded-full mb-2"></div>
                    <div className="text-gray-500">Đang tải sản phẩm...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
                    <div className="lg:col-span-6 flex flex-col-reverse items-start md:flex-row gap-4">
                        <div className="w-full md:w-[100px] flex-shrink-0">
                            {isClient && product.images && product.images.length > 0 ? (
                                <ImageSlider
                                    images={product.images}
                                    selectedImageUrl={selectedImage}
                                    onSelect={(url) => setSelectedImage(url)}
                                />
                            ) : (
                                <div className="w-full h-full min-h-[300px] bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                                    No thumbnails
                                </div>
                            )}
                        </div>

                        <div className="flex-1 relative group">
                            <div className="w-full aspect-square overflow-hidden rounded-md border border-gray-100">
                                <img
                                    src={getDisplayImage(selectedImage)}
                                    alt={product.name || "Product Image"}
                                    className="w-full h-full object-cover object-center transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: THÔNG TIN SẢN PHẨM --- */}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                {/* <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold">Mall</span> */}
                                <h1 className="text-xl md:text-2xl font-medium text-gray-800 leading-snug">
                                    {product.name}
                                </h1>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 rounded-sm flex items-center gap-3">
                            <span className="text-3xl font-medium text-red-500">
                                {formatCurrency(product.price)}
                            </span>
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <span className="text-gray-500 text-sm w-24">Size</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((sizeItem: any) => (
                                        <button
                                            key={sizeItem.sizeId || Math.random()}
                                            className={`cursor-pointer px-4 py-2 rounded-sm text-sm transition-all bg-white hover:border-red-500 hover:text-red-500 ${selectedSize === sizeItem.sizeName
                                                ? "border border-red-500 text-red-500"
                                                : "border border-gray-200 text-gray-600"
                                                }`}
                                            onClick={() => setSelectedSize(sizeItem.sizeName)}
                                        >
                                            {sizeItem.sizeName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* {product.description && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-sm border border-gray-100">
                                <div className="font-medium mb-1 text-gray-700">
                                    Mô tả sản phẩm
                                </div>
                                <div>
                                    <p className="line-clamp-3 whitespace-pre-line">{product.description}</p>
                                </div>
                            </div>
                        )} */}
                        {product.description && (
                            <div className="bg-white rounded-lg">
                                <div className="bg-gray-50 p-3 mb-2 rounded-sm">
                                    <h2 className="text-lg font-medium text-gray-800 uppercase">Mô tả</h2>
                                </div>

                                <div className="relative ps-3">
                                    {/* Nội dung mô tả */}
                                    <div
                                        className={`
                                    text-sm text-gray-700 leading-relaxed whitespace-pre-line 
                                    ${isExpanded ? '' : 'line-clamp-5 overflow-hidden'}
                                `}
                                    >
                                        {product.description}
                                    </div>

                                    {/* Hiệu ứng mờ khi chưa mở rộng */}
                                    {!isExpanded && (
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                                    )}
                                </div>

                                {/* Nút Xem thêm / Thu gọn */}
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium text-sm transition-colors border border-red-500 hover:bg-red-50 px-6 py-2 rounded-sm"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <span>Thu gọn</span>
                                                <ChevronUp size={16} />
                                            </>
                                        ) : (
                                            <>
                                                <span>Xem thêm</span>
                                                <ChevronDown size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-gray-500 text-sm w-24">Số lượng</span>
                            <div className="flex items-center border border-gray-300 rounded-sm">
                                <button
                                    onClick={() => handleQuantityChange('decrease')}
                                    className="px-3 py-1 bg-white hover:bg-gray-50 border-r border-gray-300 text-gray-600"
                                >
                                    <Minus size={10} />
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    suppressHydrationWarning={true}
                                    className="w-12 text-center text-sm font-medium focus:outline-none"
                                />
                                <button
                                    onClick={() => handleQuantityChange('increase')}
                                    className="px-3 py-1 bg-white hover:bg-gray-50 border-l border-gray-300 text-gray-600"
                                >
                                    <Plus size={10} />
                                </button>
                            </div>
                            <span className="text-gray-400 text-sm">
                                {stockQuantity} sản phẩm có sẵn
                            </span>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button className="cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-red-500 bg-red-50 text-red-500 rounded-sm hover:bg-red-100 transition-colors">
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                            {/* <button className="flex-1 md:flex-none px-12 py-3 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors font-medium shadow-sm">
                                Mua ngay
                            </button> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductPage;