

"use client";

import { useEffect, useState } from "react";
import { Import } from "../../../app/types/interfaces";

type Mode = "form" | "delete" | "detail";

interface Supplier {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function ImportModal({
  open,
  mode,
  impor_t,
  setOpen,
  refresh,
}: {
  open: boolean;
  mode: Mode;
  impor_t: Import | null;
  setOpen: (value: boolean) => void;
  refresh: () => void;
}) {
  const suppliers: Supplier[] = [
    { id: 1, name: "Công ty A" },
    { id: 2, name: "Công ty B" },
    { id: 3, name: "Công ty C" },
  ];

  const allProducts: Product[] = [
    { id: 1, name: "Sản phẩm 1", quantity: 0, price: 10000 },
    { id: 2, name: "Sản phẩm 2", quantity: 0, price: 15000 },
    { id: 3, name: "Sản phẩm 3", quantity: 0, price: 20000 },
    { id: 4, name: "Sản phẩm 4", quantity: 0, price: 12000 },
    { id: 5, name: "Sản phẩm 5", quantity: 0, price: 18000 },
  ];

  const currentUser = "Nguyễn Văn A";

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    supplierId: suppliers[0].id,
    status: "Chưa xử lý",
    employee: currentUser,
  });

  const [importProducts, setImportProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState<Product[]>([]);

  // -------------------- LOAD FORM --------------------
  useEffect(() => {
    if (mode === "form" && impor_t) {
      // SỬA
      setForm({
        date: impor_t.date || new Date().toISOString().split("T")[0],
        supplierId: impor_t.supplierId || suppliers[0].id,
        status: impor_t.status || "Chưa xử lý",
        employee: currentUser,
      });

      setImportProducts([
        { id: 1, name: "Sản phẩm 1", quantity: 2, price: 10000 },
        { id: 3, name: "Sản phẩm 3", quantity: 1, price: 20000 },
      ]);
    } 
    else if (mode === "form") {
      // THÊM
      setForm({
        date: new Date().toISOString().split("T")[0],
        supplierId: suppliers[0].id,
        status: "Chưa xử lý",
        employee: currentUser,
      });

      setImportProducts([]);
    }

    // CHI TIẾT
    if (mode === "detail" && impor_t) {
      setForm({
        date: impor_t.date || "",
        supplierId: impor_t.supplierId || suppliers[0].id,
        status: impor_t.status || "Chưa xử lý",
        employee: currentUser,
      });

      setImportProducts([
        { id: 1, name: "Sản phẩm 1", quantity: 2, price: 10000 },
        { id: 3, name: "Sản phẩm 3", quantity: 1, price: 20000 },
      ]);
    }
  }, [impor_t, mode, open]);

  // -------------------- HANDLE CHANGE --------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (mode === "detail") return;
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "supplierId" ? Number(value) : value,
    }));
  };

  // -------------------- SEARCH PRODUCT --------------------
  useEffect(() => {
    if (search.trim() === "") {
      setDropdown([]);
    } else {
      setDropdown(
        allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            !importProducts.find((ip) => ip.id === p.id)
        )
      );
    }
  }, [search, importProducts]);

  const handleAddProduct = (product: Product) => {
    if (mode === "detail") return;
    setImportProducts((prev) => [...prev, { ...product, quantity: 1 }]);
    setSearch("");
    setDropdown([]);
  };

  const handleProductQuantityChange = (index: number, quantity: number) => {
    if (mode === "detail") return;
    setImportProducts((prev) => {
      const copy = [...prev];
      copy[index].quantity = quantity;
      return copy;
    });
  };

  const handleRemoveProduct = (id: number) => {
    if (mode === "detail") return;
    setImportProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const total = importProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "detail") return;

    const payload = {
      ...form,
      total,
      products: importProducts,
    };

    console.log("PAYLOAD:", payload);

    setOpen(false);
    refresh();
  };

  if (!open) return null;

  const readonly = mode === "detail";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded shadow-lg max-h-[90vh] overflow-auto">

        {/* ===================== TITLE ===================== */}
        <h2 className="text-2xl font-bold mb-4">
          {mode === "detail"
            ? "📄 Chi tiết phiếu nhập"
            : impor_t
            ? "✏️ Sửa phiếu nhập"
            : "➕ Thêm phiếu nhập"}
        </h2>

        {/* ===================== FORM ===================== */}
        {mode === "delete" ? (
          // ------------ DELETE ------------
          <div>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa <b>{impor_t?.id}</b> không?
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
          </div>
        ) : (
          // ------------ ADD / EDIT / DETAIL ------------
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">

              {/* ngày nhập */}
              <div>
                <label className="block mb-1">Ngày nhập</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  disabled={readonly || !impor_t} 
                  className={`w-full p-2 border rounded ${
                    readonly ? "bg-gray-100" : ""
                  }`}
                />
              </div>

              {/* nhân viên */}
              <div>
                <label className="block mb-1">Nhân viên</label>
                <input
                  type="text"
                  value={form.employee}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>

              {/* trạng thái */}
              <div>
                <label className="block mb-1">Trạng thái</label>

                {readonly ? (
                  <input
                    type="text"
                    value={form.status}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                ) : (
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Chưa xử lý">Chưa xử lý</option>
                    <option value="Đã xử lý">Đã xác nhận</option>
                  </select>
                )}
              </div>

              {/* nhà cung cấp */}
              <div>
                <label className="block mb-1">Nhà cung cấp</label>
                <select
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleChange}
                  disabled={readonly}
                  className={`w-full p-2 border rounded ${
                    readonly ? "bg-gray-100" : ""
                  }`}
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEARCH SP */}
            {!readonly && (
              <div className="relative">
                <label className="block mb-1">Thêm sản phẩm</label>
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-2 border rounded"
                />

                {dropdown.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full mt-1 max-h-40 overflow-auto shadow rounded">
                    {dropdown.map((p) => (
                      <li
                        key={p.id}
                        onClick={() => handleAddProduct(p)}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {p.name} - {p.price}đ
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* TABLE PRODUCT */}
            <div className="mt-2 border rounded max-h-64 overflow-auto">
              <table className="w-full border">
                <thead className="bg-gray-100 text-center sticky top-0">
                  <tr>
                    <th className="p-2 border">Tên SP</th>
                    <th className="p-2 border">Số lượng</th>
                    <th className="p-2 border">Đơn giá</th>
                    <th className="p-2 border">Thành tiền</th>
                    {!readonly && <th className="p-2 border">Xóa</th>}
                  </tr>
                </thead>
                <tbody>
                  {importProducts.map((p, i) => (
                    <tr key={p.id} className="text-center border-t">
                      <td className="p-2 border">{p.name}</td>

                      <td className="p-2 border">
                        {readonly ? (
                          p.quantity
                        ) : (
                          <input
                            type="number"
                            min={1}
                            value={p.quantity}
                            onChange={(e) =>
                              handleProductQuantityChange(
                                i,
                                Number(e.target.value)
                              )
                            }
                            className="w-16 p-1 border rounded text-center"
                          />
                        )}
                      </td>

                      <td className="p-2 border">{p.price}</td>

                      <td className="p-2 border">
                        {p.price * p.quantity}
                      </td>

                      {!readonly && (
                        <td className="p-2 border">
                          <button
                            type="button"
                            className="px-2 py-1 bg-red-600 text-white rounded"
                            onClick={() => handleRemoveProduct(p.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <label className="block mb-1">Tổng cộng</label>
              <input
                type="number"
                value={total}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Đóng
              </button>

              {!readonly && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {impor_t ? "Cập nhật" : "Thêm mới"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}



