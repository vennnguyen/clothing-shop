import { NextRequest, NextResponse } from 'next/server';
import pool from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get('from') || '2024-01-01';
    const toDate = searchParams.get('to') || '2024-12-31';

    const connection = await pool.getConnection();

    // 1. Order statistics
    const [orderStats]: any = await connection.query(
      `SELECT 
        COUNT(DISTINCT id) as total,
        SUM(CASE WHEN statusId = 3 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN statusId IN (1, 2) THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN statusId = 4 THEN 1 ELSE 0 END) as cancelled,
        AVG(cost) as avgValue
      FROM Orders
      WHERE createdDate BETWEEN ? AND ?`,
      [fromDate, toDate]
    );

    // 2. Order status distribution
    const [statusDistribution]: any = await connection.query(
      `SELECT 
        CASE 
          WHEN statusId = 3 THEN 'Hoàn thành'
          WHEN statusId IN (1, 2) THEN 'Đang xử lý'
          WHEN statusId = 4 THEN 'Đã hủy'
          ELSE 'Khác'
        END as name,
        COUNT(*) as value,
        ROUND(COUNT(*) / (SELECT COUNT(*) FROM Orders WHERE createdDate BETWEEN ? AND ?) * 100, 1) as percent
      FROM Orders
      WHERE createdDate BETWEEN ? AND ?
      GROUP BY statusId`,
      [fromDate, toDate, fromDate, toDate]
    );

    // 3. Monthly orders trend
    const [monthlyOrders]: any = await connection.query(
      `SELECT 
        DATE_FORMAT(createdDate, '%m') as month,
        SUM(CASE WHEN statusId = 3 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN statusId = 4 THEN 1 ELSE 0 END) as cancelled,
        SUM(cost) as revenue
      FROM Orders
      WHERE createdDate BETWEEN ? AND ?
      GROUP BY MONTH(createdDate)
      ORDER BY MONTH(createdDate)`,
      [fromDate, toDate]
    );

    // 4. Orders by time of day
    const [ordersByTime]: any = await connection.query(
      `SELECT 
        CASE 
          WHEN HOUR(createdDate) BETWEEN 0 AND 5 THEN '0-6h'
          WHEN HOUR(createdDate) BETWEEN 6 AND 8 THEN '6-9h'
          WHEN HOUR(createdDate) BETWEEN 9 AND 11 THEN '9-12h'
          WHEN HOUR(createdDate) BETWEEN 12 AND 14 THEN '12-15h'
          WHEN HOUR(createdDate) BETWEEN 15 AND 17 THEN '15-18h'
          WHEN HOUR(createdDate) BETWEEN 18 AND 20 THEN '18-21h'
          ELSE '21-24h'
        END as time,
        COUNT(*) as orders
      FROM Orders
      WHERE createdDate BETWEEN ? AND ?
      GROUP BY HOUR(createdDate)
      ORDER BY time`,
      [fromDate, toDate]
    );

    // 5. Top orders by value
    const [topOrders]: any = await connection.query(
      `SELECT 
        CONCAT('#ĐH-', o.id) as id,
        c.fullName as customer,
        o.cost as value,
        CASE 
          WHEN o.statusId = 3 THEN 'completed'
          WHEN o.statusId IN (1, 2) THEN 'processing'
          ELSE 'cancelled'
        END as status,
        DATE_FORMAT(o.createdDate, '%d/%m/%Y') as date
      FROM Orders o
      JOIN Customers c ON o.customerId = c.id
      WHERE o.createdDate BETWEEN ? AND ?
      ORDER BY o.cost DESC
      LIMIT 5`,
      [fromDate, toDate]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      data: {
        orderStats: orderStats[0] || {
          total: 0,
          completed: 0,
          processing: 0,
          cancelled: 0,
          avgValue: 0,
        },
        statusDistribution,
        monthlyOrders,
        ordersByTime,
        topOrders,
      },
    });
  } catch (error) {
    console.error('Order report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order report' },
      { status: 500 }
    );
  }
}
