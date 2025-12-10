import { useEffect, useState } from "react";
import { Trash2, FilePenIcon, Plus, UserCheck, UserX } from "lucide-react";
import EmployeeForm from "./EmployeeForm";
import EmployeeDeleteConfirm from "./EmployeeDeleteConfirm";

// Interface định nghĩa cấu trúc dữ liệu nhân viên
interface Employee {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    birthday: string;
    gender: string;
    address: string;
    status: number;
    createdDate: string;
    roleId: number;
    roleName: string;
}

export default function EmployeeTable({
    employees,
    refresh,
    onSearch,
}: {
    employees: Employee[];
    refresh: () => void;
    onSearch: (keyword: string) => void;
}) {
    const [selected, setSelected] = useState<Employee | null>(null);
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
                        Thêm nhân viên
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
                            <th className="p-2 border">Vai trò</th>
                            <th className="p-2 border">Giới tính</th>
                            <th className="p-2 border">Ngày tạo</th>
                            <th className="p-2 border">Trạng thái</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="p-4 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            employees.map((emp) => (
                                <tr key={emp.id} className="border-t text-center hover:bg-gray-50">
                                    <td className="p-2 border">{emp.id}</td>
                                    <td className="p-2 border text-left">{emp.fullName}</td>
                                    <td className="p-2 border text-left">{emp.email}</td>
                                    <td className="p-2 border">{emp.phone}</td>
                                    <td className="p-2 border">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            emp.roleId === 1 
                                                ? 'bg-purple-100 text-purple-700' 
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {emp.roleName}
                                        </span>
                                    </td>
                                    <td className="p-2 border">{emp.gender}</td>
                                    <td className="p-2 border">{formatDate(emp.createdDate)}</td>
                                    <td className="p-2 border">
                                        {emp.status === 1 ? (
                                            <span className="flex items-center justify-center gap-1 text-green-600">
                                                <UserCheck size={16} />
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-1 text-red-600">
                                                <UserX size={16} />
                                                Khóa
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-2 border space-x-2">
                                        <button
                                            className="px-2 py-1 bg-white text-blue-500 border border-blue-500 rounded cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                            onClick={() => {
                                                setSelected(emp);
                                                setIsFormOpen(true);
                                            }}
                                        >
                                            <FilePenIcon size={18} />
                                        </button>
                                        {emp.id !== 1 && ( // Không cho xóa admin
                                            <button
                                                className="px-2 py-1 bg-white text-red-500 border border-red-500 rounded cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200"
                                                onClick={() => {
                                                    setSelected(emp);
                                                    setIsDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <EmployeeForm
                open={isFormOpen}
                setOpen={setIsFormOpen}
                employee={selected}
                refresh={refresh}
            />

            <EmployeeDeleteConfirm
                open={isDeleteOpen}
                setOpen={setIsDeleteOpen}
                employee={selected}
                refresh={refresh}
            />
        </div>
    );
}
