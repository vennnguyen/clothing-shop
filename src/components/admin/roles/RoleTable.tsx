"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { AccountWithRole, Role } from "../../../app/types/interfaces";

export default function RoleTable({ 
  initialAccounts, 
  roles 
}: { 
  initialAccounts: AccountWithRole[];
  roles: Role[];
}) {
  const [accounts, setAccounts] = useState<AccountWithRole[]>(initialAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Lọc theo từ khóa
  const filteredAccounts = accounts.filter(
    (a) =>
      a.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Thay đổi vai trò
  const handleRoleChange = async (accountId: number, newRoleId: number) => {
    setUpdatingId(accountId);
    
    try {
      const res = await fetch(`/api/accounts/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: newRoleId }),
      });

      const data = await res.json();

      if (res.ok) {
        // Cập nhật state local
        setAccounts(accounts.map((acc) => 
          acc.id === accountId 
            ? { ...acc, roleId: newRoleId, roleName: roles.find(r => r.id === newRoleId)?.name || "" }
            : acc
        ));
        toast.success("Cập nhật vai trò thành công!");
      } else {
        toast.error(data.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối!");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">QUẢN LÝ VAI TRÒ TÀI KHOẢN</h1>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Nhập vai trò..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left font-semibold w-24">ID</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-center font-semibold w-64">Vai trò</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">
                  Không tìm thấy tài khoản nào
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc) => (
                <tr key={acc.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{acc.id}</td>
                  <td className="p-3">
                    <span className="font-medium">{acc.email}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      <select
                        value={acc.roleId}
                        onChange={(e) => handleRoleChange(acc.id!, Number(e.target.value))}
                        disabled={updatingId === acc.id}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}