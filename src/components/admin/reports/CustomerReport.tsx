"use client";
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Users, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';

interface DateRange {
  from: string;
  to: string;
}

export default function CustomerReport({ dateRange }: { dateRange: DateRange }) {
  const [customerStats, setCustomerStats] = useState({ total: 0, new: 0, returning: 0, avgOrderValue: 0 });
  const [customerSegments, setCustomerSegments] = useState<any[]>([]);
  const [customerGrowth, setCustomerGrowth] = useState<any[]>([]);
  const [ageDistribution, setAgeDistribution] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(
          `/api/reports/customer?from=${dateRange.from}&to=${dateRange.to}`
        );
        const data = await response.json();
        if (data.success) {
          setCustomerStats(data.data.customerStats);
          setCustomerSegments(data.data.segments || []);
          setCustomerGrowth(data.data.growth || []);
          setAgeDistribution(data.data.ageDistribution || []);
          setTopCustomers(data.data.topCustomers || []);
        }
      } catch (error) {
        console.error('Failed to fetch customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [dateRange]);

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(1)}M`;
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP': return 'bg-red-100 text-red-800';
      case 'Thân thiết': return 'bg-orange-100 text-orange-800';
      case 'Thường xuyên': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-gray-900 mb-6">Báo cáo Khách hàng</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} className="text-blue-600" />
            <p className="text-blue-600 text-sm">Tổng khách hàng</p>
          </div>
          <p className="text-blue-900">{customerStats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={24} className="text-green-600" />
            <p className="text-green-600 text-sm">Khách hàng mới</p>
          </div>
          <p className="text-green-900">{customerStats.new}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag size={24} className="text-purple-600" />
            <p className="text-purple-600 text-sm">Khách quay lại</p>
          </div>
          <p className="text-purple-900">{customerStats.returning}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={24} className="text-orange-600" />
            <p className="text-orange-600 text-sm">Giá trị TB/đơn</p>
          </div>
          <p className="text-orange-900">{formatCurrency(customerStats.avgOrderValue)} ₫</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Customer Segments */}
        <div>
          <h3 className="text-gray-900 mb-4">Phân khúc khách hàng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent || 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {customerSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Số lượng']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div>
          <h3 className="text-gray-900 mb-4">Phân bố độ tuổi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="age" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip 
                formatter={(value: number) => [value, 'Số khách hàng']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Growth */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Tăng trưởng khách hàng theo tháng</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={customerGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" style={{ fontSize: '12px' }} />
            <YAxis style={{ fontSize: '12px' }} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                return [value, name === 'khachMoi' ? 'Khách mới' : 'Khách quay lại'];
              }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend formatter={(value) => value === 'khachMoi' ? 'Khách mới' : 'Khách quay lại'} />
            <Line type="monotone" dataKey="khachMoi" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="khachQuayLai" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Customers Table */}
      <div>
        <h3 className="text-gray-900 mb-4">Top 5 khách hàng chi tiêu nhiều nhất</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">STT</th>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">Tên khách hàng</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Số đơn hàng</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Tổng chi tiêu</th>
                <th className="text-center py-3 px-4 text-gray-600 text-sm">Phân khúc</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{index + 1}</td>
                  <td className="py-3 px-4 text-sm">{customer.name}</td>
                  <td className="py-3 px-4 text-sm text-right">{customer.orders}</td>
                  <td className="py-3 px-4 text-sm text-right">{formatCurrency(customer.totalSpent)} ₫</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${getSegmentColor(customer.segment)}`}>
                      {customer.segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
