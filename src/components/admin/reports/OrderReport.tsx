"use client";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ShoppingCart, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

interface DateRange {
  from: string;
  to: string;
}

export default function OrderReport({ dateRange }: { dateRange: DateRange }) {
  const [orderStats, setOrderStats] = useState({ total: 0, completed: 0, processing: 0, cancelled: 0, avgValue: 0 });
  const [statusDist, setStatusDist] = useState<any[]>([]);
  const [monthlyOrders, setMonthlyOrders] = useState<any[]>([]);
  const [ordersByTime, setOrdersByTime] = useState<any[]>([]);
  const [topOrders, setTopOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(
          `/api/reports/order?from=${dateRange.from}&to=${dateRange.to}`
        );
        const data = await response.json();
        if (data.success) {
          setOrderStats(data.data.orderStats);
          setStatusDist(data.data.statusDistribution || []);
          setMonthlyOrders(data.data.monthlyOrders || []);
          setOrdersByTime(data.data.ordersByTime || []);
          setTopOrders(data.data.topOrders || []);
        }
      } catch (error) {
        console.error('Failed to fetch order data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [dateRange]);

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(0)}M`;
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'Hoàn thành', color: 'bg-green-100 text-green-800' };
      case 'processing':
        return { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' };
      case 'cancelled':
        return { text: 'Đã hủy', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Không rõ', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  const colorMap: { [key: string]: string } = {
    'Hoàn thành': '#10b981',
    'Đang xử lý': '#3b82f6',
    'Đã hủy': '#ef4444'
  };

  return (
    <div className="p-6">
      <h2 className="text-gray-900 mb-6">Báo cáo Đơn hàng</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart size={24} className="text-blue-600" />
            <p className="text-blue-600 text-sm">Tổng đơn hàng</p>
          </div>
          <p className="text-blue-900">{orderStats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={24} className="text-green-600" />
            <p className="text-green-600 text-sm">Hoàn thành</p>
          </div>
          <p className="text-green-900">{orderStats.completed}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={24} className="text-orange-600" />
            <p className="text-orange-600 text-sm">Đang xử lý</p>
          </div>
          <p className="text-orange-900">{orderStats.processing}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={24} className="text-red-600" />
            <p className="text-red-600 text-sm">Đã hủy</p>
          </div>
          <p className="text-red-900">{orderStats.cancelled}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={24} className="text-purple-600" />
            <p className="text-purple-600 text-sm">Giá trị TB</p>
          </div>
          <p className="text-purple-900">{formatCurrency(orderStats.avgValue)} ₫</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Distribution */}
        <div>
          <h3 className="text-gray-900 mb-4">Phân bố trạng thái đơn hàng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDist}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent || 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorMap[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Đơn hàng']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Time */}
        <div>
          <h3 className="text-gray-900 mb-4">Đơn hàng theo khung giờ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip 
                formatter={(value: number) => [value, 'Đơn hàng']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="orders" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Orders Trend */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Xu hướng đơn hàng theo tháng</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyOrders}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency} style={{ fontSize: '12px' }} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'revenue') return [formatCurrency(value) + ' ₫', 'Doanh thu'];
                if (name === 'completed') return [value, 'Hoàn thành'];
                return [value, 'Đã hủy'];
              }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend formatter={(value) => {
              if (value === 'completed') return 'Đơn hoàn thành';
              if (value === 'cancelled') return 'Đơn hủy';
              return 'Doanh thu';
            }} />
            <Line yAxisId="left" type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Value Orders */}
      <div>
        <h3 className="text-gray-900 mb-4">Top 5 đơn hàng có giá trị cao nhất</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">Mã đơn</th>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">Khách hàng</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Giá trị</th>
                <th className="text-center py-3 px-4 text-gray-600 text-sm">Trạng thái</th>
                <th className="text-center py-3 px-4 text-gray-600 text-sm">Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {topOrders.map((order, index) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.customer}</td>
                    <td className="py-3 px-4 text-sm text-right">{formatCurrency(order.value)} ₫</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-center">{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
