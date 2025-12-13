import Image from 'next/image';
import React from 'react';

interface ProductItemProps {
  image: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
}

export function ProductItem({ image, name, quantity, price, size }: ProductItemProps) {
  const totalPrice = quantity * price;
  
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Ảnh sản phẩm - 4 phần */}
      <div className="w-2/5 flex-shrink-0">
        <Image
  src={image && image.trim() !== "" ? image : "/images/no-image.png"}
  alt={name}
  width={96}
  height={96}
  className="w-full h-24 object-cover rounded-lg border"
  onError={(e) => {
    (e.target as HTMLImageElement).src = "/images/no-image.png";
  }}
/>
      </div>
      
      {/* Thông tin sản phẩm - 6 phần */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-gray-900">{name}</h3>
          {size && (
            <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              Size: {size}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Số lượng: {quantity}</span>
          <span className="text-gray-900">{totalPrice.toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="text-sm text-gray-500">
          Đơn giá: {price.toLocaleString('vi-VN')}đ
        </div>
      </div>
    </div>
  );
}