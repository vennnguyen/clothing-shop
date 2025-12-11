"use client";

import { toast } from "react-toastify";

export function useToastMessage() {

    const showSuccess = (msg: string) => {
        toast.success(msg, {
            position: "top-right",
            autoClose: 2000,
        });
    };

    const showError = (msg: string) => {
        toast.error(msg, {
            position: "top-right",
            autoClose: 2500,
        });
    };

    const showInfo = (msg: string) => {
        toast.info(msg, {
            position: "top-right",
            autoClose: 2500,
        });
    };

    // Toast loading -> return toastId để update lại
    const showLoading = (msg: string) => {
        return toast.loading(msg, {
            position: "top-right",
        });
    };

    // Update loading → success hoặc error
    const updateLoading = (
        toastId: string | number,
        msg: string,
        isSuccess: boolean = true
    ) => {
        toast.update(toastId, {
            render: msg,
            type: isSuccess ? "success" : "error",
            isLoading: false,
            autoClose: 2000,
        });
    };
    const showConfirm = (message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const id = toast(
                ({ closeToast }) => (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div className="bg-white rounded-lg p-5 shadow-lg text-center space-y-4 min-w-[260px]">
                            <p className="font-semibold text-gray-800">{message}</p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    className="cursor-pointer bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                                    onClick={() => {
                                        resolve(false);
                                        closeToast();
                                    }}
                                >
                                    Hủy
                                </button>

                                <button
                                    className="cursor-pointer bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
                                    onClick={() => {
                                        resolve(true);
                                        closeToast();
                                    }}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                ),
                {
                    closeOnClick: false,
                    autoClose: false,
                    // position: "top-center",
                }
            );
        });
    };
    return {
        showSuccess,
        showError,
        showInfo,
        showLoading,
        updateLoading,
        showConfirm,
    };
}
