"use client";

import { useCallback, useEffect, useState } from "react";
import CustomerTable from "../../../components/admin/customers/CustomerTable";

interface Customer {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    createdDate: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCustomers = useCallback(async (searchKeyword = "") => {
        try {
            const url = searchKeyword
                ? `/api/customers?search=${encodeURIComponent(searchKeyword)}`
                : "/api/customers";

            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error("Lỗi khi tải khách hàng:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-5">QUẢN LÝ KHÁCH HÀNG</h1>

            {isLoading ? (
                <div className="text-center py-10">Đang tải dữ liệu...</div>
            ) : (
                <CustomerTable 
                    customers={customers} 
                    refresh={() => loadCustomers()} 
                    onSearch={loadCustomers} 
                />
            )}
        </div>
    );
}
