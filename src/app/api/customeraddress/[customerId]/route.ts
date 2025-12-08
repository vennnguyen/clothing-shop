import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";


export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const { customerId } = await params;

    if (isNaN(Number(customerId))) {
      return NextResponse.json({ error: "CustomerId không hợp lệ" }, { status: 400 });
    }

    // Lấy customerAddress mặc định
    const [rows]: any = await pool.query(
      `
      SELECT a.id, a.ward, a.city, a.houseNumber, ca.isDefault
      FROM CustomerAddress ca
      JOIN Address a ON a.id = ca.addressId
      WHERE ca.customerId = ?

      `,
      [customerId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy địa chỉ" }, { status: 404 });
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET Customer Address Error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, houseNumber, ward, city, isDefault } = body;

    if (!customerId || !houseNumber || !ward || !city) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Thêm vào bảng Address trước
      const [addressResult]: any = await connection.query(
        `INSERT INTO Address (houseNumber, ward, city) VALUES (?, ?, ?)`,
        [houseNumber, ward, city]
      );

      const addressId = addressResult.insertId;

      // Nếu thêm địa chỉ mặc định, reset các địa chỉ khác
      if (isDefault) {
        await connection.query(
          `UPDATE CustomerAddress SET isDefault = 0 WHERE customerId = ?`,
          [customerId]
        );
      }

      // Thêm vào CustomerAddress
      const [customerAddressResult]: any = await connection.query(
        `INSERT INTO CustomerAddress (customerId, addressId, isDefault) VALUES (?, ?, ?)`,
        [customerId, addressId, isDefault ? 1 : 0]
      );

      await connection.commit();

      return NextResponse.json({
        id: customerAddressResult.insertId,
        customerId,
        addressId,
        houseNumber,
        ward,
        city,
        isDefault: !!isDefault,
      });
    } catch (err) {
      await connection.rollback();
      console.error("POST Customer Address Error:", err);
      return NextResponse.json({ error: "Thêm địa chỉ thất bại" }, { status: 500 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("POST Customer Address Error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}