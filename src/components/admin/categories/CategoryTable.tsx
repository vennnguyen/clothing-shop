
import { useState } from "react";
import { Category } from "../../../app/types/interfaces";
import { Trash2, FilePenIcon, Plus } from "lucide-react";
import CategoryForm from "./CategoryForm";
export default function CategoryTable({
    categories,
    refresh,
}: {
    categories: Category[];
    refresh: () => void;
}) {
    const [selected, setSelected] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    return (
        <div className="bg-white p-4 shadow rounded">
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    className="w-100 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                        <th className="p-2 border w-1/12">ID</th>
                        <th className="p-2 border w-auto">Tên</th>
                        <th className="p-2 border w-2/12">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id} className="border-t text-center">
                            <td className="p-2 border">{cat.id}</td>
                            <td className="p-2 border">{cat.name}</td>
                            <td className="p-2 border space-x-2">
                                <button
                                    className="px-2 py-1 bg-white text-blue-500 border border-blue-500 rounded cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                    onClick={() => {
                                        setSelected(cat);
                                        setIsFormOpen(true);
                                    }}
                                >
                                    <FilePenIcon />
                                </button>
                                <button
                                    className="px-2 py-1 bg-white text-red-500 border border-red-500 rounded cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200"
                                    onClick={() => {
                                        setSelected(cat);
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

            <CategoryForm
                open={isFormOpen}
                setOpen={setIsFormOpen}
                category={selected}
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
