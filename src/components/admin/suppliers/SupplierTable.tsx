"use client";

import { useState } from "react";
import { Supplier } from "../../../app/types/interfaces";
import SupplierModal from "./SupplierModal";

export default function SupplierTable({
  suppliers,
  refresh,
}: {
  suppliers: Supplier[];
  refresh: () => void;
}) {
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"form" | "delete">("form");
  const [search, setSearch] = useState("");

  // Lọc suppliers dựa theo tên
  const filteredSuppliers = suppliers.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Nhập tên nhà cung cấp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          onClick={() => {
            setSelected(null);
            setModalMode("form");
            setModalOpen(true);
          }}
        >
          ➕ Thêm nhà cung cấp
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Địa chỉ</th>
            <th className="p-2 border">SĐT</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((s) => (
            <tr key={s.id} className="border-t text-center">
              <td className="p-2 border">{s.id}</td>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.address}</td>
              <td className="p-2 border">{s.phone}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                  onClick={() => {
                    setSelected(s);
                    setModalMode("form");
                    setModalOpen(true);
                  }}
                >
                  Sửa
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded cursor-pointer"
                  onClick={() => {
                    setSelected(s);
                    setModalMode("delete");
                    setModalOpen(true);
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {filteredSuppliers.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                Không tìm thấy nhà cung cấp
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <SupplierModal
        open={modalOpen}
        mode={modalMode}
        supplier={selected}
        setOpen={setModalOpen}
        refresh={refresh}
      />
    </div>
  );
}
