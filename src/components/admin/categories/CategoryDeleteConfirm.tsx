// components/DeleteConfirm.tsx
import React, { useState, useEffect } from "react";
import { AlertTriangle, EyeOff, Trash2, X } from "lucide-react";
import { Category } from "../../../app/types/interfaces";
import { useToastMessage } from "../../../../hooks/useToastMessage";


interface DeleteConfirmProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    category: Category | null;
    refresh: () => void;
}

export default function CategoryDeleteConfirm({ open, setOpen, category, refresh }: DeleteConfirmProps) {
    const [isLoading, setIsLoading] = useState(false);
    // state 'step' để quản lý luồng: 'confirm-delete' hoặc 'suggest-hide'
    // const [step, setStep] = useState<'confirm-delete' | 'suggest-hide'>('confirm-delete');
    const { showError, showSuccess } = useToastMessage();
    const [conflictMessage, setConflictMessage] = useState("");

    useEffect(() => {
        if (!open) {
            setConflictMessage("");
        }
    }, [open])
    if (!open || !category) return null;

    // Hàm xử lý Xóa
    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/categories/${category.id}`, {
                method: "DELETE",
            });

            let data;
            try {
                data = await res.json();
                console.log(data);
            } catch (e) {
                // Nếu parse lỗi (do server trả về HTML hoặc rỗng), gán data mặc định
                data = { message: "Lỗi không xác định từ server" };
            }

            if (res.ok) {
                showSuccess(data.message || "Xóa danh mục thành công");
                refresh();
                setOpen(false);
            } else {
                setConflictMessage(data.message);
                // showError(data.message || "Lỗi khi xóa danh mục!");
            }
        } catch (error) {
            console.error(error);
            showError("Lỗi kết nối server");
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý Ẩn
    // const handleHide = async () => {
    //     setIsLoading(true);
    //     try {
    //         const res = await fetch(`/api/products/${product.id}`, {
    //             method: "PATCH",
    //         });

    //         let data;
    //         try {
    //             data = await res.json();
    //         } catch (e) {
    //             // Nếu parse lỗi (do server trả về HTML hoặc rỗng), gán data mặc định
    //             data = { message: "Lỗi không xác định từ server" };
    //         }
    //         if (res.ok) {
    //             refresh();
    //             setOpen(false);
    //             showSuccess(data.message || "Đã ẩn danh mục");
    //         } else {
    //             showError(data.message || "Lỗi khi ẩn danh mục!");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">

                {/* Nút đóng góc trên */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                {/* --- GIAO DIỆN BƯỚC 1: XÁC NHẬN XÓA --- */}
                {/* {step === 'confirm-delete' && ( */}
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Xóa danh mục?</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa danh mục <b>"{category.name}"</b>?
                    </p>
                    {conflictMessage && (
                        <p className="bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-800">
                            {conflictMessage || "Danh mục này đang bị ràng buộc dữ liệu."}
                        </p>
                    )}
                    <div className="mt-6 flex gap-3 justify-center">
                        <button
                            onClick={() => setOpen(false)}
                            className="cursor-pointer px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            disabled={isLoading}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleDelete}
                            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Xóa ngay"}
                        </button>
                    </div>
                </div>
                {/* )} */}

                {/* --- GIAO DIỆN BƯỚC 2: GỢI Ý ẨN (Khi gặp lỗi 409) --- */}
                {/*step === 'suggest-hide' && (
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Không thể xóa!</h3>                        
                        <p className="mb-2">
                            danh mục: <span className="font-bold text-gray-800">"{product.name}"</span>
                        </p>
                        
                        <p className="bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-800">
                            {conflictMessage || "danh mục này đang bị ràng buộc dữ liệu."}
                        </p>

                        <div className="mt-6 flex gap-3 justify-center">
                            <button
                                onClick={() => setOpen(false)}
                                className="cursor-pointer px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                disabled={isLoading}
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleHide}
                                className="cursor-pointer px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium flex items-center gap-2"
                                disabled={isLoading}
                            >
                                <EyeOff size={18} />
                                {isLoading ? "Đang xử lý..." : "Ẩn danh mục"}
                            </button>
                        </div>
                    </div>
                )**/}
            </div>
        </div>
    );
}