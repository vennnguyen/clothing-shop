import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";


export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const customerId = parseInt(params.customerId);

    if (isNaN(customerId)) {
      return NextResponse.json({ error: "CustomerId không hợp lệ" }, { status: 400 });
    }

    // Lấy customerAddress mặc định
    const [rows]: any = await pool.query(
      `
      SELECT a.id, a.ward, a.city, a.houseNumber
      FROM CustomerAddress ca
      JOIN Address a ON a.id = ca.addressId
      WHERE ca.customerId = ? AND ca.isDefault = 1
      LIMIT 1
      `,
      [customerId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy địa chỉ" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET Customer Address Error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
