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

  // state lọc ngày
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // lọc imports theo ngày
  // const filteredImports = imports.filter((imp) => {
  //   if (!startDate && !endDate) return true;
  //   const created = new Date(imp.createdDate || "").setHours(0,0,0,0);
  //   if (startDate && created < new Date(startDate).getTime()) return false;
  //   if (endDate && created > new Date(endDate).getTime()) return false;
  //   return true;
  // });

  const filteredImports = imports.filter((imp) => {
      if (!startDate && !endDate) return true;
      if (!imp.createdDate) return false;

      const created = new Date(imp.createdDate);
      const createdDay = created.getFullYear() * 10000 + (created.getMonth()+1)*100 + created.getDate();

      const start = startDate ? (() => {
        const [y,m,d] = startDate.split("-").map(Number);
        return y*10000 + m*100 + d;
      })() : null;

      const end = endDate ? (() => {
        const [y,m,d] = endDate.split("-").map(Number);
        return y*10000 + m*100 + d;
      })() : null;

      if (start !== null && createdDay < start) return false;
      if (end !== null && createdDay > end) return false;
      return true;
    });


  return (
    <div className="bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <label>Ngày từ:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-1 rounded"
          />
          <label>Đến:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1 rounded"
          />
          <button
            className="px-2 py-1 bg-gray-500 text-white rounded"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            Xóa lọc
          </button>
        </div>
        <div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            onClick={() => {
              setSelected(null);
              setModalMode("form");
              setModalOpen(true);
            }}
          >
            ➕ Thêm phiếu nhập
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Ngày tạo</th>
            <th className="p-2 border">Tổng cộng</th>
            <th className="p-2 border">Mã nhà cung cấp</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredImports.map((s) => (
            <tr key={s.id} className="border-t text-center">
              <td className="p-2 border">{s.id}</td>
              <td className="p-2 border">
                {s.createdDate
                  ? new Date(s.createdDate).toLocaleDateString("vi-VN")
                  : ""}
              </td>
              <td className="p-2 border">{s.total}</td>
              <td className="p-2 border">{s.supplierId}</td>
              <td className="p-2 border">{s.status}</td>
              <td className="p-2 border space-x-2">
                {s.status !== "Đã xác nhận" && (
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
                )}
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

      <ImportModal
        open={modalOpen}
        mode={modalMode}
        importData={selected}
        setOpen={setModalOpen}
        refresh={refresh}
      />
    </div>
  );
}
