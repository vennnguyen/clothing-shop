"use client";

import { useCallback, useEffect, useState } from "react";
import EmployeeTable from "../../../components/admin/employees/EmployeeTable";

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

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadEmployees = useCallback(async (searchKeyword = "") => {
        try {
            const url = searchKeyword
                ? `/api/employees?search=${encodeURIComponent(searchKeyword)}`
                : "/api/employees";

            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setEmployees(data);
        } catch (error) {
            console.error("Lỗi khi tải nhân viên:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-5">QUẢN LÝ NHÂN VIÊN</h1>

            {isLoading ? (
                <div className="text-center py-10">Đang tải dữ liệu...</div>
            ) : (
                <EmployeeTable 
                    employees={employees} 
                    refresh={() => loadEmployees()} 
                    onSearch={loadEmployees} 
                />
            )}
        </div>
    );
}
