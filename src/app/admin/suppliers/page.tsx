"use client";

import { useEffect, useState } from "react";
import { Supplier } from "../../types/interfaces";
import SupplierTable from "../../../components/admin/suppliers/SupplierTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleCarryBox } from "@fortawesome/free-solid-svg-icons";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const loadSuppliers = async () => {
    const res = await fetch("/api/suppliers");
    setSuppliers(await res.json());
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // useEffect(()=>{
  //   console.log("suppliers: ",suppliers)
  // },[suppliers])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 flex items-center gap-2">
        <FontAwesomeIcon icon={faPeopleCarryBox} />
        Quản lý nhà cung cấp
      </h1>
      <SupplierTable suppliers={suppliers} refresh={loadSuppliers} />
    </div>
  );
}
