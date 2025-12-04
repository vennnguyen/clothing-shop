import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Nhớ import CSS của Swiper nếu chưa có trong file gốc
import 'swiper/css';
import 'swiper/css/navigation';
import { ProductImages } from '../../app/types/interfaces';

// import { FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type ImageSliderProps = {
    images: ProductImages[];
    onSelect: (img: string) => void;
    selectedImageUrl: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, onSelect, selectedImageUrl }) => {

    const getImageUrl = (url: string | undefined) => {
        if (!url) return 'https://via.placeholder.com/150?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:')) {
            return url;
        }
        if (url.startsWith('/uploads')) {
            const baseUrl = 'http://localhost:3000';
            return `${baseUrl}${url}`;
        }
        return url;
    };

    return (
        // WRAPPER: Flex row trên mobile, Flex column trên màn hình md trở lên
        <div className="flex flex-row md:flex-col items-center justify-center gap-2 w-full h-full relative">

            {/* NÚT PREV */}
            <button
                id="my-custom-prev-button"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {/* Mobile: Ẩn Up, Hiện Left | Desktop: Hiện Up, Ẩn Left */}
                <ChevronUp className="hidden md:block" />
                <ChevronLeft className="block md:hidden" />
            </button>

            <Swiper
                modules={[Navigation]}
                direction={'horizontal'}
                spaceBetween={10}
                slidesPerView={3} // Mặc định mobile
                className="w-full md:h-[460px] py-2" // md:h-[460px] là chiều cao cần thiết để chứa 4 ảnh dọc (100px * 4 + gap)
                navigation={{
                    prevEl: '#my-custom-prev-button',
                    nextEl: '#my-custom-next-button',
                }}
                breakpoints={{
                    768: {
                        direction: 'vertical',
                        slidesPerView: 4,
                        spaceBetween: 10,
                    },
                }}
            >
                {images.map((img) => {
                    const isActive = img.imageUrl === selectedImageUrl;

                    return (
                        <SwiperSlide key={img.id} className="flex justify-center">
                            <div
                                className="relative group overflow-hidden rounded-[10px]"
                                onClick={() => onSelect(img.imageUrl)}
                            >
                                <img
                                    src={getImageUrl(img.imageUrl)}
                                    alt="Product thumbnail"
                                    // STYLE ẢNH BẰNG TAILWIND
                                    className={`
                                        w-[100px] h-[100px] 
                                        object-cover rounded-[10px] cursor-pointer 
                                        transition-all duration-300
                                        group-hover:scale-105
                                        ${isActive
                                            ? 'border-[3px] border-red-500'
                                            : 'border border-gray-300 hover:border-gray-400'
                                        }
                                    `}
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23999' dominant-baseline='middle' text-anchor='middle'%3EError%3C/text%3E%3C/svg%3E";
                                        target.onerror = null;
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* NÚT NEXT */}
            <button
                id="my-custom-next-button"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {/* Mobile: Ẩn Down, Hiện Right | Desktop: Hiện Down, Ẩn Right */}
                <ChevronDown className="hidden md:block" />
                <ChevronRight className="block md:hidden" />
            </button>
        </div >
    );
}

export default ImageSlider;