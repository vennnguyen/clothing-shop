
import { useEffect, useState } from "react";
import { Product } from "../../../app/types/interfaces";
import ProductForm from "./ProductForm";
// import ProductForm from "./ProductForm";
// import DeleteConfirm from "./DeleteConfirm";
import { Trash2, FilePenIcon, Plus } from "lucide-react";
export default function ProductTable({
    products,
    refresh,
    onSearch,
}: {
    products: Product[];
    refresh: () => void;
    onSearch: (keyword: string) => void;
}) {
    const [selected, setSelected] = useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // ...
    // [MỚI] Kỹ thuật Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);

        // Nếu bạn cài ESLint chuẩn, nó sẽ bắt buộc thêm onSearch vào đây.
        // Nhờ có useCallback ở cha, việc thêm onSearch vào đây sẽ KHÔNG gây lặp nữa.
    }, [searchTerm, onSearch]);
    // ...

    return (
        <div className="bg-white p-4 shadow rounded">
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Nhập mã, tên hoặc danh mục sản phẩm..."
                    className="w-100 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div>
                    <button
                        className="mb-4 p-2 bg-green-600 text-white rounded cursor-pointer"
                        onClick={() => {
                            setSelected(null);
                            setIsFormOpen(true);
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <Plus size={20} />
                            Thêm sản phẩm
                        </span>
                    </button>
                </div>
            </div>

            <table className="w-full border">
                <thead className="bg-gray-100 text-center">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Ảnh</th>
                        <th className="p-2 border">Tên</th>
                        <th className="p-2 border">Giá</th>
                        <th className="p-2 border">Danh mục</th>
                        <th className="p-2 border">Size & Số lượng</th>
                        <th className="p-2 border">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="border-t  text-center">
                            <td className="p-2 border">{p.id}</td>
                            <td className="p-2 border">
                                <img src={p.imageUrl} alt="Noimg" style={{ width: "50px", height: "50px", justifySelf: "center" }} />
                            </td>
                            <td className="p-2 border">{p.name}</td>
                            <td className="p-2 border">{p.price}</td>
                            <td className="p-2 border">{p.category}</td>
                            <td className="p-2 border">{p.sizes}</td>
                            <td className="p-2 border space-x-2">
                                <button
                                    className="px-2 py-1 bg-white text-blue-500 border border-blue-500 rounded cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                    onClick={() => {
                                        setSelected(p);
                                        setIsFormOpen(true);
                                    }}
                                >
                                    <FilePenIcon />
                                </button>
                                <button
                                    className="px-2 py-1 bg-white text-red-500 border border-red-500 rounded cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200"
                                    onClick={() => {
                                        setSelected(p);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    <Trash2 />
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
