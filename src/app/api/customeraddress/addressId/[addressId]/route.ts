// src/app/api/customeraddress/[addressId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { addressId: string } }
) {
  try {
    const addressId = parseInt(params.addressId);
    if (isNaN(addressId)) {
      return NextResponse.json({ error: "AddressId không hợp lệ" }, { status: 400 });
    }

    // Xóa trong CustomerAddress trước nếu có liên kết
    await pool.query("DELETE FROM customeraddress WHERE addressId = ?", [addressId]);
    // Xóa trong Address
    await pool.query("DELETE FROM address WHERE id = ?", [addressId]);

    return NextResponse.json({ message: "Xóa địa chỉ thành công" });
  } catch (err) {
    console.error("DELETE Address Error:", err);
    return NextResponse.json({ error: "Xóa thất bại" }, { status: 500 });
  }
}
