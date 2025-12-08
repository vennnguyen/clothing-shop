"use client";

import { useEffect, useState } from "react";
import { Import, Product as ProductType, Supplier as SupplierType } from "../../../app/types/interfaces";
import { useToastMessage } from "../../../../hooks/useToastMessage";
import { getCurrentUser } from "../../../actions/auth";

type Mode = "form" | "delete" | "detail";

// Format ISO date -> yyyy-MM-dd
const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

interface Size {
  sizeId: number;
  sizeName: string;
  quantity: number;
}

interface Product extends ProductType {
  quantity: number;
  price: number;
  sizeId: number;
  sizeName: string;
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
  const [user, setUser] = useState<any>(null);
  const { showSuccess, showError } = useToastMessage();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [importProducts, setImportProducts] = useState<Product[]>([]);
  const [sizeList, setSizeList] = useState<Size[]>([]);
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState<ProductType[]>([]);
  const currentUser = user?.name ?? "";

  useEffect(()=>{
    console.log("importProducts: ",importProducts);
  },[importProducts])

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    supplierId: 0,
    status: "Đang xử lý",
    employee: "",
  });

  // --- AUTH ---
  useEffect(() => {
    const checkAuth = async () => {
      const userData = await getCurrentUser();
      if (userData) setUser(userData);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) setForm(prev => ({ ...prev, employee: user.name || "" }));
  }, [user]);

  // --- Load data ---
  const loadSuppliers = async () => {
    const res = await fetch("/api/suppliers");
    setSuppliers(await res.json());
  };

  const loadProducts = async () => {
    const res = await fetch("/api/importdetails/p");
    setProducts(await res.json());
  };

  const loadSizes = async () => {
    const res = await fetch("/api/sizes");
    const json = await res.json();
    if (json.success) setSizeList(json.data);
    else setSizeList([]);
  };

  useEffect(() => {
    loadSuppliers();
    loadProducts();
    loadSizes();
  }, []);

  // --- Load form ---
  useEffect(() => {
    if (!open) return;

    if ((mode === "form" || mode === "detail") && importData) {
      console.log("importData: ",importData);
      
      const prods = (importData.products || []).map((p) => ({
        id: p.id,
        name: p.name || "",
        price: p.price || 0,
        quantity: p.quantity || 1,
        sizes: p.sizes || [],
        sizeId: p.sizeId || 0,
        sizeName: p.sizeName || "",
      }));
      setImportProducts(prods);

      setForm({
        date: importData.createdDate
          ? formatDate(importData.createdDate)
          : new Date().toISOString().split("T")[0],
        supplierId: suppliers[0]?.id || 0,
        status: "Đang xử lý",
        employee: currentUser || "",
      });
    } else if (mode === "form") {
      setImportProducts([]);
      setForm({
        date: new Date().toISOString().split("T")[0],
        supplierId: 0,
        status: "Đang xử lý",
        employee: currentUser || "",
      });
    }
  }, [importData, mode, open, suppliers]);

  // --- Form change ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (mode === "detail") return;
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "supplierId" ? Number(value) : value,
    }));
  };

  const handleProductQuantityChange = (index: number, quantity: number) => {
    if (mode === "detail") return;
    setImportProducts(prev => {
      const copy = [...prev];
      copy[index].quantity = quantity;
      return copy;
    });
  };

  const handleRemoveProduct = (index: number) => {
    if (mode === "detail") return;
    setImportProducts(prev => prev.filter((_, i) => i !== index));
  };

  const total = importProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleChangeSize = (index: number, sizeId: number, sizeName: string) => {
    setImportProducts(prev => {
      const copy = [...prev];
      copy[index].sizeId = sizeId;
      copy[index].sizeName = sizeName;
      return copy;
    });
  };

  const handleAddProductWithSize = (p: ProductType, s: Size) => {
    if (mode === "detail") return;
    setImportProducts(prev => [
      ...prev,
      {
        ...p,
        quantity: 1,
        price: p.price,
        sizeId: s.sizeId,
        sizeName: s.sizeName,
      },
    ]);
    setSearch("");
    setDropdown([]);
  };

  // --- Dropdown filter theo size chưa thêm ---
  useEffect(() => {
    if (!search.trim()) {
      setDropdown([]);
      return;
    }

    setDropdown(
      products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) &&
        p.sizes.some(s => !importProducts.find(ip => ip.id === p.id && ip.sizeId === s.sizeId))
      )
    );
  }, [search, importProducts, products]);

  // --- Submit ---
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (mode === "detail") return;

  //   if (form.supplierId === 0) {
  //     showError("Vui lòng chọn nhà cung cấp!");
  //     return;
  //   }

  //   const payload = {
  //     createdDate: form.date,
  //     supplierId: form.supplierId,
  //     accountId: user.id,
  //     total,
  //     status: form.status,
  //     products: importProducts.map(p => ({
  //       productId: p.id,
  //       quantity: p.quantity,
  //       price: p.price,
  //       sizeId: p.sizeId,
  //     })),
  //   };

  //   try {
  //     if (importData && mode !== "delete") {
  //       const res = await fetch(`/api/importreceipts/${importData.id}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       });
  //       await res.json();
  //       showSuccess("Cập nhật phiếu nhập thành công!");
  //     } else {
  //       const res = await fetch("/api/importreceipts", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       });
  //       await res.json();
  //       showSuccess("Thêm phiếu nhập thành công!");
  //     }
  //     setOpen(false);
  //     refresh();
  //   } catch (err) {
  //     console.error(err);
  //     showError("Có lỗi xảy ra!");
  //   }
  // };
  
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readonly) return;

    

    const payload = {
      createdDate: form.date,
      supplierId: form.supplierId,
      accountId: user.id,
      total: total,
      status: form.status,
      products: importProducts.map(p => ({
        productId: p.id,
        quantity: p.quantity,
        price: p.price,
        sizeId: p.sizeId,
      })),
    };

    console.log("payload: ",payload);

    try {
      if (mode === "delete" && importData?.id) {
        await fetch(`/api/importreceipts/${importData.id}`, { method: "DELETE" });
        showSuccess("Xóa phiếu nhập thành công!");
      } else if (importData && mode !== "delete") {
        // Cập nhật phiếu nhập
        const res = await fetch(`/api/importreceipts/${importData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log("hihi: ",data)

        const oldProducts = importData.products || [];
        const oldProductIds = oldProducts.map(p => p.id);
        const newProductIds = importProducts.map(p => p.id);

        const productsToUpdate = importProducts.filter(p => oldProductIds.includes(p.id));
        const productsToAdd = importProducts.filter(p => !oldProductIds.includes(p.id));
        const productsToDelete = oldProducts.filter(p => !newProductIds.includes(p.id));

        console.log("productsToUpdate: ",productsToUpdate)

        await Promise.all([
          ...productsToUpdate.map(p =>
            fetch("/api/importdetails", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                importReceiptId: data.id,
                productId: p.id,
                quantity: p.quantity,
                price: p.price,
                sizeId: p.sizeId,
              }),
            })
          ),
          ...productsToAdd.map(p =>
            fetch("/api/importdetails", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                importReceiptId: data.id,
                productId: p.id,
                quantity: p.quantity,
                price: p.price,
                sizeId: p.sizeId,
              }),
            })
          ),
          ...productsToDelete.map(p =>
            fetch("/api/importdetails", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ importReceiptId: data.id, productId: p.id }),
            })
          ),
        ]);
        showSuccess("Cập nhật phiếu nhập thành công!");
      } else {
        if (form.supplierId === 0) {
      showError("Vui lòng chọn nhà cung cấp!");
      return;
    }
        // Thêm mới
        const res = await fetch("/api/importreceipts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        await Promise.all(
          importProducts.map(p =>
            fetch("/api/importdetails", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                importReceiptId: data.id,
                productId: p.id,
                quantity: p.quantity,
                price: p.price,
                sizeId: p.sizeId,
              }),
            })
          )
        );
        showSuccess("Thêm phiếu nhập thành công!");
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
          {mode === "detail" ? "📄 Chi tiết phiếu nhập" :
           mode === "delete" ? "❌ Xóa phiếu nhập" :
           importData ? "✏️ Sửa phiếu nhập" : "➕ Thêm phiếu nhập"}
        </h2>

        {mode === "delete" ? (
          <div>
            <p className="mb-4">Bạn có chắc chắn muốn xóa <b>phiếu nhập mã {importData?.id}</b> không?</p>
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
                <input type="date" name="date" value={form.date} onChange={handleChange}
                  disabled={readonly} className={`w-full p-2 border rounded ${readonly ? "bg-gray-100" : ""}`} />
              </div>
              <div>
                <label className="block mb-1">Nhân viên</label>
                <input type="text" value={form.employee} disabled className="w-full p-2 border rounded bg-gray-100" />
              </div>
              <div>
                <label className="block mb-1">Trạng thái</label>
                {readonly ? <input type="text" value={form.status} disabled className="w-full p-2 border rounded bg-gray-100" /> :
                  <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                  </select>}
              </div>
              <div>
                <label className="block mb-1">Nhà cung cấp</label>
                <select name="supplierId" value={form.supplierId} onChange={handleChange} disabled={readonly} className={`w-full p-2 border rounded ${readonly ? "bg-gray-100" : ""}`}>
                  <option value={0} disabled>-- Chọn nhà cung cấp --</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {/* Product search */}
            {/* Product search */}
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
          <li key={p.id} className="p-2 border-b">
            <div>{p.name} - {p.price}đ</div>
            <div className="ml-4 text-sm text-gray-600">
              {p.sizes.map((s: Size) => {
                const added = importProducts.find(ip => ip.id === p.id && ip.sizeId === s.sizeId);
                return (
                  <div
                    key={s.sizeId}
                    onClick={() => !added && handleAddProductWithSize(p, s)}
                    className={`cursor-pointer p-1 rounded ${added ? "text-gray-400 line-through" : "hover:bg-blue-100"}`}
                    title={`SL còn: ${s.quantity}`}
                  >
                    {s.sizeName} (SL: {s.quantity})
                  </div>
                );
              })}
            </div>
          </li>
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
                    <th className="p-2 border">Size</th>
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
                      <td className="p-2 border">{p.sizeName}</td>
                      <td className="p-2 border">
                        {readonly ? p.quantity : (
                          <input type="number" min={1} value={p.quantity}
                                 onChange={e => handleProductQuantityChange(i, Number(e.target.value))}
                                 className="w-16 p-1 border rounded text-center" />
                        )}
                      </td>
                      <td className="p-2 border">{p.price}</td>
                      <td className="p-2 border">{p.price * p.quantity}</td>
                      {!readonly && (
                        <td className="p-2 border">
                          <button type="button" onClick={() => handleRemoveProduct(i)} className="px-2 py-1 bg-red-600 text-white rounded">Xóa</button>
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
              {!readonly && <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{importData ? "Cập nhật" : "Thêm mới"}</button>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
