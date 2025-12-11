import { NextRequest, NextResponse } from 'next/server';
import pool from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get('from') || '2024-01-01';
    const toDate = searchParams.get('to') || '2024-12-31';

    const connection = await pool.getConnection();

    // 1. Monthly revenue aggregation
    const [monthlyData]: any = await connection.query(
      `SELECT 
        DATE_FORMAT(o.createdDate, '%m') as month,
        SUM(o.cost) as doanhThu,
        COUNT(DISTINCT o.id) as donHang
      FROM Orders o
      WHERE o.createdDate BETWEEN ? AND ? AND o.statusId != 4
      GROUP BY MONTH(o.createdDate)
      ORDER BY MONTH(o.createdDate)`,
      [fromDate, toDate]
    );

    // 2. Revenue by category
    const [categoryRevenue]: any = await connection.query(
      `SELECT 
        c.name,
        SUM(od.price * od.quantity) as value,
        ROUND(SUM(od.price * od.quantity) / (SELECT SUM(o.cost) FROM Orders o WHERE o.createdDate BETWEEN ? AND ? AND o.statusId != 4) * 100, 1) as percent
      FROM Orders o
      JOIN OrderDetails od ON o.id = od.orderId
      JOIN Products p ON od.productId = p.id
      JOIN Categories c ON p.categoryId = c.id
      WHERE o.createdDate BETWEEN ? AND ? AND o.statusId != 4
      GROUP BY c.id, c.name
      ORDER BY value DESC`,
      [fromDate, toDate, fromDate, toDate]
    );

    // 3. Summary statistics
    const [summaryData]: any = await connection.query(
      `SELECT 
        SUM(o.cost) as totalRevenue,
        COUNT(DISTINCT o.id) as totalOrders,
        AVG(o.cost) as avgOrderValue
      FROM Orders o
      WHERE o.createdDate BETWEEN ? AND ? AND o.statusId != 4`,
      [fromDate, toDate]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      data: {
        monthlyRevenue: monthlyData,
        revenueByCategory: categoryRevenue,
        summary: summaryData[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
        },
      },
    });
  } catch (error) {
    console.error('Revenue report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revenue report' },
      { status: 500 }
    );
  }
}
