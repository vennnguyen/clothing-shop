"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Account, Role } from "../../../app/types/interfaces";

export default function AccountForm({
  account,
  onClose,
  onSuccess,
  roles
}: {
  account: Account | null;
  onClose: () => void;
  onSuccess: (account: Account) => void;
  roles: Role[];
}) {
  const [email, setEmail] = useState(account?.email || "");
  const [password, setPassword] = useState(account ? atob(account.password) : ""); //giải mã password
  const [roleId, setRoleId] = useState(account?.roleId || 2);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const body: any = { email, roleId, password };

    try {
      const url = account ? `/api/accounts/${account.id}` : "/api/accounts";
      const method = account ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(account ? "Cập nhật thành công!" : "Thêm tài khoản thành công!");
        console.log('Saved account:', data.account);
        onSuccess(data.account);
      } else {
        toast.error(data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          {account ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!account} // Không cho sửa email khi update
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mật khẩu {account ? "(Để trống nếu không đổi)" : ""}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!account} // Chỉ bắt buộc khi thêm mới
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input
              type="date" 
              value={account?.birthday || ""}
              onChange={(e) => {
                if (account) {
                  account.birthday = e.target.value;
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Vai trò */}
          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}