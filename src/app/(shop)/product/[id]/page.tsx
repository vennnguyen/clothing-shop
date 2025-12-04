'use client';

import React, { useState } from 'react';
// Đổi đường dẫn tới file ImageSlider của bạn
import { Plus, Minus } from 'lucide-react';
import { Product, ProductImages, ProductSizes } from '../../../types/interfaces';
import ImageSlider from '../../../../components/ui/ImageSlider';
import { useParams } from 'next/navigation';

// Dữ liệu giả lập (Mock Data) để test hiển thị
const MOCK_IMAGES: ProductImages[] = [
    { id: 1, imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmrn0d3j5p6f32', isMain: true }, // Ảnh chính
    { id: 2, imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmrn0d3j73qvf2', isMain: false }, // Bảng màu
    { id: 3, imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmrn0d3j8ibbfb', isMain: false }, // Môi 13
    { id: 4, imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmrn0d3j9wvv2a', isMain: false }, // Môi 14
    { id: 5, imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmrn0d3jbcgb9e', isMain: false }, // Môi 15
];

const ProductPage = () => {
    const { id } = useParams();
    // State lưu URL của ảnh đang được chọn
    const [product, setProduct] = useState<Product[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>(MOCK_IMAGES[0].imageUrl);
    const [quantity, setQuantity] = useState(1);

    // Hàm xử lý hiển thị ảnh (giống logic trong slider để đảm bảo đồng bộ)
    const getDisplayImage = (url: string) => {
        if (!url) return 'https://via.placeholder.com/500?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        const baseUrl = 'http://localhost:3000'; // Hoặc lấy từ env
        return `${baseUrl}${url}`;
    };
    const getProduct = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/products/${id}`);
            const data = await res.json();
            setProduct(data);
            console.log(data);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm");

        }
    }
    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'decrease' && quantity > 1) setQuantity(prev => prev - 1);
        if (type === 'increase') setQuantity(prev => prev + 1);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- CỘT TRÁI: ẢNH SẢN PHẨM (Chiếm 5 phần) --- */}
                    <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
                        {/* 1. Slider Thumbnails (Dọc ở Desktop, Ngang ở Mobile) */}
                        <div className="w-full md:w-[100px] flex-shrink-0">
                            <ImageSlider
                                images={MOCK_IMAGES}
                                selectedImageUrl={selectedImage}
                                onSelect={(url) => setSelectedImage(url)}
                            />
                        </div>

                        {/* 2. Ảnh hiển thị chính (To) */}
                        <div className="flex-1 relative group">
                            <div className="w-full aspect-square overflow-hidden rounded-md border border-gray-100">
                                <img
                                    src={getDisplayImage(selectedImage)}
                                    alt="Main product"
                                    className="w-full h-full object-cover object-center transition-transform duration-500"
                                />
                                {/* Label góc ảnh giống Shopee */}
                                <div className="absolute top-0 left-0">
                                    <div className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-br-lg">
                                        Yêu thích
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: THÔNG TIN SẢN PHẨM (Chiếm 7 phần) --- */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Title */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold">Mall</span>
                                <h1 className="text-xl md:text-2xl font-medium text-gray-800 leading-snug">
                                    [DUSTY ON THE NUDE] Son Dưỡng Dạng Thỏi Có Màu Thuần Chay Romand Glasting Melting Balm 3.5g
                                </h1>
                            </div>

                            {/* Rating / Sold count mock */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-1 text-red-500 border-b border-red-500 cursor-pointer">
                                    <span className="font-semibold underline">4.9</span>
                                    <span>★★★★★</span>
                                </div>
                                <div className="w-[1px] h-4 bg-gray-300"></div>
                                <div><span className="text-black font-semibold border-b border-black">10.2k</span> Đánh giá</div>
                                <div className="w-[1px] h-4 bg-gray-300"></div>
                                <div><span className="text-black font-semibold border-b border-black">34.5k</span> Đã bán</div>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gray-50 px-4 py-3 rounded-sm flex items-center gap-3">
                            <span className="text-gray-400 line-through text-sm">₫299.000</span>
                            <span className="text-3xl font-medium text-red-500">₫199.000</span>
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-sm">-33%</span>
                        </div>

                        {/* Variants (Màu sắc) - Mô phỏng */}
                        <div className="flex flex-col gap-3">
                            <span className="text-gray-500 text-sm w-24">Màu sắc</span>
                            <div className="flex flex-wrap gap-2">
                                {['13 Scotch Nude', '14 Dear Apple', '15 Pecan Brew'].map((variant) => (
                                    <button
                                        key={variant}
                                        className="px-4 py-2 border border-gray-200 hover:border-red-500 hover:text-red-500 text-gray-600 rounded-sm text-sm transition-all focus:border-red-500 focus:text-red-500 bg-white"
                                    >
                                        {variant}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
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
                                    className="w-12 text-center text-sm font-medium focus:outline-none"
                                />
                                <button
                                    onClick={() => handleQuantityChange('increase')}
                                    className="px-3 py-1 bg-white hover:bg-gray-50 border-l border-gray-300 text-gray-600"
                                >
                                    <Plus size={10} />
                                </button>
                            </div>
                            <span className="text-gray-400 text-sm">48 sản phẩm có sẵn</span>
                        </div>

                        {/* Actions Buttons */}
                        <div className="flex items-center gap-4 mt-4">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-red-500 bg-red-50 text-red-500 rounded-sm hover:bg-red-100 transition-colors">
                                {/* <FaCartPlus /> */}
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                            <button className="flex-1 md:flex-none px-12 py-3 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors font-medium shadow-sm">
                                Mua ngay
                            </button>
                        </div>

                        {/* Guarantee Policy (Giống ảnh Shopee) */}
                        <div className="border-t border-gray-100 pt-6 mt-2 flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/2c4636.png" className="w-4 h-4" alt="" />
                                <span>Đổi ý miễn phí 15 ngày</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/16ead7.png" className="w-4 h-4" alt="" />
                                <span>Hàng chính hãng 100%</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;