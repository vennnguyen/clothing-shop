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

    return {
        showSuccess,
        showError,
        showInfo,
        showLoading,
        updateLoading,
    };
}
