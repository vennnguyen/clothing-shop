import { NextRequest, NextResponse } from 'next/server';
import pool from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get('from') || '2024-01-01';
    const toDate = searchParams.get('to') || '2024-12-31';

    const connection = await pool.getConnection();

    // 1. Product statistics
    const [productStats]: any = await connection.query(
      `SELECT 
        COUNT(DISTINCT id) as totalProducts,
        SUM(CASE WHEN EXISTS (SELECT 1 FROM ProductSizes ps WHERE ps.productId = p.id AND ps.quantity > 0) THEN 1 ELSE 0 END) as inStock,
        SUM(CASE WHEN EXISTS (SELECT 1 FROM ProductSizes ps WHERE ps.productId = p.id AND ps.quantity BETWEEN 1 AND 5) THEN 1 ELSE 0 END) as lowStock,
        SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM ProductSizes ps WHERE ps.productId = p.id AND ps.quantity > 0) THEN 1 ELSE 0 END) as outOfStock
      FROM Products p`
    );

    // 2. Top selling products
    const [topProducts]: any = await connection.query(
      `SELECT 
        p.name,
        SUM(od.quantity) as sold,
        SUM(od.price * od.quantity) as revenue,
        COALESCE(ps.quantity, 0) as stock,
        CASE 
          WHEN COALESCE(ps.quantity, 0) = 0 THEN 'out-of-stock'
          WHEN COALESCE(ps.quantity, 0) <= 5 THEN 'low-stock'
          ELSE 'in-stock'
        END as status
      FROM Products p
      JOIN OrderDetails od ON p.id = od.productId
      JOIN Orders o ON od.orderId = o.id
      LEFT JOIN ProductSizes ps ON p.id = ps.productId
      WHERE o.createdDate BETWEEN ? AND ? AND o.statusId != 4
      GROUP BY p.id, p.name
      ORDER BY sold DESC
      LIMIT 5`,
      [fromDate, toDate]
    );

    // 3. Category performance
    const [categoryPerf]: any = await connection.query(
      `SELECT 
        c.name as category,
        COUNT(DISTINCT p.id) as products,
        SUM(od.quantity) as sold,
        SUM(od.price * od.quantity) as revenue
      FROM Categories c
      LEFT JOIN Products p ON c.id = p.categoryId
      LEFT JOIN OrderDetails od ON p.id = od.productId
      LEFT JOIN Orders o ON od.orderId = o.id AND o.createdDate BETWEEN ? AND ? AND o.statusId != 4
      GROUP BY c.id, c.name
      ORDER BY revenue DESC`,
      [fromDate, toDate]
    );

    // 4. Inventory status pie
    const [inventoryStatus]: any = await connection.query(
      `SELECT 
        'Còn hàng' as name,
        COUNT(DISTINCT p.id) as value
      FROM Products p
      WHERE EXISTS (SELECT 1 FROM ProductSizes ps WHERE ps.productId = p.id AND ps.quantity > 0)
      UNION ALL
      SELECT 
        'Sắp hết' as name,
        COUNT(DISTINCT p.id) as value
      FROM Products p
      WHERE EXISTS (SELECT 1 FROM ProductSizes ps WHERE ps.productId = p.id AND ps.quantity BETWEEN 1 AND 5)
      UNION ALL
      SELECT 
        'Hết hàng' as name,
        COUNT(DISTINCT p.id) as value
      FROM Products p
      WHERE NOT EXISTS (SELECT 1 FROM ProductSizes ps WHERE ps.productId = p.id AND ps.quantity > 0)`
    );

    // 5. Monthly trend
    const [monthlyTrend]: any = await connection.query(
      `SELECT 
        DATE_FORMAT(o.createdDate, '%m') as month,
        COUNT(DISTINCT p.id) as sanPham,
        SUM(od.price * od.quantity) as doanhThu
      FROM Orders o
      JOIN OrderDetails od ON o.id = od.orderId
      JOIN Products p ON od.productId = p.id
      WHERE o.createdDate BETWEEN ? AND ? AND o.statusId != 4
      GROUP BY MONTH(o.createdDate)
      ORDER BY MONTH(o.createdDate)`,
      [fromDate, toDate]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      data: {
        productStats: productStats[0] || {
          totalProducts: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
        },
        topProducts,
        categoryPerformance: categoryPerf,
        inventoryStatus,
        monthlyTrend,
      },
    });
  } catch (error) {
    console.error('Product report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product report' },
      { status: 500 }
    );
  }
}
