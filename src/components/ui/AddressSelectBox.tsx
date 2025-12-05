"use client";

import { useState } from "react";

type AddressOption = {
  id: number;
  value: string;
};

export default function AddressSelectBox() {
  const addresses: AddressOption[] = [
    { id: 1, value: "123 Đường ABC, Quận 1, TP.HCM" },
    { id: 2, value: "456 Đường XYZ, Quận 3, TP.HCM" },
    { id: 3, value: "789 Đường DEF, Quận 5, TP.HCM" },
    { id: 4, value: "JQK Đường ALQ, Quận 6, TP.HCM" },
  ];

  const [selected, setSelected] = useState<number>(1);

  return (
    <div className="mt-6 mb-6 ">
      <h3 className="text-lg font-semibold mb-3">Chọn địa chỉ giao hàng</h3>
      <div className="max-h-[140px] overflow-y-auto space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`flex items-center cursor-pointer p-4 border-2 rounded-md mr-3 ${
              selected === addr.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
            onClick={() => setSelected(addr.id)}
          >
            <input
              type="radio"
              name="address"
              checked={selected === addr.id}
              onChange={() => setSelected(addr.id)}
              className="w-4 h-4 accent-blue-500 mr-15"
            />
            <span className="text-gray-700">{addr.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
