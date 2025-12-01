"use client";

import { useState } from "react";
import { Import } from "../../../app/types/interfaces";
import ImportModal from "./ImportModal";

export default function ImportTable({
  imports,
  refresh,
}: {
  imports: Import[];
  refresh: () => void;
}) {
  const [selected, setSelected] = useState<Import | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"form" | "delete" | "detail">("form");

  return (
    <div className="bg-white p-4 shadow rounded">
      <div className="text-right">
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          onClick={() => {
            setSelected(null);
            setModalMode("form");
            setModalOpen(true);
          }}
        >
          ➕ Thêm phiếu nhập
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Ngày tạo</th>
            <th className="p-2 border">Tổng cộng</th>
            <th className="p-2 border">Mã nhà cung cấp</th>
            <th className="p-2 border">trạng thái</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {imports.map((s) => (
            <tr key={s.id} className="border-t text-center">
              <td className="p-2 border">{s.id}</td>
              <td className="p-2 border">{s.date}</td>
              <td className="p-2 border">{s.total}</td>
              <td className="p-2 border">{s.supplierId}</td>
              <td className="p-2 border">{s.status}</td>
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
                {s.status !== "Đã xác nhận" && (
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
                )}
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded cursor-pointer"
                  onClick={() => {
                    setSelected(s);
                    setModalMode("detail");
                    setModalOpen(true);
                  }}
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chung cho Thêm/Sửa/Xóa */}
      <ImportModal
        open={modalOpen}
        mode={modalMode}
        impor_t={selected}
        setOpen={setModalOpen}
        refresh={refresh}
      />
    </div>
  );
}
