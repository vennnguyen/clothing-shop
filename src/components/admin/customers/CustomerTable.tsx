"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Customer } from "../../../app/types/interfaces";
import CustomerForm from "./CustomerForm";

export default function CustomerTable({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Lọc khách hàng theo từ khóa
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.id?.toString().includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xóa khách hàng
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;

    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCustomers(customers.filter((customer) => customer.id !== id));
        toast.success("Xóa khách hàng thành công!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Xóa thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối!");
    }
  };

  // Mở form thêm mới
  const handleAdd = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  // Mở form chỉnh sửa
  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  // Đóng form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  // Callback khi lưu thành công
  const handleSaveSuccess = (savedCustomer: Customer) => {
    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === savedCustomer.id ? savedCustomer : c)));
    } else {
      setCustomers([savedCustomer, ...customers]);
    }
    handleCloseForm();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">QUẢN LÝ KHÁCH HÀNG</h1>

      {/* Thanh tìm kiếm & nút thêm */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Nhập ID hoặc email khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Thêm khách hàng
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Ngày tạo</th>
              <th className="p-3 text-center font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Không tìm thấy khách hàng nào
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{customer.id}</td>
                  <td className="p-3">
                    <span className="font-medium">{customer.email}</span>
                  </td>
                  <td className="p-3">
                    {customer.createdDate 
                      ? new Date(customer.createdDate).toLocaleDateString("vi-VN")
                      : "N/A"
                    }
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:text-blue-800 border border-blue-600 p-2 rounded hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id!)}
                        className="text-red-600 hover:text-red-800 border border-red-600 p-2 rounded hover:bg-red-50"
                        title="Xóa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
        <CustomerForm
          customer={editingCustomer}
          onClose={handleCloseForm}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}