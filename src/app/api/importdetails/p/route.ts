import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    // Lấy tất cả products
    const [products] = await pool.query(`
      SELECT p.id, p.name, p.price, p.description, p.categoryId, p.status, c.name as categoryName
      FROM Products p
      LEFT JOIN Categories c ON p.categoryId = c.id
    `);

    // Lấy tất cả product sizes
    const [productSizes] = await pool.query(`
      SELECT ps.productId, ps.sizeId, s.sizeName, ps.quantity
      FROM ProductSizes ps
      JOIN Sizes s ON ps.sizeId = s.id
    `);

    // Gom size vào sản phẩm
    const productsWithSizes = (products as any[]).map((p) => ({
      ...p,
      sizes: (productSizes as any[])
        .filter((ps) => ps.productId === p.id)
        .map((ps) => ({
          sizeId: ps.sizeId,
          sizeName: ps.sizeName,
          quantity: ps.quantity,
        })),
    }));

    return NextResponse.json(productsWithSizes);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
