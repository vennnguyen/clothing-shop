import { useEffect, useState } from "react";
import { Trash2, FilePenIcon, Plus, UserCheck } from "lucide-react";
import CustomerForm from "./CustomerForm";
import CustomerDeleteConfirm from "./CustomerDeleteConfirm";

// Interface định nghĩa cấu trúc dữ liệu khách hàng
interface Customer {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    createdDate: string;
}

export default function CustomerTable({
    customers,
    refresh,
    onSearch,
}: {
    customers: Customer[];
    refresh: () => void;
    onSearch: (keyword: string) => void;
}) {
    const [selected, setSelected] = useState<Customer | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Debounce search: Chờ 500ms sau khi user ngừng gõ mới tìm kiếm
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, onSearch]);

    // Format ngày tháng theo định dạng Việt Nam
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="bg-white p-4 shadow rounded">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Tìm theo tên, email hoặc số điện thoại..."
                    className="w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="p-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700"
                    onClick={() => {
                        setSelected(null);
                        setIsFormOpen(true);
                    }}
                >
                    <span className="flex items-center gap-2 cursor-pointer">
                        <Plus size={20} />
                        Thêm khách hàng
                    </span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border">
                    <thead className="bg-gray-100 text-center">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Họ tên</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Số ĐT</th>
                            <th className="p-2 border">Giới tính</th>
                            <th className="p-2 border">Ngày sinh</th>
                            <th className="p-2 border">Ngày đăng ký</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-4 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.id} className="border-t text-center hover:bg-gray-50">
                                    <td className="p-2 border">{customer.id}</td>
                                    <td className="p-2 border text-left">{customer.fullName}</td>
                                    <td className="p-2 border text-left">{customer.email}</td>
                                    <td className="p-2 border">{customer.phone}</td>
                                    <td className="p-2 border">{customer.gender}</td>
                                    <td className="p-2 border">{formatDate(customer.dateOfBirth)}</td>
                                    <td className="p-2 border">{formatDate(customer.createdDate)}</td>
                                    <td className="p-2 border space-x-2">
                                        <button
                                            className="px-2 py-1 bg-white text-blue-500 border border-blue-500 rounded cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                            onClick={() => {
                                                setSelected(customer);
                                                setIsFormOpen(true);
                                            }}
                                        >
                                            <FilePenIcon size={18} />
                                        </button>
                                        <button
                                            className="px-2 py-1 bg-white text-red-500 border border-red-500 rounded cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200"
                                            onClick={() => {
                                                setSelected(customer);
                                                setIsDeleteOpen(true);
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <CustomerForm
                open={isFormOpen}
                setOpen={setIsFormOpen}
                customer={selected}
                refresh={refresh}
            />

            <CustomerDeleteConfirm
                open={isDeleteOpen}
                setOpen={setIsDeleteOpen}
                customer={selected}
                refresh={refresh}
            />
        </div>
    );
}
