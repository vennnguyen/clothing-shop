import React, { ChangeEvent } from "react";

// Định nghĩa kiểu dữ liệu cho ảnh
export type ImageInput = {
    id: number;
    file?: File;
    preview?: string;
};

interface AddProductImageProps {
    images: ImageInput[];
    setImages: React.Dispatch<React.SetStateAction<ImageInput[]>>;
}

const AddProductImage: React.FC<AddProductImageProps> = ({ images, setImages }) => {

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setImages((prev) =>
            prev.map((img) => (img.id === id ? { ...img, file, preview } : img))
        );
    };

    const addInputImage = () => {
        if (images.length >= 9) {
            alert("Tối đa chỉ cho thêm 9 hình");
            return;
        }
        setImages((prev) => [...prev, { id: Date.now() }]);
    };

    const removeInputImage = (id: number) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    return (
        <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-start min-h-[300px]">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Hình ảnh sản phẩm</h3>

            <div className="flex flex-wrap justify-center gap-4 w-full">
                {images.map((img) => (
                    <div key={img.id} className="relative w-24 h-24 sm:w-28 sm:h-28 group">
                        <input
                            type="file"
                            accept="image/*"
                            id={`img-${img.id}`}
                            onChange={(e) => handleImageChange(e, img.id)}
                            className="hidden"
                        />

                        <label
                            htmlFor={`img-${img.id}`}
                            className="w-full h-full flex items-center justify-center border border-gray-300 bg-white rounded-lg cursor-pointer hover:border-sky-400 transition-colors overflow-hidden shadow-sm"
                        >
                            {img.preview ? (
                                <img
                                    src={img.preview}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-300 text-4xl font-light">+</span>
                            )}
                        </label>

                        {/* Nút xóa */}
                        {images.length > 1 && (
                            <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={() => removeInputImage(img.id)}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button
                    type="button"
                    className="text-sm bg-sky-100 text-sky-700 hover:bg-sky-200 font-medium py-2 px-4 rounded-full transition-colors"
                    onClick={addInputImage}
                >
                    + Thêm ảnh
                </button>
            </div>
        </div>
    );
};

export default AddProductImage;