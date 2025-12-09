"use client";

// Định nghĩa kiểu dữ liệu cho phương thức vận chuyển
export type ShippingMethod = "delivery" | "pick";

interface DeliveryMethodProps {
  // Giá trị đang được chọn (nhận từ cha)
  selectedMethod: ShippingMethod;
  // Hàm callback để báo cho cha biết khi user thay đổi (kèm theo phí ship)
  onMethodChange: (method: ShippingMethod, fee: number) => void;
}

function formatPrice(priceNumber: number, locale: string = "vi-VN") {
  if (priceNumber == null) return "";
  return priceNumber.toLocaleString(locale) + "₫";
}

export default function DeliveryMethod({ selectedMethod, onMethodChange }: DeliveryMethodProps) {

  const itemClass = "flex items-center h-[75px] px-5 cursor-pointer border rounded-md transition-all";

  // Style cho item được chọn (Active) và không được chọn (Inactive)
  const activeClass = "border-orange-500 bg-orange-50 ring-1 ring-orange-500 z-10";
  const inactiveClass = "border-gray-300 hover:border-orange-300 bg-white";

  return (
    <div className="w-full mt-8"> {/* Giảm margin top chút cho cân đối */}
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Phương thức vận chuyển</h3>

      <div className="flex flex-col -space-y-px"> {/* -space-y-px để viền chồng lên nhau đẹp hơn */}

        {/* Lựa chọn 1: Giao hàng tận nơi */}
        <div
          className={`${itemClass} rounded-t-md rounded-b-none ${selectedMethod === "delivery" ? activeClass : inactiveClass
            }`}
          onClick={() => onMethodChange("delivery", 20000)} // Báo lên cha: Là Delivery, phí 20k
        >
          <div className="w-[10%] flex justify-center">
            <input
              type="radio"
              name="shipping"
              checked={selectedMethod === "delivery"}
              onChange={() => onMethodChange("delivery", 20000)}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
          </div>

          <label className="w-[70%] text-gray-700 cursor-pointer font-medium">
            Giao hàng tận nơi
          </label>

          <span className="w-[20%] text-gray-800 text-sm font-semibold text-right">
            {formatPrice(20000)}
          </span>
        </div>

        {/* Lựa chọn 2: Lấy tại cửa hàng */}
        <div
          className={`${itemClass} rounded-b-md rounded-t-none ${selectedMethod === "pick" ? activeClass : inactiveClass
            }`}
          onClick={() => onMethodChange("pick", 0)} // Báo lên cha: Là Pick, phí 0đ
        >
          <div className="w-[10%] flex justify-center">
            <input
              type="radio"
              name="shipping"
              checked={selectedMethod === "pick"}
              onChange={() => onMethodChange("pick", 0)}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
          </div>

          <label className="w-[70%] text-gray-700 cursor-pointer font-medium">
            Lấy tại cửa hàng
          </label>

          <span className="w-[20%] text-gray-800 text-sm font-semibold text-right">
            {formatPrice(0)}
          </span>
        </div>

      </div>
    </div>
  );
}