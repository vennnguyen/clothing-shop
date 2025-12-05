"use client";

import { useState } from "react";

// Tích hợp trực tiếp vào file này
function formatPrice(priceNumber: number, locale: string = "vi-VN") {
  if (priceNumber == null) return "";
  return priceNumber.toLocaleString(locale) + "₫";
}

export default function DeliveryMethod() {


  const [selected, setSelected] = useState<"delivery" | "pick">("delivery");

  const itemClass =
    "flex items-center h-[75px] px-5 cursor-pointer border-2 border-gray-300";

  return (
    <div className="w-full mt-12">
      <h3 className="mb-7 text-lg font-semibold">Phương thức vận chuyển</h3>

      <div className="space-y-0">
        {/* Giao hàng tận nơi */}
        <div
          className={`${itemClass} rounded-t-md`}
          onClick={() => setSelected("delivery")}
        >
          <div className="w-[10%] flex justify-center">
            <input
              type="radio"
              name="shipping"
              checked={selected === "delivery"}
              onChange={() => setSelected("delivery")}
            />
          </div>

          <label className="w-[70%] text-gray-700 cursor-pointer">
            Giao hàng tận nơi
          </label>

          <span className="w-[20%] text-gray-800 text-sm text-right">
            {formatPrice(20000)}
          </span>
        </div>

        {/* Lấy tại cửa hàng */}
        <div
          className={`${itemClass} rounded-b-md border-t-0`}
          onClick={() => setSelected("pick")}
        >
          <div className="w-[10%] flex justify-center">
            <input
              type="radio"
              name="shipping"
              checked={selected === "pick"}
              onChange={() => setSelected("pick")}
            />
          </div>

          <label className="w-[70%] text-gray-700 cursor-pointer">
            Lấy tại cửa hàng
          </label>

          <span className="w-[20%] text-gray-800 text-sm text-right">
            {formatPrice(0)}
          </span>
        </div>
      </div>
    </div>
  );
}
