"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import AccountForm from "./AccountForm";
import { Account, AccountWithRole, Role } from "../../../app/types/interfaces";

export default function AccountTable({ initialAccounts, roles }: { initialAccounts: AccountWithRole[]; roles: Role[] }) {
  const [accounts, setAccounts] = useState<AccountWithRole[]>(initialAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountWithRole | null>(null);

  // Lọc tài khoản theo từ khóa
  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.id.toString().includes(searchTerm) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xóa tài khoản
  const handleDelete = async (id: number) => {
    //kiểm tra status để xác định hành động
    const account = accounts.find((acc) => acc.id === id);
    if (!account) return;

    if (account.status === 1) {
      if (!confirm("Bạn có chắc muốn khóa tài khoản này không?")) return;
    } else {
      if (!confirm("Bạn có chắc muốn mở khóa tài khoản này không?")) return;
    }

    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: account.status === 1 ? 0 : 1 }),
      });
      if (res.ok) {
        // Cập nhật trạng thái trong danh sách
        setAccounts(
          accounts.map((acc) =>
            acc.id === id ? { ...acc, status: account.status === 1 ? 0 : 1 } : acc
          )
        );
        toast.success("Thành công!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối!");
    }
  };

  // Mở form thêm mới
  const handleAdd = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  // Mở form chỉnh sửa
  const handleEdit = (account: Account) => {
    console.log('Editing account:', account);
    setEditingAccount(account);
    setShowForm(true);
  };

  // Đóng form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAccount(null);
  };

  // Callback khi lưu thành công
  const handleSaveSuccess = (savedAccount: AccountWithRole) => {
    if (editingAccount) {
      // Cập nhật
      setAccounts(accounts.map((acc) => (acc.id === savedAccount.id ? savedAccount : acc)));
    } else {
      // Thêm mới
      setAccounts([savedAccount, ...accounts]);
    }
    handleCloseForm();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">QUẢN LÝ TÀI KHOẢN</h1>

      {/* Thanh tìm kiếm & nút thêm */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Nhập ID, email hoặc vai trò..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Thêm tài khoản
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Vai trò</th>
              <th className="p-3 text-left font-semibold">Ngày tạo</th>
              <th className="p-3 text-center font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Không tìm thấy tài khoản nào
                </td>
              </tr>
            ) : (
              filteredAccounts.map((account) => (
                <tr key={account.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{account.id}</td>
                  <td className="p-3">{account.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        account.roleName === "admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {account.roleName}
                    </span>
                  </td>
                  <td className="p-3">{new Date(account.createdDate).toLocaleDateString("vi-VN")}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(account)}
                        className="text-blue-600 hover:text-blue-800 border border-blue-600 p-2 rounded hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* Kiểm tra status để hiện thị icon khóa hay mở */}
                      {account.status === 1 ? (
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="text-red-600 hover:text-red-800 border border-red-600 p-2 rounded hover:bg-red-50"
                          title="Khóa tài khoản"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="text-green-600 hover:text-green-800 border border-green-600 p-2 rounded hover:bg-green-50"
                          title="Mở khóa tài khoản"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <AccountForm
          account={editingAccount}
          onClose={handleCloseForm}
          onSuccess={handleSaveSuccess}
          roles={roles}
        />
      )}
    </div>
  );
}