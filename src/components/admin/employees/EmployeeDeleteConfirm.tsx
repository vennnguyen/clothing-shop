import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useToastMessage } from "../../../../hooks/useToastMessage";

// Interface cho dialog xác nhận xóa nhân viên
interface Employee {
    id: number;
    fullName: string;
    email: string;
}

interface DeleteConfirmProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    employee: Employee | null;
    refresh: () => void;
}

export default function EmployeeDeleteConfirm({ open, setOpen, employee, refresh }: DeleteConfirmProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { showError, showSuccess } = useToastMessage();

    if (!open || !employee) return null;

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/employees/${employee.id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok) {
                showSuccess(data.message || "Xóa nhân viên thành công");
                refresh();
                setOpen(false);
            } else {
                showError(data.error || "Có lỗi xảy ra khi xóa nhân viên");
            }
        } catch (error) {
            console.error("Lỗi xóa:", error);
            showError("Lỗi kết nối server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <AlertTriangle className="text-white" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Xác nhận xóa</h2>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-white/80 hover:text-white transition-colors"
                        disabled={isLoading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-gray-700">
                            Bạn có chắc chắn muốn xóa nhân viên
                            <span className="font-bold text-red-600"> {employee.fullName}</span>?
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Email: <span className="font-medium">{employee.email}</span>
                        </p>
                    </div>

                    <p className="text-sm text-gray-600">
                        ⚠️ Hành động này không thể hoàn tác!
                    </p>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        disabled={isLoading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang xóa...
                            </>
                        ) : (
                            "Xóa"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
