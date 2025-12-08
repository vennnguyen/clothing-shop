"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartContextType {
    cartCount: number;
    addToCart: (quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const savedCount = localStorage.getItem("cartCount");
        if (savedCount) {
            setCartCount(parseInt(savedCount, 10));
        }
    }, []);

    const addToCart = (quantity: number) => {
        setCartCount((prev) => {
            const newCount = prev + quantity;
            localStorage.setItem("cartCount", newCount.toString());
            return newCount;
        })
    }

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
