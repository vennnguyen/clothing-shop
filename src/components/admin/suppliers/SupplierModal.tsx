"use client";

import { useEffect, useState } from "react";
import { Supplier } from "../../../app/types/interfaces";
import { useToastMessage } from "../../../../hooks/useToastMessage";
import { Trash2 } from "lucide-react";

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
  const { showSuccess, showError } = useToastMessage();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

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
  try {
    if (mode === "form") {
      if (supplier?.id) {
        await fetch(`/api/suppliers/${supplier.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        showSuccess("Cập nhật nhà cung cấp thành công!");
      } else {
        await fetch(`/api/suppliers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        showSuccess("Thêm nhà cung cấp thành công!");
      }
    } else if (mode === "delete" && supplier?.id) {
      await fetch(`/api/suppliers/${supplier.id}`, { method: "DELETE" });
      showSuccess("Xóa nhà cung cấp thành công!");
    }

    refresh();
    setOpen(false);
    setForm({ name: "", address: "", phone: "" });
  } catch (err) {
    console.error("Error:", err);
    showError("Có lỗi xảy ra. Vui lòng thử lại!");
  }
};


  if (!open) return null;

  const fields = [
    { key: "name", label: "Tên nhà cung cấp", placeholder: "Nhập tên nhà cung cấp..." },
    { key: "address", label: "Địa chỉ", placeholder: "Nhập địa chỉ..." },
    { key: "phone", label: "Số điện thoại", placeholder: "Nhập số điện thoại..." },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    {/* <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"> */}
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">

        
        {mode === "form" ? (
          <>
          <div
            className={`py-4 px-6 flex justify-center items-center mb-4 ${
              supplier ? "bg-blue-400" : "bg-green-400"
            }`}
          >
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
              {supplier ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}
            </h2>
          </div>

            
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{field.label}</label>
                  <input
                    name={field.key}
                    value={(form as any)[field.key]}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg outline-none transition-all border-gray-300 focus:ring-2 focus:ring-sky-400"
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className={`cursor-pointer px-8 py-2.5 text-white font-bold rounded-lg shadow-md 
                  transition-all transform active:scale-95 flex items-center gap-2
                  ${supplier ? "bg-blue-400 hover:bg-blue-500" : "bg-green-400 hover:bg-green-500"}`}
                >
                  {supplier ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 flex gap-3">
               <Trash2 className="h-6 w-6 text-red-600" /> Xóa nhà cung cấp</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa <b>{supplier?.name}</b> không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors cursor-pointer"

              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmit}
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
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
