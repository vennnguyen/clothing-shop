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

  // Khóa, mở khóa khách hàng
  // CustomerTable.tsx
  const handleDelete = async (id: number, customer: Customer) => {
    const newStatus = customer.status === 1 ? 0 : 1;
    
    if (!confirm(`Bạn có chắc muốn ${newStatus === 0 ? "khóa" : "mở khóa"} khách hàng này không?`)) return;

    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setCustomers(customers.map((c) => 
          c.id === id ? { ...c, status: newStatus } : c
        ));
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
      <div className="bg-white overflow-y-auto max-h-[460px]">
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
                // kiểm tra status để disble hàng
                <tr key={customer.id} className={`border-b hover:bg-gray-50`}>
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
                      {/* Kiểm tra status để hiện thị icon khóa hay mở */}
                      {customer.status === 1 ? (
                        <button
                          onClick={() => handleDelete(customer.id!, customer)}
                          className="text-red-600 hover:text-red-800 border border-red-600 p-2 rounded hover:bg-red-50"
                          title="Khóa khách hàng"

                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDelete(customer.id!, customer)}
                          className="text-green-600 hover:text-green-800 border border-green-600 p-2 rounded hover:bg-green-50"
                          title="Mở khóa khách hàng"
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
        <CustomerForm
          customer={editingCustomer}
          onClose={handleCloseForm}
          onSuccess={handleSaveSuccess}
          customers={customers}
        />
      )}
    </div>
  );
}