"use client";

import { useState, useEffect } from "react";

type Province = { code: number; name: string };
type Ward = { code: number; name: string };

type Props = {
  onChangeProvince?: (province: Province | null) => void;
  onChangeWard?: (ward: Ward | null) => void;
  forceValidate?: boolean;
  resetKey?: number; // mới
};

export default function AddressSelect({ onChangeProvince, onChangeWard, forceValidate,resetKey }: Props) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");

  const [provinceError, setProvinceError] = useState<string | null>(null);
  const [wardError, setWardError] = useState<string | null>(null);

  const validate = () => {
    let valid = true;
    if (!selectedProvinceCode) {
      setProvinceError("Vui lòng chọn Tỉnh/Thành");
      valid = false;
    } else setProvinceError(null);

    if (!selectedWardCode) {
      setWardError("Vui lòng chọn Phường/Xã");
      valid = false;
    } else setWardError(null);

    return valid;
  };

  useEffect(() => {
    if (forceValidate) validate();
  }, [forceValidate]);

  useEffect(() => {
    setSelectedProvinceCode("");
    setSelectedWardCode("");
    setWards([]);
  }, [resetKey]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/p")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(() => setProvinceError("Lỗi tải danh sách tỉnh/thành"));
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const code = e.target.value;
  setSelectedProvinceCode(code);
  setSelectedWardCode("");
  setWards([]);

  const province = provinces.find((p) => p.code === +code) || null;
  onChangeProvince?.(province);

  // validate lại khi chọn province
  if (province) setProvinceError(null);
  else if (forceValidate) setProvinceError("Vui lòng chọn Tỉnh/Thành");

  if (province) {
    fetch(`https://provinces.open-api.vn/api/v2/p/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards))
      .catch(() => setWardError("Lỗi tải danh sách phường/xã"));
  } else {
    setWards([]);
  }
};

const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const code = e.target.value;
  setSelectedWardCode(code);

  const ward = wards.find((w) => w.code === +code) || null;
  onChangeWard?.(ward);

  // validate lại khi chọn ward
  if (ward) setWardError(null);
  else if (forceValidate) setWardError("Vui lòng chọn Phường/Xã");
};


  return (
    <>
    
    <div className="grid grid-cols-2 gap-2 text-[13px]">
      {/* Province */}
      <div className="relative">
        <select
          className={`w-full mt-2 rounded-md bg-white text-gray-700 px-3 py-3 shadow-[0_0_0_1px_#d9d9d9] appearance-none focus:shadow-[0_0_0_1px_#919191] ${
            provinceError ? "shadow-[0_0_0_1px_#e61616cd]" : ""
          }`}
          value={selectedProvinceCode}
          onChange={handleProvinceChange}
        >
          <option value="">Chọn tỉnh / thành</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
        {provinceError && <span className="absolute left-1 bottom-[-18px] text-red-600 text-xs">{provinceError}</span>}
      </div>

      {/* Ward */}
      <div className="relative">
        <select
          className={`w-full mt-2 rounded-md bg-white text-gray-700 px-3 py-3 shadow-[0_0_0_1px_#d9d9d9] appearance-none focus:shadow-[0_0_0_1px_#919191] ${
            wardError ? "shadow-[0_0_0_1px_#e61616cd]" : ""
          }`}
          value={selectedWardCode}
          onChange={handleWardChange}
        >
          <option value="">Chọn phường / xã</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>
        {wardError && <span className="absolute left-1 bottom-[-18px] text-red-600 text-xs">{wardError}</span>}
      </div>
      
    </div>
    </>
  );
}
