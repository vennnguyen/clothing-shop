"use client";
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DateRange {
  from: string;
  to: string;
}

export default function RevenueReport({ dateRange }: { dateRange: DateRange }) {
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalOrders: 0, totalCost: 0, profitMargin: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch(
          `/api/reports/revenue?from=${dateRange.from}&to=${dateRange.to}`
        );
        const data = await response.json();
        if (data.success) {
          const formatted = data.data.monthlyRevenue.map((item: any) => ({
            month: `T${item.month}`,
            doanhThu: item.doanhThu || 0,
            chiPhi: Math.round((item.doanhThu || 0) * 0.6),
            loiNhuan: Math.round((item.doanhThu || 0) * 0.4),
          }));
          setMonthlyRevenue(formatted);
          setRevenueByCategory(data.data.revenueByCategory || []);
          
          const stats = data.data.summary;
          const profit = (stats.totalRevenue || 0) - ((stats.totalRevenue || 0) * 0.6);
          setSummary({
            totalRevenue: stats.totalRevenue || 0,
            totalOrders: stats.totalOrders || 0,
            totalCost: (stats.totalRevenue || 0) * 0.6,
            profitMargin: stats.totalRevenue ? (profit / stats.totalRevenue * 100) : 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [dateRange]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(0)}M`;
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  const totalRevenue = summary.totalRevenue;
  const totalProfit = summary.totalRevenue - summary.totalCost;
  const totalCost = summary.totalCost;
  const profitMargin = summary.profitMargin.toFixed(1);

  return (
    <div className="p-6">
      <h2 className="text-gray-900 mb-6">Báo cáo Doanh thu</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm mb-1">Tổng doanh thu</p>
          <p className="text-blue-900">{formatCurrency(totalRevenue)} ₫</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-600 text-sm mb-1">Tổng lợi nhuận</p>
          <p className="text-green-900">{formatCurrency(totalProfit)} ₫</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm mb-1">Tổng chi phí</p>
          <p className="text-red-900">{formatCurrency(totalCost)} ₫</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-600 text-sm mb-1">Tỷ suất lợi nhuận</p>
          <p className="text-purple-900">{profitMargin}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue & Profit Chart */}
        <div>
          <h3 className="text-gray-900 mb-4">Doanh thu & Lợi nhuận theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" style={{ fontSize: '12px' }} />
              <YAxis tickFormatter={formatCurrency} style={{ fontSize: '12px' }} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const labels: { [key: string]: string } = {
                    doanhThu: 'Doanh thu',
                    chiPhi: 'Chi phí',
                    loiNhuan: 'Lợi nhuận'
                  };
                  return [formatCurrency(value) + ' ₫', labels[name] || name];
                }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend formatter={(value) => {
                const labels: { [key: string]: string } = {
                  doanhThu: 'Doanh thu',
                  chiPhi: 'Chi phí',
                  loiNhuan: 'Lợi nhuận'
                };
                return labels[value] || value;
              }} />
              <Bar dataKey="doanhThu" fill="#3b82f6" />
              <Bar dataKey="loiNhuan" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div>
          <h3 className="text-gray-900 mb-4">Doanh thu theo danh mục</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent || 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value) + ' ₫'}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div>
        <h3 className="text-gray-900 mb-4">Chi tiết doanh thu theo tháng</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">Tháng</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Doanh thu</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Chi phí</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Lợi nhuận</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Tỷ suất LN</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRevenue.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{item.month}/2024</td>
                  <td className="py-3 px-4 text-sm text-right">{formatCurrency(item.doanhThu)} ₫</td>
                  <td className="py-3 px-4 text-sm text-right">{formatCurrency(item.chiPhi)} ₫</td>
                  <td className="py-3 px-4 text-sm text-right text-green-600">{formatCurrency(item.loiNhuan)} ₫</td>
                  <td className="py-3 px-4 text-sm text-right">{((item.loiNhuan / item.doanhThu) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
