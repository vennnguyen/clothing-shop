'use client';
import { useState, useEffect } from 'react';
import { Download, Filter, Eye, Calendar } from 'lucide-react';
import RevenueReport from '../../../components/admin/reports/RevenueReport';
import EmployeePerformanceReport from '../../../components/admin/reports/EmployeePerformanceReport';
import CustomerReport from '../../../components/admin/reports/CustomerReport';
import ProductReport from '../../../components/admin/reports/ProductReport';
import OrderReport from '../../../components/admin/reports/OrderReport';

interface User {
  id?: number;
  name?: string;
  role?: string;
}

export default function Reports() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedReport, setSelectedReport] = useState('customer');
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const normalizedRole = data.role?.toLowerCase();
          setUser({ ...data, role: normalizedRole });
          setSelectedReport(normalizedRole === 'admin' ? 'revenue' : 'customer');
        }
      } catch (error) {
        console.error('Không lấy được user:', error);
      }
    };
    fetchUser();
  }, []);
  // Danh sách báo cáo dựa trên roleId
  // roleId = 1 (Admin): xem tất cả báo cáo
  // roleId = 2 (Staff): chỉ xem khách hàng, sản phẩm, đơn hàng
  const reportTypes = user?.role === 'admin'
    ? [
      { id: 'revenue', name: 'Báo cáo doanh thu' },
      { id: 'employee', name: 'Báo cáo hiệu suất nhân viên' },
      { id: 'customer', name: 'Báo cáo khách hàng' },
      { id: 'product', name: 'Báo cáo sản phẩm' },
      { id: 'order', name: 'Báo cáo đơn hàng' },
    ]
    : [
      // Staff (roleId = 2): chỉ được xem khách hàng, sản phẩm, đơn hàng
      { id: 'customer', name: 'Báo cáo khách hàng' },
      { id: 'product', name: 'Báo cáo sản phẩm' },
      { id: 'order', name: 'Báo cáo đơn hàng' },
    ];

  // If user prop later changes, ensure non-admins don't see revenue by default
  useEffect(() => {
    if (user && user.role !== 'admin' && selectedReport === 'revenue') {
      setSelectedReport('customer');
    }
    if (user && user.role !== 'admin' && selectedReport === 'employee') {
      setSelectedReport('customer');
    }
  }, [user?.role, selectedReport]);

  const handleExportReport = (format: string) => {
    alert(`Đang xuất báo cáo dạng ${format.toUpperCase()}...`);
    // Logic xuất báo cáo sẽ được implement ở đây
  };

  const renderReport = () => {
    switch (selectedReport) {
      case 'revenue':
        return <RevenueReport dateRange={dateRange} />;
      case 'employee':
        return <EmployeePerformanceReport dateRange={dateRange} />;
      case 'customer':
        return <CustomerReport dateRange={dateRange} />;
      case 'product':
        return <ProductReport dateRange={dateRange} />;
      case 'order':
        return <OrderReport dateRange={dateRange} />;
      default:
        return <RevenueReport dateRange={dateRange} />;
    }
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-5 flex items-center gap-2">BÁO CÁO & THỐNG KÊ</h1>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Report Type Selection */}
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-gray-600" />
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Calendar size={18} />
              <span>Khoảng thời gian</span>
            </button>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-600">đến</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Export Buttons */}
          {user?.role === 'admin' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportReport('pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Download size={18} />
                <span>Xuất PDF</span>
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download size={18} />
                <span>Xuất Excel</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-y-auto max-h-[470px]">
          {renderReport()}
        </div>
      </div>
    </div>
  );
}
