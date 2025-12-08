"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToastMessage } from "../../../hooks/useToastMessage";

interface CartContextType {
    cartCount: number;
    addToCart: (productId: number, quantity: number, userId?: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartCount, setCartCount] = useState(0);
    const { showSuccess } = useToastMessage();
    useEffect(() => {
        const savedCount = localStorage.getItem("cartCount");
        if (savedCount) {
            setCartCount(parseInt(savedCount, 10));
        }
    }, []);

    const addToCart = async (productId: number, quantity: number, userId?: number) => {
        // 1. Cập nhật giao diện ngay lập tức (Optimistic UI) cho user thấy nhanh
        setCartCount((prev) => {
            const newCount = prev + quantity;
            localStorage.setItem("cartCount", newCount.toString());
            return newCount;
        });
        // 2. Nếu ĐÃ ĐĂNG NHẬP (có userId) -> Gọi API lưu xuống DB
        if (userId) {
            try {
                const res = await fetch('/api/carts/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        productId: productId,
                        quantity: quantity
                    })
                });

                if (!res.ok) {
                    console.error("Lỗi khi lưu giỏ hàng xuống DB");
                    // Tùy chọn: Rollback lại số lượng nếu muốn chặt chẽ
                } else {
                    showSuccess("Đã thêm vào giỏ hàng thành công!")
                }
            } catch (error) {
                console.error("Lỗi kết nối:", error);
            }
        } else {
            // Nếu CHƯA ĐĂNG NHẬP: Logic lưu vào LocalStorage chi tiết (nếu bạn muốn)
            console.log("User chưa đăng nhập, chỉ lưu ở client.");
        }
    };

    return (
        <CartContext.Provider value={{ cartCount, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
