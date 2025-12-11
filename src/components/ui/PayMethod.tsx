"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDolly } from "@fortawesome/free-solid-svg-icons";

export default function PayMethod() {
  const [selected, setSelected] = useState("pay");

  return (
    <div className="w-full mt-12 pb-5">
      <h3 className="pb-5 text-lg font-medium">Phương thức thanh toán</h3>

      <div className="border-2 border-gray-300 rounded-md h-[75px] pl-[5px] cursor-pointer 
                      flex items-center gap-4">
        {/* 15% */}
        <input
          type="radio"
          className="w-[15%] h-5"
          onChange={() => setSelected("pay")}
          checked={selected === "pay"}
          name="pay"
        />

        {/* 15% */}
        <div className="w-auto flex justify-center">
          <FontAwesomeIcon icon={faDolly} className="text-[30px]" />
        </div>

        {/* 70% */}
        <label className="w-[75%] text-gray-500 cursor-pointer">
          Thanh toán cho shipper khi nhận hàng (COD)
        </label>
      </div>
    </div>
  );
}
