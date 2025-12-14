"use client";
import { useCallback, useEffect, useState } from "react";
import { Order } from "../../types/interfaces";
import OrderTable from "../../../components/admin/orders/orderTable";

export default function OrderssPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

    const loadOrders = useCallback(async (searchKeyword = "",status="") => {
        try {
            // Lưu ý: Có thể bỏ setIsLoading(true) ở đây nếu muốn tránh nháy loading khi gõ phím
            // setIsLoading(true); 

            let url = `/api/orders?`;

      if (searchKeyword) url += `search=${encodeURIComponent(searchKeyword)}&`;
      if (status) url += `status=${status}`;

            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    }, []); // Dependency array rỗng: Hàm này chỉ tạo 1 lần duy nhất

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-5">QUẢN LÝ ĐƠN HÀNG</h1>

            {/* Hiển thị Loading hoặc Bảng dữ liệu */}
            {isLoading ? (
                <div className="text-center py-10">Đang tải dữ liệu...</div>
            ) : (
                <OrderTable
                    orders={orders}
                    // Khi refresh (ví dụ sau khi thêm mới), ta gọi loadProducts() không tham số để load lại tất cả
                    refresh={() => loadOrders()}

                    // Truyền hàm loadProducts xuống để ProductTable gọi khi người dùng gõ tìm kiếm
                    onSearch={loadOrders}
                />
            )}
        </div>
    );
}
