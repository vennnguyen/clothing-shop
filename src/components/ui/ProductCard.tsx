import Link from "next/link";
import React from "react";
import { Product } from "../../app/types/interfaces";
interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link
            href={`/product/${product.id}`}
            className="block rounded-lg shadow hover:shadow-lg transition cursor-pointer group"
        >
            {/* Phần hình ảnh */}
            <div className="h-80 bg-gray-200 rounded-t-lg flex items-center justify-center text-gray-500 overflow-hidden relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Phần thông tin */}
            <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                <p className="text-orange-600 font-bold mt-1">
                    {product.price.toLocaleString()}Đ
                </p>
            </div>
        </Link>
    );
};

export default ProductCard;