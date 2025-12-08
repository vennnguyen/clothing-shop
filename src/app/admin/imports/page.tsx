"use client";

import { useEffect, useState } from "react";
import { Import } from "../../types/interfaces";
import { ImportDetail } from "../../types/interfaces";
import ImportTable from "../../../components/admin/imports/ImportTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { getCurrentUser } from "../../../actions/auth";

export default function ImportsPage() {
  const [imports, setImports] = useState<Import[]>([
    // { id: 1, date: "12/1/2025", total: 12500, supplierId: 1,status: "Chưa xử lý" },
    // { id: 2, date: "12/1/2025", total: 15500, supplierId: 1,status: "Đã xác nhận" }
  ]);
  const [user, setUser] = useState<any>(null); // Hoặc type User nếu có

  useEffect(() => {
    const checkAuth = async () => {
      // Gọi Server Action
      const userData = await getCurrentUser();

      if (userData) {
        console.log("User đang đăng nhập:", userData);
        setUser(userData);
        console.log(userData);
        // Bạn có thể check quyền ở đây
        // if (userData.role !== 'ADMIN') { router.push('/login') }
      } else {
        console.log("Chưa đăng nhập");
      }
    };

    checkAuth();
  }, []);
  const loadImports = async () => {
    const res = await fetch("/api/importreceipts");
    const data = await res.json();

    // Map productId thành id để đồng bộ với interface Product
    const mappedData = data.map((imp: any) => ({
      ...imp,
      products: (imp.products || []).map((p: any) => ({
        id: p.productId,   // bắt buộc phải có id
        name: p.name || "",
        price: p.price || 0,
        quantity: p.quantity || 1,
      })),
    }));

    setImports(mappedData);
  };

  // useEffect(()=>{
  //   console.log("imports: ",imports)
  // },[imports])

  useEffect(() => {
    loadImports();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 flex items-center gap-2">
        <FontAwesomeIcon icon={faCalendarPlus} />
        Quản lý phiếu nhập
      </h1>
      <ImportTable imports={imports} refresh={loadImports} />
    </div>
  );
}
