import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET() {
    const conn = await pool.getConnection();
    try {
        // 1. Đếm tổng số sản phẩm đang kinh doanh (Status = 1)
        const [productCountRes] = await conn.query(
            "SELECT COUNT(*) as total FROM Products WHERE status = 1"
        );
        const totalProducts = (productCountRes as any)[0].total;

        // 2. Đếm số lượng mẫu mã (Product + Size) đang "Sắp hết hàng" (<= 5)
        // Chỉ tính các sản phẩm đang bán (status = 1)
        const [lowStockCountRes] = await conn.query(`
            SELECT COUNT(*) as count 
            FROM ProductSizes ps
            JOIN Products p ON ps.productId = p.id
            WHERE ps.quantity <= 5 AND p.status = 1
        `);
        const lowStockCount = (lowStockCountRes as any)[0].count;

        // 3. Lấy danh sách chi tiết các sản phẩm sắp hết hàng để hiển thị lên bảng
        // Giả định bảng Sizes có cột 'name' (S, M, L...) và Categories có cột 'name'
        const [lowStockList] = await conn.query(`
            SELECT 
                p.id,
                p.name as productName,
                p.price,
                s.sizeName,
                c.name as categoryName,
                ps.quantity,
                pi.imageUrl
            FROM ProductSizes ps
            JOIN Products p ON ps.productId = p.id
            JOIN Sizes s ON ps.sizeId = s.id
            JOIN productimages pi on p.id = pi.productId AND pi.isMain = 1    
            LEFT JOIN Categories c ON p.categoryId = c.id
            WHERE ps.quantity <= 5 AND p.status = 1
            ORDER BY ps.quantity ASC -- Ưu tiên hiển thị cái nào còn 0 lên đầu
            LIMIT 5 -- Chỉ lấy 5 cái hiển thị ở dashboard
        `);

        return NextResponse.json({
            totalProducts,
            lowStockCount,
            lowStockProducts: lowStockList
        });

    } catch (error: any) {
        console.error("Dashboard Inventory Error:", error);
        return NextResponse.json({ error: "Lỗi lấy dữ liệu kho" }, { status: 500 });
    } finally {
        conn.release();
    }
}