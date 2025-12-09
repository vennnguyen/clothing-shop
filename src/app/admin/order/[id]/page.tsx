"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Calendar, MapPin, User, Phone, Mail, CreditCard, Package
} from "lucide-react";

interface OrderDetail {
    id: number;
    createdDate: string;
    cost: number;
    statusId: number;
    statusName: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    houseNumber: string;
    ward: string;
    city: string;
}

interface OrderItem {
    productId: number;
    productName: string;
    sizeName: string;
    quantity: number;
    price: number;
    image: string;
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper: Format tiền
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    // Helper: Format ngày
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('vi-VN');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/dashboard/orders/${id}`);
                if (!res.ok) throw new Error("Lỗi tải đơn hàng");
                const data = await res.json();
                setOrder(data.order);
                setItems(data.items);
                console.log(data.items);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetail();
    }, [id]);

    if (loading) return <div className="p-6">Đang tải chi tiết đơn hàng...</div>;
    if (!order) return <div className="p-6">Không tìm thấy đơn hàng.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Nút Back */}
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-blue-600 mb-4 transition cursor-pointer"
            >
                <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách
            </button>

            {/* Header: Mã đơn + Trạng thái */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Đơn hàng #{order.id}
                        {/* Badge trạng thái */}
                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
                            {order.statusName || "Trạng thái khác"}
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                        <Calendar size={14} /> Ngày đặt: {formatDate(order.createdDate)}
                    </p>
                </div>
                {/* Có thể thêm nút cập nhật trạng thái ở đây sau này */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* CỘT TRÁI: Danh sách sản phẩm (Chiếm 2/3) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-gray-700 flex items-center gap-2">
                                <Package size={18} /> Sản phẩm đã đặt
                            </h2>
                        </div>
                        <div className="p-4">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-sm border-b border-gray-100">
                                        <th className="pb-3 pl-2">Sản phẩm</th>
                                        <th className="pb-3 text-center">Đơn giá</th>
                                        <th className="pb-3 text-center">Số lượng</th>
                                        <th className="pb-3 text-right pr-2">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="border-b last:border-0 border-gray-50">
                                            <td className="py-4 pl-2">
                                                <div className="flex items-center gap-3">
                                                    {/* Ảnh sản phẩm (Placeholder nếu không có ảnh) */}
                                                    <div className="w-12 h-12 bg-gray-100 rounded md:w-16 md:h-16 flex-shrink-0 overflow-hidden">
                                                        {item.image ? (
                                                            <img src={`${item.image}`} alt={item.productName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 line-clamp-2">{item.productName}</p>
                                                        <p className="text-sm text-gray-500">Size: {item.sizeName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center text-gray-600">{formatCurrency(item.price)}</td>
                                            <td className="py-4 text-center font-medium">{item.quantity}</td>
                                            <td className="py-4 text-right pr-2 font-bold text-gray-800">
                                                {formatCurrency(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Tổng tiền footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Tổng giá trị đơn hàng</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(order.cost)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: Thông tin khách hàng (Chiếm 1/3) */}
                <div className="space-y-6">

                    {/* Thẻ thông tin khách hàng */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Thông tin khách hàng</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <User className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Họ tên</p>
                                    <p className="font-medium text-gray-800">{order.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium text-gray-800">{order.customerPhone || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-800 break-all">{order.customerEmail || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thẻ địa chỉ giao hàng */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Địa chỉ giao hàng</h3>
                        <div className="flex items-start gap-3">
                            <MapPin className="text-gray-400 mt-1" size={18} />
                            <div>
                                {/* Hiển thị dòng 1: Số nhà + Phường */}
                                <p className="font-medium text-gray-800">
                                    {order.houseNumber ? `${order.houseNumber}, ` : ""}
                                    {order.ward}
                                </p>
                                {/* Hiển thị dòng 2: Thành phố */}
                                <p className="text-gray-500">{order.city}</p>
                            </div>
                        </div>
                    </div>

                    {/* Thẻ thanh toán (Demo) */}
                    {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Thanh toán</h3>
                        <div className="flex items-center gap-3">
                            <CreditCard className="text-green-500" size={24} />
                            <div>
                                <p className="text-sm font-medium">Thanh toán khi nhận hàng (COD)</p>
                                <p className="text-xs text-gray-500">Chưa thanh toán</p>
                            </div>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    );
}