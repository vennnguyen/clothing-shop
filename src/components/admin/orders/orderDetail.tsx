"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ProductItem } from "./productItem";
import { Order } from "../../../app/types/interfaces";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  order: Order | null;
}

interface Product {
  id: number;
  imageUrl: string;
  productName: string;
  quantity: number;
  price: number;
  sizeName: string;
}

interface OrderDetail {
  orderId: number;
  createdDate: string;
  shippedDate: string | null;
  statusId: number;
  customer: {
    fullName: string;
    phone: string;
  };
  address: {
    houseNumber: string;
    ward: string;
    city: string;
  };
  items: Product[];
  totalCost: number;
}

const STATUS_OPTIONS = [
  { id: 1, label: "Chờ xử lý" },
  { id: 2, label: "Đang giao hàng" },
  { id: 3, label: "Hoàn thành" },
  { id: 4, label: "Đã hủy" },
];

export default function OrderDetailModal({ open, setOpen, order }: Props) {
  const [data, setData] = useState<OrderDetail | null>(null);
  const [statusId, setStatusId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  /* Load chi tiết đơn */
  useEffect(() => {
    if (!open || !order) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orderdetails/${order.orderId}`);
        if (!res.ok) throw new Error("Fetch failed");
        const json: OrderDetail = await res.json();
        setData(json);
        setStatusId(json.statusId);
      } catch (err) {
        console.error("Lỗi lấy chi tiết đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [open, order]);

  /* Update trạng thái */
  const updateOrder = async () => {
    if (!order) return;

    try {
      setUpdating(true);

      const res = await fetch(
        `/api/orders/${order.orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statusId }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Cập nhật thất bại");
      }

      alert("✅ Cập nhật trạng thái thành công");
      setOpen(false);
    } catch (error: any) {
      alert("❌ " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (!open) return null;

  if (loading || !data) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white px-6 py-4 rounded">Đang tải...</div>
      </div>
    );
  }

  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-gray-50 w-[90%] max-w-6xl rounded-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
          <h2 className="text-lg font-semibold">
            Chi tiết đơn hàng #{order?.orderId}
          </h2>
          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-10 gap-6 max-h-[80vh] overflow-y-auto">

          {/* LEFT */}
          <div className="col-span-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="mb-4 font-semibold">Danh sách sản phẩm</h3>

              <div className="space-y-3">
                {data.items.map((item) => (
                  <ProductItem
                    key={item.id}
                    image={item.imageUrl}
                    name={item.productName}
                    quantity={item.quantity}
                    price={item.price}
                    size={item.sizeName}
                  />
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between bg-blue-50 p-4 rounded-lg">
                  <span>Tổng tiền</span>
                  <span className="text-blue-600 font-semibold">
                    {totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="mb-4 font-semibold">Thông tin khách hàng</h3>

              <Info label="Khách hàng" value={data.customer.fullName} />
              <Info label="SĐT" value={data.customer.phone} />
              <Info
                label="Địa chỉ"
                value={`${data.address.houseNumber}, ${data.address.ward}, ${data.address.city}`}
              />
              <Info
                label="Ngày đặt"
                value={new Date(data.createdDate).toLocaleDateString("vi-VN")}
              />

              {/* Trạng thái */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-2">
                  Trạng thái đơn hàng
                </label>
                <select
                  value={statusId}
                  onChange={(e) => setStatusId(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Button */}
              <div className="pt-4">
                <button
                  disabled={updating}
                  onClick={updateOrder}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? "Đang cập nhật..." : "Cập nhật đơn hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-white border-t flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="mb-3">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <div className="px-4 py-2 bg-gray-100 rounded border">
        {value || "-"}
      </div>
    </div>
  );
}
