"use client";

import { useState, useEffect } from "react";

type Province = { code: number; name: string };
type District = { code: number; name: string };
type Ward = { code: number; name: string };

type Props = {
  onChange?: (value: string) => void;
  forceValidate?: boolean;
};

export default function AddressSelect({ onChange, forceValidate }: Props) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvinces, setSelectedProvinces] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState("");
  const [selectedWards, setSelectedWards] = useState("");

  const [provincesError, setProvincesError] = useState<string | null>(null);
  const [districtsError, setDistrictsError] = useState<string | null>(null);
  const [wardsError, setWardsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!selectedProvinces) {
      setProvincesError("Vui lòng chọn Tỉnh/Thành");
      return false;
    }
    if (!selectedDistricts) {
      setDistrictsError("Vui lòng chọn Quận/Huyện");
      return false;
    }
    if (!selectedWards) {
      setWardsError("Vui lòng chọn Phường/Xã");
      return false;
    }
    setError("");
    return true;
  };

  useEffect(() => {
    if (forceValidate) validate();
  }, [forceValidate]);

  // Load provinces
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v1/p")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(() => setError("Error"));
  }, []);

  const handleProvincesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvincesError(null);
    const code = e.target.value;

    setSelectedProvinces(code);
    setSelectedDistricts("");
    setSelectedWards("");
    setDistricts([]);
    setWards([]);

    fetch(`https://provinces.open-api.vn/api/v1/p/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts))
      .catch(() => setError("Error"));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrictsError(null);
    const code = e.target.value;

    setSelectedDistricts(code);
    setSelectedWards("");
    setWards([]);

    fetch(`https://provinces.open-api.vn/api/v1/d/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards))
      .catch(() => setError("Error"));
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedWards(code);
    setWardsError(null);

    const provinceName = provinces.find((p) => p.code === +selectedProvinces)?.name || "";
    const districtName = districts.find((d) => d.code === +selectedDistricts)?.name || "";
    const wardName = wards.find((w) => w.code === +code)?.name || "";

    onChange?.(`${wardName}, ${districtName}, ${provinceName}`);
  };

  return (
    <>
    
    <div className="grid grid-cols-3 gap-3 text-[13px]">
      {/* Tỉnh / Thành */}
      <div className="relative ">
        <select
          className={`w-full mt-2 rounded-md bg-white text-gray-700  px-3 py-3 shadow-[0_0_0_1px_#d9d9d9] appearance-none focus:shadow-[0_0_0_1px_#919191] ${
            provincesError ? "shadow-[0_0_0_1px_#e61616cd]" : ""
          }`}
          value={selectedProvinces}
          onChange={handleProvincesChange}
        >
          <option value="">Chọn tỉnh / thành</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Arrow icon */}
        <span className="absolute right-3 top-[60%] -translate-y-1/2 pointer-events-none text-xs text-gray-600">
          ▼
        </span>

        {provincesError && (
          <span className="absolute left-1 bottom-[-18px] text-red-600 text-xs">
            {provincesError}
          </span>
        )}
      </div>

      {/* Quận / Huyện */}
      <div className="relative">
        <select
          className={`w-full mt-2 rounded-md bg-white text-gray-700 px-3 py-3 shadow-[0_0_0_1px_#d9d9d9] appearance-none focus:shadow-[0_0_0_1px_#919191] ${
            districtsError ? "shadow-[0_0_0_1px_#e61616cd]" : ""
          }`}
          value={selectedDistricts}
          onChange={handleDistrictChange}
        >
          <option value="">Chọn quận / huyện</option>
          {districts.map((d) => (
            <option key={d.code} value={d.code}>
              {d.name}
            </option>
          ))}
        </select>

        <span className="absolute right-3 top-[60%] -translate-y-1/2 pointer-events-none text-xs text-gray-600">
          ▼
        </span>

        {districtsError && (
          <span className="absolute left-1 bottom-[-18px] text-red-600 text-xs">
            {districtsError}
          </span>
        )}
      </div>

      {/* Phường / Xã */}
      <div className="relative">
        <select
          className={`w-full mt-2 rounded-md bg-white text-gray-700 px-3 py-3 shadow-[0_0_0_1px_#d9d9d9] appearance-none focus:shadow-[0_0_0_1px_#919191] ${
            wardsError ? "shadow-[0_0_0_1px_#e61616cd]" : ""
          }`}
          value={selectedWards}
          onChange={handleWardChange}
        >
          <option value="">Chọn phường / xã</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>

        <span className="absolute right-3 top-[60%] -translate-y-1/2 pointer-events-none text-xs text-gray-600">
          ▼
        </span>

        {wardsError && (
          <span className="absolute left-1 bottom-[-18px] text-red-600 text-xs">
            {wardsError}
          </span>
        )}
      </div>
    </div>
    <div className="flex justify-center mt-4">
        <button className=" w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
            Thêm địa chỉ
        </button>
    </div>
    </>
  );
}
