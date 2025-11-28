
import { useState } from "react";
import { Product } from "../../../app/types/interfaces";
import ProductForm from "./ProductForm";
// import ProductForm from "./ProductForm";
// import DeleteConfirm from "./DeleteConfirm";

export default function ProductTable({
    products,
    refresh,
}: {
    products: Product[];
    refresh: () => void;
}) {
    const [selected, setSelected] = useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [product, setProducts] = useState<Product[]>([
        { id: 1, name: "Ao thun", material: "cotton", categoryId: 10, price: 5000 }
    ])
    return (
        <div className="bg-white p-4 shadow rounded">
            <div className="text-right">
                <button
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                    onClick={() => {
                        setSelected(null);
                        setIsFormOpen(true);
                    }}
                >
                    ➕ Thêm sản phẩm
                </button>
            </div>

            <table className="w-full border">
                <thead className="bg-gray-100 text-center">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Tên</th>
                        <th className="p-2 border">Giá</th>
                        <th className="p-2 border">Kho</th>
                        <th className="p-2 border">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {product.map((p) => (
                        <tr key={p.id} className="border-t  text-center">
                            <td className="p-2 border">{p.id}</td>
                            <td className="p-2 border">{p.name}</td>
                            <td className="p-2 border">{p.material}</td>
                            <td className="p-2 border">{p.categoryId}</td>
                            <td className="p-2 border space-x-2">
                                <button
                                    className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                                    onClick={() => {
                                        setSelected(p);
                                        setIsFormOpen(true);
                                    }}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-600 text-white rounded cursor-pointer"
                                    onClick={() => {
                                        setSelected(p);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ProductForm
                open={isFormOpen}
                setOpen={setIsFormOpen}
                product={selected}
                refresh={refresh}
            />

            {/* <DeleteConfirm
                open={isDeleteOpen}
                setOpen={setIsDeleteOpen}
                product={selected}
                refresh={refresh}
            /> */}
        </div>
    );
}
