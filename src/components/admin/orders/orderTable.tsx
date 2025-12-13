
import { useEffect, useState } from "react";
import { Order } from "../../../app/types/interfaces";
// import ProductForm from "./ProductForm";
// import DeleteConfirm from "./DeleteConfirm";
import { Trash2, FilePenIcon, Plus } from "lucide-react";
import OrderDetail from "./orderDetail";
export default function OrderTable({
    orders,
    refresh,
    onSearch,
}: {
    orders: Order[];
    refresh: () => void;
    onSearch: (keyword: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    // console.log(orders);
    // ...
    // [MỚI] Kỹ thuật Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);

        // Nếu bạn cài ESLint chuẩn, nó sẽ bắt buộc thêm onSearch vào đây.
        // Nhờ có useCallback ở cha, việc thêm onSearch vào đây sẽ KHÔNG gây lặp nữa.
    }, [searchTerm, onSearch]);
    // ...

    return (
        <div className="bg-white p-4 shadow rounded">
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Nhập mã đơn, tên hoặc số điện thoại..."
                    className="w-100 px-4 py-2 my-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

            </div>
            <div className="overflow-y-auto max-h-[460px]">

                <table className="w-full border">
                    <thead className="bg-gray-100 text-center">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Ngày đặt</th>
                            <th className="p-2 border">Khách hàng</th>
                            <th className="p-2 border">Số điện thoại</th>
                            <th className="p-2 border">Tổng tiền</th>
                            <th className="p-2 border">Trạng thái</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o.orderId} className="border-t  text-center">
                                <td className="p-2 border">{o.orderId}</td>
                                <td className="p-2 border">{o.createdDate}</td>
                                <td className="p-2 border">
                                    {o.fullName}
                                </td>
                                <td className="p-2 border">{o.phone}</td>
                                <td className="p-2 border">{o.cost}</td>

                                <td className="p-2 border">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${o.statusName === "Completed"
                                        ? "bg-green-100 text-green-700 border-green-300"      // Đã xác nhận
                                        : o.statusName === "Pending"
                                            ? "bg-gray-100 text-gray-600 border-gray-300"         // Chưa xác nhận
                                            : o.statusName === "Shipping"
                                                ? "bg-blue-100 text-blue-700 border-blue-300"         // Đang giao
                                                : o.statusName === "Cancelled"
                                                    ? "bg-red-100 text-red-700 border-red-300"            // Đã hủy
                                                    : "bg-gray-100 text-gray-600 border-gray-300"           // Mặc định
                                        }
  `}>
                                        {o.statusName === "Completed" ? "Hoàn thành" :
                                            o.statusName === "Pending" ? "Chờ xử lí" :
                                                o.statusName === "Shipping" ? "Đang giao" : "Đã hủy"}
                                    </span>
                                </td>
                                <td className="p-2 border space-x-2">
                                    <button
                                        className="px-2 py-1 bg-white text-blue-500 border border-blue-500 rounded cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                        onClick={() => {
                                            setSelectedOrder(o);
                                            setOpen(true);
                                        }}
                                    >
                                        <FilePenIcon />
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-white text-red-500 border border-red-500 rounded cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200"
                                        onClick={() => {
                                            setSelectedOrder(o);
                                            setIsDeleteOpen(true);
                                        }}
                                    >
                                        <Trash2 />
                                    </button>
                                </td>
                            </tr>


                        ))}
                    </tbody>
                </table>
            </div>

            <OrderDetail
                open={open}
                setOpen={setOpen}
                order={selectedOrder}
            />

            {/* <DeleteConfirm
                open={isDeleteOpen}
                setOpen={setIsDeleteOpen}
                product={selected}
                refresh={refresh}
            /> */}
        </div>
    );
}
