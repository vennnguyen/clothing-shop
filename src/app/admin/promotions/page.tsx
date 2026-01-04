"use client";
import { useCallback, useEffect, useState } from "react";
import { Product, Promotion } from "../../types/interfaces";
import ProductTable from "../../../components/admin/products/ProductTable";
import PromotionTable from "../../../components/admin/promotions/PromotionsTable";
import AddPromotionForm from "../../../components/admin/promotions/AddPromotionForm";

export default function ProductsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"list" | "create">("list");
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const loadPromotions = useCallback(async (searchKeyword = "") => {

        try {
            const url = searchKeyword ?
                `/api/promotions?search=${encodeURIComponent(searchKeyword)}`
                : `/api/promotions`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch promotions");

            const data = await res.json();
            setPromotions(data);
        } catch (error) {
            console.error("Loi khi tai khuyen mai", error);
        } finally {
            setIsLoading(false);
        }
    }, [])
    useEffect(() => {
        loadPromotions();
    }, [loadPromotions])
    const changeMode = (val: string) => {
        switch (val) {
            case "list":
                setMode("list");
                break;
            case "create":
                setMode("create");
                break;

            default:
                break;
        }
    }
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-3">QUẢN LÝ KHUYẾN MÃI</h1>

            {/* Hiển thị Loading hoặc Bảng dữ liệu */}
            {isLoading && (
                <div className="text-center py-10">Đang tải dữ liệu...</div>
            )}

            {!isLoading && mode === "list" && (
                <PromotionTable
                    promotions={promotions}
                    refresh={loadPromotions}
                    changeMode={changeMode}
                />
            )}
            {!isLoading && mode === "create" && (
                <AddPromotionForm
                    changeMode={(changeMode)}
                />
            )

            }
        </div>
    );
}
