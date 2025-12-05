"use client";

import { useEffect, useState } from "react";

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  field: "họ và tên" | "email" | "SĐT" | string;
  forceValidate?: boolean;
  validate?: boolean;
  className?: string;
}

export default function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  field,
  forceValidate,
  validate = false,
  className = "",
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (forceValidate) runValidate(value);
  }, [forceValidate]);

  const emailRegex = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/;
  const phoneRegex = /^(0|\+84)(\d{9})$/;

  const runValidate = (val: string) => {
    if (validate === true) return;

    if (!val) {
      setError(`Vui lòng nhập ${field}`);
      return;
    }

    switch (field) {
      case "họ và tên":
        setError(val.trim().length < 2 ? "Tên quá ngắn" : "");
        break;

      case "email":
        setError(!emailRegex.test(val.toLowerCase()) ? "Email không hợp lệ" : "");
        break;

      case "SĐT":
        setError(!phoneRegex.test(val) ? "SĐT không hợp lệ" : "");
        break;

      default:
        setError("");
    }
  };

  return (
    <div className={`relative pb-4 ${className}`}>
      {/* Label */}
      <label
        className={`absolute left-3 top-2 text-[11px] text-gray-400 transition-all duration-300 pointer-events-none 
          ${focused || value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
        `}
      >
        {label}
      </label>

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e);
          runValidate(e.target.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={!focused && !value ? placeholder : ""}
        className={`w-full h-12 mt-2 rounded-md bg-white text-gray-700 px-3 py-3 
          shadow-[0_0_0_1px_#d9d9d9] transition 
          focus:outline-none focus:shadow-[0_0_0_1px_#919191]
          ${error ? "shadow-[0_0_0_1px_rgba(230,22,22,0.8)]" : ""}
        `}
      />

      {/* Error message */}
      {error && (
        <span className="absolute left-1 top-14 text-[12px] text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
