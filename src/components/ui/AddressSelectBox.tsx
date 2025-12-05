"use client";

import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type AddressOption = {
  id: number;
  value: string;
};

export default function AddressSelectBox({ customerId }: { customerId: number }) {
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  // Load default address từ API
  const loadDefaultAddress = async () => {
    try {
      const res = await fetch(`/api/customeraddress/${customerId}`);
      // const res = await fetch(`/api/customer-address/${customerId}`);
      if (!res.ok) throw new Error("Failed to fetch address");

      const addr = await res.json();
      const formattedAddress = `${addr.houseNumber}, ${addr.ward}, ${addr.city}`;

      setAddresses([{ id: addr.id, value: formattedAddress }]);
      setSelected(addr.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDefaultAddress();
  }, []);

  // Xóa địa chỉ
  const handleDelete = (id: number) => {
    if (addresses.length === 1) return; // không xóa nếu chỉ còn 1 địa chỉ

    const newAddresses = addresses.filter((addr) => addr.id !== id);
    setAddresses(newAddresses);

    if (selected === id) {
      setSelected(newAddresses[0].id);
    }
  };

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-lg font-semibold mb-3">Chọn địa chỉ giao hàng</h3>
      <div className="max-h-[140px] overflow-y-auto space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`flex items-center justify-between cursor-pointer p-4 border-2 rounded-md mr-3 ${
              selected === addr.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
            onClick={() => setSelected(addr.id)}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="address"
                checked={selected === addr.id}
                onChange={() => setSelected(addr.id)}
                className="w-4 h-4 accent-blue-500 mr-3"
              />
              <span className="text-gray-700">{addr.value}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(addr.id);
              }}
              className="text-red-500 font-bold ml-3 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
