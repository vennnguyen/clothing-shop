import { useEffect, useState } from "react";
import { Trash2, FilePenIcon, Plus } from "lucide-react";
import AddPromotionForm from "./AddPromotionForm";
import { Promotion } from "../../../app/types/interfaces";
import { formatDate } from "../../../utils/format";


interface PromotionTableProps {
    promotions: Promotion[];
    refresh: () => void;
    changeMode: (mode: string) => void;
}
export default function PromotionTable({
    promotions,
    refresh,
    changeMode
}: PromotionTableProps) {
    const [selected, setSelected] = useState<Promotion | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // debounce search
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         onSearch(searchTerm);
    //     }, 500);

    //     return () => clearTimeout(timer);
    // }, [searchTerm, onSearch]);

    return (
        <div className="bg-white p-4 shadow rounded">
            {/* Header */}
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Tìm theo tên chương trình khuyến mãi..."
                    className="w-100 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button
                    className="mb-4 p-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700"
                    onClick={() => {
                        setSelected(null);
                        changeMode("create");
                    }}
                >
                    <span className="flex items-center gap-2">
                        <Plus size={20} />
                        Thêm khuyến mãi
                    </span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-y-auto max-h-[460px]">
                <table className="w-full border">
                    <thead className="bg-gray-100 text-center">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Tên chương trình</th>
                            <th className="p-2 border">Loại</th>
                            <th className="p-2 border">Giá trị</th>
                            <th className="p-2 border">Thời gian</th>
                            <th className="p-2 border">Trạng thái</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map((p) => (
                            <tr key={p.id} className="border-t text-center">
                                <td className="p-2 border">{p.id}</td>
                                <td className="p-2 border font-medium">{p.promotion_name}</td>
                                <td className="p-2 border">
                                    {p.type_name === "percent" ? "Phần trăm" : "Tiền mặt"}
                                </td>
                                <td className="p-2 border">
                                    {p.type_name === "percent"
                                        ? `${p.discount_value}%`
                                        : p.discount_value.toLocaleString("vi-VN") + "đ"}
                                </td>
                                <td className="p-2 border">
                                    {formatDate(p.start_date)} → {formatDate(p.end_date)}
                                </td>
                                <td className="p-2 border">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 1
                                            ? "bg-green-100 text-green-700 border border-green-200"
                                            : "bg-gray-100 text-gray-600 border border-gray-200"
                                            }`}
                                    >
                                        {p.status === 1 ? "Đang áp dụng" : "Ngừng"}
                                    </span>
                                </td>
                                <td className="p-2 border space-x-2">
                                    <button
                                        className="px-2 py-1 bg-white text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                                        onClick={() => {
                                            setSelected(p);
                                            setIsFormOpen(true);
                                        }}
                                    >
                                        <FilePenIcon />
                                    </button>

                                    <button
                                        className="px-2 py-1 bg-white text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
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
            </div>


            {/* <AddPromotionForm
                open={isFormOpen}
                setOpen={setIsFormOpen}
                promotion={selected}
                refresh={refresh}
            /> */}

            {/*
      <DeleteConfirm
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        promotion={selected}
        refresh={refresh}
      />
      */}
        </div>
    );
}
