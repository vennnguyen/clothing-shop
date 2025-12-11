"use client";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface DateRange {
  from: string;
  to: string;
}

export default function ProductReport({ dateRange }: { dateRange: DateRange }) {
  const [productStats, setProductStats] = useState({ totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryPerf, setCategoryPerf] = useState<any[]>([]);
  const [inventoryStatus, setInventoryStatus] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `/api/reports/product?from=${dateRange.from}&to=${dateRange.to}`
        );
        const data = await response.json();
        if (data.success) {
          setProductStats(data.data.productStats);
          setTopProducts(data.data.topProducts || []);
          setCategoryPerf(data.data.categoryPerformance || []);
          setInventoryStatus(data.data.inventoryStatus || []);
          setMonthlyTrend(data.data.monthlyTrend || []);
        }
      } catch (error) {
        console.error('Failed to fetch product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [dateRange]);

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(0)}M`;
  };

  const getStockStatus = (status: string) => {
    switch (status) {
      case 'in-stock':
        return { text: 'Còn hàng', color: 'bg-green-100 text-green-800' };
      case 'low-stock':
        return { text: 'Sắp hết', color: 'bg-yellow-100 text-yellow-800' };
      case 'out-of-stock':
        return { text: 'Hết hàng', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Không rõ', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-gray-900 mb-6">Báo cáo Sản phẩm</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Package size={24} className="text-blue-600" />
            <p className="text-blue-600 text-sm">Tổng sản phẩm</p>
          </div>
          <p className="text-blue-900">{productStats.totalProducts}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={24} className="text-green-600" />
            <p className="text-green-600 text-sm">Còn hàng</p>
          </div>
          <p className="text-green-900">{productStats.inStock}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={24} className="text-yellow-600" />
            <p className="text-yellow-600 text-sm">Sắp hết hàng</p>
          </div>
          <p className="text-yellow-900">{productStats.lowStock}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown size={24} className="text-red-600" />
            <p className="text-red-600 text-sm">Hết hàng</p>
          </div>
          <p className="text-red-900">{productStats.outOfStock}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Performance */}
        <div>
          <h3 className="text-gray-900 mb-4">Doanh thu theo danh mục</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerf} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={formatCurrency} style={{ fontSize: '11px' }} />
              <YAxis type="category" dataKey="category" style={{ fontSize: '11px' }} width={80} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value) + ' ₫', 'Doanh thu']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Status */}
        <div>
          <h3 className="text-gray-900 mb-4">Tình trạng tồn kho</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {inventoryStatus.map((entry, index) => {
                  const colorMap: { [key: string]: string } = {
                    'Còn hàng': '#10b981',
                    'Sắp hết': '#f59e0b',
                    'Hết hàng': '#ef4444'
                  };
                  return <Cell key={`cell-${index}`} fill={colorMap[entry.name] || '#8884d8'} />;
                })}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Sản phẩm']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Xu hướng sản phẩm & doanh thu</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency} style={{ fontSize: '12px' }} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'sanPham') return [value, 'Số lượng SP'];
                return [formatCurrency(value) + ' ₫', 'Doanh thu'];
              }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend formatter={(value) => value === 'sanPham' ? 'Số lượng sản phẩm' : 'Doanh thu'} />
            <Line yAxisId="left" type="monotone" dataKey="sanPham" stroke="#8b5cf6" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="doanhThu" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Products Table */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Top 5 sản phẩm bán chạy</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">STT</th>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">Tên sản phẩm</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Đã bán</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Doanh thu</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Tồn kho</th>
                <th className="text-center py-3 px-4 text-gray-600 text-sm">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.status);
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{index + 1}</td>
                    <td className="py-3 px-4 text-sm">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-right">{product.sold}</td>
                    <td className="py-3 px-4 text-sm text-right">{formatCurrency(product.revenue)} ₫</td>
                    <td className="py-3 px-4 text-sm text-right">{product.stock}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Details Table */}
      <div>
        <h3 className="text-gray-900 mb-4">Hiệu suất theo danh mục</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">Danh mục</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Số sản phẩm</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Đã bán</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Doanh thu</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">TB/Sản phẩm</th>
              </tr>
            </thead>
            <tbody>
              {categoryPerf.map((cat, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{cat.category}</td>
                  <td className="py-3 px-4 text-sm text-right">{cat.products}</td>
                  <td className="py-3 px-4 text-sm text-right">{cat.sold}</td>
                  <td className="py-3 px-4 text-sm text-right">{formatCurrency(cat.revenue)} ₫</td>
                  <td className="py-3 px-4 text-sm text-right">{formatCurrency(cat.revenue / (cat.products || 1))} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
