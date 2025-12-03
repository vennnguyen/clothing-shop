// import Swiper from "swiper"
import { Truck, RotateCcw, Zap, Headset } from 'lucide-react';
export default function Banner() {
    // Dữ liệu tĩnh để render lặp (giúp code gọn hơn và dễ thay đổi sau này)
    const features = [
        { icon: Truck, title: "Giao hàng toàn quốc", desc: "Thanh toán (COD) khi nhận hàng" },
        { icon: RotateCcw, title: "Đổi trả miễn phí", desc: "Trong vòng 30 ngày" }, // Đổi text ví dụ cho đa dạng
        { icon: Zap, title: "Vận chuyển siêu tốc", desc: "Nội thành trong 2h" },
        { icon: Headset, title: "Hỗ trợ 24/7", desc: "Hotline: 1900 xxxx" },
    ];

    return (
        <div className="relative w-full mb-20">
            {/* Ảnh bìa */}
            <div className="w-full h-[400px] md:h-[500px]">
                <img
                    src={'/uploads/anhbia.webp'}
                    alt="Banner"
                    className="w-full h-full"
                />
            </div>

            {/* Box thông tin nổi (Overlay) */}
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-3/4 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">

                    {features.map((item, index) => (
                        <div key={index} className="flex items-center w-full md:w-auto">
                            {/* Icon Box với Gradient */}
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#f38926] to-[#f0b677] text-white shadow-sm shrink-0">
                                <item.icon className="text-white w-6 h-6" strokeWidth={2} />
                            </div>

                            {/* Text Info */}
                            <div className="flex flex-col ml-3">
                                <h6 className="m-0 font-semibold text-sm md:text-base text-gray-800">
                                    {item.title}
                                </h6>
                                <p className="m-0 text-gray-500 text-xs">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}