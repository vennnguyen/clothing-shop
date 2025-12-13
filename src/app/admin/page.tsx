"use client";
import React, { useEffect, useState } from "react";
import {
    ShoppingBag,
    Users,
    DollarSign,
    Package,
    ArrowUpRight,
    AlertCircle,
    ClipboardList
} from "lucide-react";
interface LowStockItem {
    id: number;
    productName: string;
    sizeName: string;
    categoryName: string;
    quantity: number;
    imageUrl: string;
}
interface OrderItem {
    id: number;
    customerName: string;
    createdDate: string; // Dạng ISO string từ DB
    cost: number;
    statusId: number;
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    // State Inventory
    const [totalProducts, setTotalProducts] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [lowStockList, setLowStockList] = useState<LowStockItem[]>([]);

    // State Orders
    const [revenue, setRevenue] = useState(0);
    const [todayOrdersCount, setTodayOrdersCount] = useState(0);
    const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };
    const getOrderStatus = (id: number) => {
        switch (id) {
            case 1: return { label: "Chờ xử lí", color: "text-yellow-600 bg-yellow-100" };
            case 2: return { label: "Đang giao", color: "text-blue-600 bg-blue-100" };
            case 3: return { label: "Hoàn thành", color: "text-green-600 bg-green-100" };
            case 4: return { label: "Đã hủy", color: "text-red-600 bg-red-100" };
            default: return { label: "Khác", color: "text-gray-600 bg-gray-100" };
        }
    };
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Gọi song song cả 2 API để tiết kiệm thời gian
                const [invRes, ordRes] = await Promise.all([
                    fetch('/api/dashboard/inventory'),
                    fetch('/api/dashboard/orders')
                ]);

                if (invRes.ok) {
                    const invData = await invRes.json();
                    setTotalProducts(invData.totalProducts);
                    setLowStockCount(invData.lowStockCount);
                    setLowStockList(invData.lowStockProducts);
                }

                if (ordRes.ok) {
                    const ordData = await ordRes.json();
                    setRevenue(ordData.revenue);
                    setTodayOrdersCount(ordData.todayOrders);
                    setRecentOrders(ordData.recentOrders);
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const stats = [
        {
            label: "Tổng doanh thu",
            value: loading ? "..." : formatCurrency(revenue),
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-100",
            trend: "" // Có thể tính thêm logic tăng trưởng nếu muốn
        },
        {
            label: "Đơn hàng hôm nay",
            value: loading ? "..." : todayOrdersCount,
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-100",
            trend: ""
        },
        {
            label: "Sản phẩm",
            value: loading ? "..." : totalProducts,
            icon: Package,
            color: "text-purple-600",
            bg: "bg-purple-100",
            trend: ""
        },
        {
            label: "Cần nhập hàng",
            value: loading ? "..." : lowStockCount,
            icon: AlertCircle,
            color: "text-red-600",
            bg: "bg-red-100",
            sub: "Tồn kho thấp"
        },
    ];
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header & Stats Grid: GIỮ NGUYÊN (Chỉ thay đổi data trong biến stats ở trên) */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    {/* <p className="text-gray-500 text-sm">Tổng quan tình hình kinh doanh hôm nay</p> */}
                </div>
                {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <ClipboardList size={18} />
                    Tạo Phiếu Nhập
                </button> */}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                {stat.trend && <span className="text-green-600 flex items-center font-medium"><ArrowUpRight size={14} /> {stat.trend}</span>}
                                {stat.sub && <span className="text-red-500 font-medium">{stat.sub}</span>}
                            </div>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table (Giữ nguyên Mock Data, sẽ làm ở bước sau) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Đơn hàng giá trị cao (Top 5)</h2>
                        <a href="/admin/orders" className="text-blue-600 text-sm hover:underline">Xem tất cả</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 text-sm border-b border-gray-100">
                                    <th className="pb-3 font-medium">Mã ĐH</th>
                                    <th className="pb-3 font-medium">Khách hàng</th>
                                    <th className="pb-3 font-medium">Tổng tiền</th>
                                    <th className="pb-3 font-medium">Trạng thái</th>
                                    <th className="pb-3 font-medium">Ngày</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-4">Đang tải...</td></tr>
                                ) : recentOrders.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-4 text-gray-400">Chưa có đơn hàng nào</td></tr>
                                ) : (
                                    recentOrders.map((order, idx) => {
                                        const statusObj = getOrderStatus(order.statusId);
                                        return (
                                            <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                                                <td className="py-4 font-medium text-blue-600 hover:underline cursor-pointer">
                                                    <a href={`/admin/order/${order.id}`}>#{order.id}</a>
                                                </td>
                                                <td className="py-4 text-gray-600">{order.customerName || "Khách lẻ"}</td>
                                                <td className="py-4 font-bold text-gray-800">{formatCurrency(order.cost)}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusObj.color}`}>
                                                        {statusObj.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-gray-500">{formatDate(order.createdDate)}</td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alert: HIỂN THỊ DỮ LIỆU THẬT */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Sắp hết hàng</h2>
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">Cần nhập gấp</span>
                    </div>

                    {loading ? (
                        <p className="text-gray-400 text-sm">Đang tải...</p>
                    ) : lowStockList.length === 0 ? (
                        <p className="text-green-600 text-sm">Kho hàng ổn định!</p>
                    ) : (
                        <div className="space-y-4">
                            {lowStockList.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                            {/* <Package size={20} /> */}
                                            <img src={item.imageUrl} alt="" />
                                        </div>
                                        <div>
                                            {/* Hiển thị Tên SP + Size */}
                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                                {item.productName} ({item.sizeName})
                                            </p>
                                            <p className="text-xs text-gray-500">{item.categoryName || "Chưa phân loại"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${item.quantity === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                                            SL: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* <button className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
                        Xem kho hàng
                    </button> */}
                </div>

            </div>
        </div>
    );
}