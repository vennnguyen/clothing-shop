// AddressSelectBox.tsx
"use client";

import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useToastMessage } from "../../../hooks/useToastMessage";

type AddressOption = {
  id: number;
  value: string;
};

type Props = {
  customerId: number;
  refresh?: boolean; // thêm prop để trigger reload
};

export default function AddressSelectBox({ customerId, refresh }: Props) {
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const { showSuccess, showError } = useToastMessage();


  const loadAddresses = async () => {
    if (!customerId || customerId <= 0) return;
    try {
      const res = await fetch(`/api/customeraddress/${customerId}`);
      if (!res.ok) throw new Error("Failed to fetch address");

      const addrs = await res.json(); // đây là mảng
      const formattedAddresses = addrs.map((addr: any) => ({
        id: addr.id,
        value: `${addr.houseNumber}, ${addr.ward}, ${addr.city}`,
        isDefault: addr.isDefault,
      }));

      setAddresses(formattedAddresses);

      // chọn mặc định: tìm địa chỉ có isDefault
      const defaultAddr = addrs.find((addr: any) => addr.isDefault) || addrs[0];
      setSelected(defaultAddr?.id || null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (customerId) {
      loadAddresses();
    }
  }, [customerId, refresh]);// reload khi refresh thay đổi

  const handleDelete = async (addressId: number) => {
    if (addresses.length === 1) {
      // alert("Phải có ít nhất 1 địa chỉ");
      showError("Phải có ít nhất 1 địa chỉ")
      return;
    }

    // if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    try {
      const res = await fetch(`/api/customeraddress/addressId/${addressId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Xóa địa chỉ thất bại");

      // Xóa khỏi state
      const newAddresses = addresses.filter((addr) => addr.id !== addressId);
      setAddresses(newAddresses);

      // Nếu địa chỉ đang chọn bị xóa, chọn địa chỉ còn lại đầu tiên
      if (selected === addressId) {
        setSelected(newAddresses[0]?.id || null);
      }

      // alert("Xóa địa chỉ thành công");
      showSuccess("Xóa địa chỉ thành công");
    } catch (error) {
      console.error(error);
      // alert("Xóa địa chỉ thất bại");
      showError("Xóa địa chỉ thất bại");
    }
  };

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-lg font-semibold mb-3">Chọn địa chỉ giao hàng</h3>
      <div className="max-h-[140px] overflow-y-auto space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`flex items-center justify-between cursor-pointer p-4 border-2 rounded-md mr-3 ${selected === addr.id
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
              className="text-red-500 font-bold ml-3 hover:text-red-700 cursor-pointer"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
