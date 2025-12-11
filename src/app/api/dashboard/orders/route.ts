import { NextResponse } from "next/server";
import pool from "../../../../lib/db";


export async function GET() {
    const conn = await pool.getConnection();
    try {
        // 1. Tính tổng doanh thu
        // Lưu ý: Thực tế bạn nên WHERE statusId != [ID_Huy] để không tính đơn hủy
        const [revenueRes] = await conn.query(
            "SELECT SUM(cost) as totalRevenue FROM orders WHERE statusId != 4"
        );
        const totalRevenue = (revenueRes as any)[0].totalRevenue || 0;

        // 2. Đếm đơn hàng mới trong ngày hôm nay (CURDATE)
        const [todayOrdersRes] = await conn.query(
            "SELECT COUNT(*) as count FROM Orders WHERE DATE(createdDate) = CURDATE()"
        );
        const todayOrdersCount = (todayOrdersRes as any)[0].count;

        // 3. Lấy 5 đơn hàng mới nhất
        // JOIN với bảng Customers để lấy tên khách
        // Giả định bảng Customers có cột 'name' (hoặc 'fullName')
        const [recentOrders] = await conn.query(`
      SELECT 
        o.id,
        o.createdDate,
        o.cost,
        o.statusId,
        c.fullName as customerName
      FROM Orders o
      LEFT JOIN customers c ON o.customerId = c.id
      ORDER BY o.cost DESC
      LIMIT 5
    `);

        return NextResponse.json({
            revenue: totalRevenue,
            todayOrders: todayOrdersCount,
            recentOrders: recentOrders
        });

    } catch (error: any) {
        console.error("Dashboard Orders Error:", error);
        return NextResponse.json({ error: "Lỗi lấy dữ liệu đơn hàng" }, { status: 500 });
    } finally {
        conn.release();
    }
}