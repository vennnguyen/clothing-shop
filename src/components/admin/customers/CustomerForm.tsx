"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Customer } from "../../../app/types/interfaces";
import { phoneRegex } from "../../../lib/validator";

export default function CustomerForm({
  customer,
  onClose,
  onSuccess,
  customers,
}: {
  customer: Customer | null;
  onClose: () => void;
  onSuccess: (customer: Customer) => void;
  customers: Customer[];
}) {
  const [email, setEmail] = useState(customer?.email || "");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(() => {
    // Format dateOfBirth từ DB sang YYYY-MM-DD
    if (customer?.dateOfBirth) {
      const date = new Date(customer.dateOfBirth);
      return date.toISOString().split('T')[0]; // "1998-12-20"
    }
    return "";
  });
  const [phone, setPhone] = useState(customer?.phone || "");
  const [fullName, setFullName] = useState(customer?.fullName || "");
  const [gender, setGender] = useState(customer?.gender || "");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    //kiểm tra số điện thoại và email tồn tại bằng vòng lặp
    for (const c of customers) {
      if (c.phone === phone) {
        toast.error("Số điện thoại đã tồn tại!");
        setLoading(false);
        return;
      }
      if (c.email === email) {
        toast.error("Email đã tồn tại!");
        setLoading(false);
        return;
      }
    }

    //valide tên phải là chữ có thể có dấu và khoảng trắng, độ dài tối thiểu 3 ký tự
    if (!/^[\p{L}\s]{3,}$/u.test(fullName)) {
      toast.error("Họ và tên không hợp lệ!");
      setLoading(false);
      return;
    }

    //valite số điện thoại
    if(phoneRegex.test(phone)===false){
      toast.error("Số điện thoại không hợp lệ!");
      setLoading(false);
      return;
    }

    const body: any = { email, dateOfBirth, phone, fullName, gender};
    if (password) body.password = password;
    console.log(body);

    try {
      const url = customer ? `/api/customers/${customer.id}` : "/api/customers";
      const method = customer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(customer ? "Cập nhật thành công!" : "Thêm khách hàng thành công!");
        onSuccess(data.customer);
      } else {
        toast.error(data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          {customer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            />
          </div>

          {/* Password với nút ẩn/hiện */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mật khẩu {customer ? "(Để trống nếu không đổi)" : ""}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!customer}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* birthday */}
          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input
              type="date" 
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input
              type="text" 
              required
              value={phone}
              onChange={(e) => {setPhone(e.target.value)}}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* fullName */}
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input
              type="text" 
              required
              value={fullName}
              onChange={(e) => {setFullName(e.target.value)}}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Giới tính</label>
            <select
              value={gender}
              required
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>  

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}