"use client";

import { useEffect, useState } from "react";
import { Import } from "../../types/interfaces";
import { ImportDetail } from "../../types/interfaces";
import ImportTable from "../../../components/admin/imports/ImportTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";

export default function ImportsPage() {
  const [imports, setImports] = useState<Import[]>([
    { id: 1, date: "12/1/2025", total: 12500, supplierId: 1,status: "Chưa xử lý" },
    { id: 2, date: "12/1/2025", total: 15500, supplierId: 1,status: "Đã xác nhận" }
  ]);

  const loadImports = async () => {
    const res = await fetch("/api/imports");
    setImports(await res.json());
  };

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
