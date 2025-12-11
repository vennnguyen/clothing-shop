import { NextRequest, NextResponse } from 'next/server';
import pool from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get('from') || '2024-01-01';
    const toDate = searchParams.get('to') || '2024-12-31';

    const connection = await pool.getConnection();
    try {
      // 1. Customer statistics (use explicit aliases to avoid reserved words)
      const [customerStats]: any = await connection.query(
        `SELECT 
          COUNT(DISTINCT id) as total,
          COUNT(DISTINCT IF(createdDate BETWEEN ? AND ?, id, NULL)) as newCount,
          COUNT(DISTINCT IF(createdDate < ?, id, NULL)) as returningCount,
          (SELECT AVG(cost) FROM Orders WHERE createdDate BETWEEN ? AND ? AND statusId != 4) as avgOrderValue
        FROM Customers
        WHERE createdDate <= ?`,
        [fromDate, toDate, fromDate, fromDate, toDate, toDate]
      );

      // 2. Customer segments (RFM analysis)
      const [segmentsRaw]: any = await connection.query(
        `SELECT 
          CASE 
            WHEN totalSpent > 80000000 THEN 'VIP'
            WHEN totalSpent > 40000000 THEN 'Thân thiết'
            WHEN orderCount >= 5 THEN 'Thường xuyên'
            ELSE 'Mới'
          END as segment,
          COUNT(*) as count,
          ROUND(COUNT(*) / (SELECT COUNT(*) FROM Customers) * 100, 1) as percent
        FROM (
          SELECT 
            c.id,
            COALESCE(SUM(o.cost), 0) as totalSpent,
            COALESCE(COUNT(o.id), 0) as orderCount
          FROM Customers c
          LEFT JOIN Orders o ON c.id = o.customerId AND o.createdDate BETWEEN ? AND ?
          GROUP BY c.id
        ) as customer_data
        GROUP BY segment`,
        [fromDate, toDate]
      );

      // normalize segment shape for frontend PieChart: { name, value, percent }
      const segments = Array.isArray(segmentsRaw) ? segmentsRaw.map((r: any) => ({
        name: r.segment,
        value: Number(r.count) || 0,
        percent: Number(r.percent) || 0,
      })) : [];

      // 3. Customer growth by month
      // We'll build a month-series between fromDate and toDate and query per-month counts
      const start = new Date(fromDate + 'T00:00:00');
      const end = new Date(toDate + 'T23:59:59');
      const months: { month: string; start: string; end: string }[] = [];
      const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cursor <= end) {
        const y = cursor.getFullYear();
        const m = cursor.getMonth() + 1;
        const mm = String(m).padStart(2, '0');
        const monthStart = `${y}-${mm}-01`;
        const monthEnd = new Date(y, m, 0); // last day of month
        const monthEndStr = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;
        months.push({ month: mm, start: monthStart, end: monthEndStr });
        cursor.setMonth(cursor.getMonth() + 1);
      }

      const growth: any[] = [];
      for (const mon of months) {
        // new customers created in this month
        const [[{ newCount }]]: any = await connection.query(
          `SELECT COUNT(*) as newCount FROM Customers WHERE createdDate BETWEEN ? AND ?`,
          [mon.start + ' 00:00:00', mon.end + ' 23:59:59']
        );

        // returning customers: customers who placed orders in this month but created before month start
        const [[{ returningCount }]]: any = await connection.query(
          `SELECT COUNT(DISTINCT o.customerId) as returningCount FROM Orders o JOIN Customers c ON o.customerId = c.id WHERE o.createdDate BETWEEN ? AND ? AND c.createdDate < ?`,
          [mon.start + ' 00:00:00', mon.end + ' 23:59:59', mon.start + ' 00:00:00']
        );

        growth.push({ month: mon.month, khachMoi: Number(newCount) || 0, khachQuayLai: Number(returningCount) || 0 });
      }

      // 4. Age distribution
      const [ageDistribution]: any = await connection.query(
        `SELECT 
          CASE 
            WHEN YEAR(CURDATE()) - YEAR(dateOfBirth) BETWEEN 18 AND 25 THEN '18-25'
            WHEN YEAR(CURDATE()) - YEAR(dateOfBirth) BETWEEN 26 AND 35 THEN '26-35'
            WHEN YEAR(CURDATE()) - YEAR(dateOfBirth) BETWEEN 36 AND 45 THEN '36-45'
            WHEN YEAR(CURDATE()) - YEAR(dateOfBirth) BETWEEN 46 AND 55 THEN '46-55'
            ELSE '56+'
          END as age,
          COUNT(*) as count
        FROM Customers
        WHERE dateOfBirth IS NOT NULL
        GROUP BY age
        ORDER BY age`
      );

      // 5. Top customers
      const [topCustomers]: any = await connection.query(
        `SELECT 
          c.fullName as name,
          COUNT(o.id) as orders,
          SUM(o.cost) as totalSpent,
          CASE 
            WHEN SUM(o.cost) > 80000000 THEN 'VIP'
            WHEN SUM(o.cost) > 40000000 THEN 'Thân thiết'
            ELSE 'Thường xuyên'
          END as segment
        FROM Customers c
        JOIN Orders o ON c.id = o.customerId
        WHERE o.createdDate BETWEEN ? AND ? AND o.statusId != 4
        GROUP BY c.id, c.fullName
        ORDER BY totalSpent DESC
        LIMIT 5`,
        [fromDate, toDate]
      );

      // return assembled result
      return NextResponse.json({
        success: true,
        data: {
          customerStats: (customerStats && customerStats[0]) ? {
            total: customerStats[0].total || 0,
            new: customerStats[0].newCount || 0,
            returning: customerStats[0].returningCount || 0,
            avgOrderValue: customerStats[0].avgOrderValue || 0,
          } : { total: 0, new: 0, returning: 0, avgOrderValue: 0 },
          segments,
          growth,
          ageDistribution,
          topCustomers,
        },
      });
    } finally {
      try { connection.release(); } catch (e) { /* ignore */ }
    }
  } catch (error) {
    console.error('Customer report error:', error && (error as any).stack ? (error as any).stack : error);
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch customer report: ${message}` },
      { status: 500 }
    );
  }
}
