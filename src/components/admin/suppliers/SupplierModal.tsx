"use client";

import { useEffect, useState } from "react";
import { Supplier } from "../../../app/types/interfaces";

type Mode = "form" | "delete";

export default function SupplierModal({
  open,
  mode,
  supplier,
  setOpen,
  refresh,
}: {
  open: boolean;
  mode: Mode;
  supplier: Supplier | null;
  setOpen: (value: boolean) => void;
  refresh: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  // Reset hoặc set dữ liệu khi mở modal
  useEffect(() => {
    if (mode === "form" && supplier) {
      setForm({
        name: supplier.name || "",
        address: supplier.address || "",
        phone: supplier.phone || "",
      });
    } else if (mode === "form") {
      setForm({ name: "", address: "", phone: "" });
    }
  }, [supplier, mode, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier && mode === "delete") return;

    try {
      if (mode === "form") {
        const payload = { ...form };
        if (supplier?.id) {
          await fetch(`/api/suppliers/${supplier.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          await fetch(`/api/suppliers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      } else if (mode === "delete" && supplier?.id) {
        await fetch(`/api/suppliers/${supplier.id}`, { method: "DELETE" });
      }
      refresh();
      setOpen(false);
      setForm({ name: "", address: "", phone: "" }); // reset form
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
        {mode === "form" ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              {supplier ? "✏️ Sửa nhà cung cấp" : "➕ Thêm nhà cung cấp"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "address", "phone"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 capitalize">{field}</label>
                  <input
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder={`Nhập ${field}...`}
                    required
                  />
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {supplier ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">❌ Xóa nhà cung cấp</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa <b>{supplier?.name}</b> không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Xóa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
