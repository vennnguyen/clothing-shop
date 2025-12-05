

  "use client";

import { useEffect, useState } from "react";
import { Import, Product as ProductType, Supplier as SupplierType } from "../../../app/types/interfaces";

type Mode = "form" | "delete" | "detail";

// Format ISO date -> yyyy-MM-dd
const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

interface Product extends ProductType {
  quantity: number;
  price: number;
}

export default function ImportModal({
  open,
  mode,
  importData,
  setOpen,
  refresh,
}: {
  open: boolean;
  mode: Mode;
  importData: Import & { products?: Product[] } | null;
  setOpen: (value: boolean) => void;
  refresh: () => void;
}) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [importProducts, setImportProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState<ProductType[]>([]);

  // useEffect(()=>{
  //   console.log("importProducts: ",importProducts);
  // },[importProducts])

  const currentUser = "Nguyễn Văn A";

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    supplierId: 0,
    status: "Đang xử lý",
    employee: currentUser,
  });

  // Load suppliers & products
  const loadSuppliers = async () => {
    const res = await fetch("/api/suppliers");
    setSuppliers(await res.json());
  };
  const loadProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };





  useEffect(() => {
    loadSuppliers();
    loadProducts();
  }, []);

  // Load form khi mở modal
  useEffect(() => {
    if (!open) return;

    if ((mode === "form" || mode === "detail") && importData) {
      const prods = (importData.products || []).map((p) => ({
        // id: p.id, 
        // name: p.name || "",
        // quantity: p.quantity || 1,
        // price: p.price || 0,

         id: p.id,
  name: p.name || null,
  price: p.price || 0,
  quantity: p.quantity ?? 1,        // dùng ?? để giữ giá trị 0 hợp lệ
  category: p.category ?? null,
  sizes: p.sizes ?? null,
  imageUrl: p.imageUrl ?? null,
  categoryId: p.categoryId ?? 0,
  sizeId: p.sizeId ?? 0,
  allImagesString: p.allImagesString ?? "",
  description: p.description ?? "",
      }));
      setImportProducts(prods);

      setForm({
        date: importData.createdDate
          ? formatDate(importData.createdDate)
          : new Date().toISOString().split("T")[0],
        supplierId: importData.supplierId || suppliers[0]?.id || 0,
        status: importData.status || "Đang xử lý",
        employee: currentUser,
      });
    } else if (mode === "form") {
      setImportProducts([]);
      setForm({
        date: new Date().toISOString().split("T")[0],
        supplierId: suppliers[0]?.id || 0,
        status: "Đang xử lý",
        employee: currentUser,
      });
    }
  }, [importData, mode, open, suppliers]);

  // Handle change form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (mode === "detail") return;
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "supplierId" ? Number(value) : value,
    }));
  };

  // Search & dropdown
  useEffect(() => {
    if (search.trim() === "") {
      setDropdown([]);
    } else {
      setDropdown(
        products.filter(
          (p) => p.name?.toLowerCase().includes(search.toLowerCase()) &&
            !importProducts.find((ip) => ip.id === p.id)
        )
      );
    }
  }, [search, importProducts, products]);

  const handleAddProduct = (product: ProductType) => {
    console.log("product: ",product);
    if (mode === "detail") return;
    setImportProducts((prev) => [...prev, { ...product, quantity: 1, price: product.price || 0 }]);
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
    console.log("rm_id: ", id);
    setImportProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const total = importProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (mode === "detail") return;

  const payload = {
    createdDate: form.date,
    supplierId: form.supplierId,
    accountId: 1,
    total: total,
    status: form.status,
    products: importProducts.map((p) => ({
      productId: p.id,
      quantity: p.quantity,
      price: p.price,
    })),
  };

  try {
    if (mode === "delete" && importData?.id) {
      // Xóa phiếu nhập
      await fetch(`/api/importreceipts/${importData.id}`, { method: "DELETE" });
    } else if (importData && mode !== "delete") {
      // Cập nhật phiếu nhập
      const res = await fetch(`/api/importreceipts/${importData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      const oldProducts = importData.products || [];
      const oldProductIds = oldProducts.map((p) => p.id);
      const newProductIds = importProducts.map((p) => p.id);

      // Phân loại sản phẩm: cập nhật, thêm mới, xóa
      const productsToUpdate = importProducts.filter((p) => oldProductIds.includes(p.id));
      const productsToAdd = importProducts.filter((p) => !oldProductIds.includes(p.id));
      const productsToDelete = oldProducts.filter((p) => !newProductIds.includes(p.id));

      await Promise.all([
        // Cập nhật sản phẩm
        ...productsToUpdate.map((p) =>
          fetch("/api/importdetails", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              importReceiptId: data.id,
              productId: p.id,
              quantity: p.quantity,
              price: p.price,
            }),
          })
        ),
        // Thêm sản phẩm mới
        ...productsToAdd.map((p) =>
          fetch("/api/importdetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              importReceiptId: data.id,
              productId: p.id,
              quantity: p.quantity,
              price: p.price,
            }),
          })
        ),
        // Xóa sản phẩm đã bị loại
        ...productsToDelete.map((p) =>
          fetch("/api/importdetails", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              importReceiptId: data.id,
              productId: p.id,
            }),
          })
        ),
      ]);
    } else {
      // Thêm phiếu nhập mới
      const res = await fetch("/api/importreceipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      // Thêm sản phẩm
      await Promise.all(
        importProducts.map((p) =>
          fetch("/api/importdetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              importReceiptId: data.id,
              productId: p.id,
              quantity: p.quantity,
              price: p.price,
            }),
          })
        )
      );
    }

    setOpen(false);
    refresh();
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra!");
  }
};
  



  if (!open) return null;
  const readonly = mode === "detail";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded shadow-lg max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">
          {mode === "detail"
            ? "📄 Chi tiết phiếu nhập"
            : mode === "delete"
            ? "❌ Xóa phiếu nhập"
            : importData
            ? "✏️ Sửa phiếu nhập"
            : "➕ Thêm phiếu nhập"}
        </h2>

        {mode === "delete" ? (
          <div>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa  <b> phiếu nhập mã {importData?.id}</b> không?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Hủy</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded">Xóa</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Ngày nhập</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  disabled={readonly}
                  className={`w-full p-2 border rounded ${readonly ? "bg-gray-100" : ""}`}
                />
              </div>
              <div>
                <label className="block mb-1">Nhân viên</label>
                <input type="text" value={form.employee} disabled className="w-full p-2 border rounded bg-gray-100" />
              </div>
              <div>
                <label className="block mb-1">Trạng thái</label>
                {readonly ? (
                  <input type="text" value={form.status} disabled className="w-full p-2 border rounded bg-gray-100" />
                ) : (
                  <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block mb-1">Nhà cung cấp</label>
                <select name="supplierId" value={form.supplierId} onChange={handleChange} disabled={readonly} className={`w-full p-2 border rounded ${readonly ? "bg-gray-100" : ""}`}>
                  {suppliers.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
            </div>

            {/* Product search */}
            {!readonly && (
              <div className="relative">
                <label className="block mb-1">Thêm sản phẩm</label>
                <input type="text" placeholder="Tìm sản phẩm..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-2 border rounded" />
                {dropdown.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full mt-1 max-h-40 overflow-auto shadow rounded">
                    {dropdown.map((p) => (
                      <li key={p.id} onClick={() => handleAddProduct(p)} className="p-2 hover:bg-gray-200 cursor-pointer">{p.name} - {p.price}đ</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Product table */}
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
                    <tr key={i} className="text-center border-t">
                      <td className="p-2 border">{p.name}</td>
                      <td className="p-2 border">
                        {readonly ? p.quantity : (
                          <input type="number" min={1} value={p.quantity} onChange={(e) => handleProductQuantityChange(i, Number(e.target.value))} className="w-16 p-1 border rounded text-center" />
                        )}
                      </td>
                      <td className="p-2 border">{p.price}</td>
                      <td className="p-2 border">{p.price * p.quantity}</td>
                      {!readonly && (
                        <td className="p-2 border">
                          <button type="button" className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleRemoveProduct(p.id)}>Xóa</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <label className="block mb-1">Tổng cộng</label>
              <input type="number" value={total} disabled className="w-full p-2 border rounded bg-gray-100" />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Đóng</button>
              {!readonly && (
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{importData ? "Cập nhật" : "Thêm mới"}</button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

