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

interface ReportsProps {
  user?: User;
}

export default function Reports({ user }: ReportsProps) {
  // Provide a safe fallback when no API/user is available (local dev)
  const currentUser: User = user ?? { id: 0, name: 'Local', role: 'admin' };

  const [selectedReport, setSelectedReport] = useState(() => (
    currentUser.role === 'admin' ? 'revenue' : 'customer'
  ));
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Danh sách báo cáo dựa trên role
  const reportTypes = currentUser.role === 'admin' 
    ? [
        { id: 'revenue', name: 'Báo cáo doanh thu', icon: '💰' },
        { id: 'employee', name: 'Báo cáo hiệu suất nhân viên', icon: '👥' },
        { id: 'customer', name: 'Báo cáo khách hàng', icon: '👤' },
        { id: 'product', name: 'Báo cáo sản phẩm', icon: '📦' },
        { id: 'order', name: 'Báo cáo đơn hàng', icon: '📋' },
      ]
    : [
        { id: 'customer', name: 'Báo cáo khách hàng', icon: '👤' },
        { id: 'product', name: 'Báo cáo sản phẩm', icon: '📦' },
        { id: 'order', name: 'Báo cáo đơn hàng', icon: '📋' },
      ];

  // If user prop later changes, ensure non-admins don't see revenue by default
  useEffect(() => {
    if (currentUser.role !== 'admin' && selectedReport === 'revenue') {
      setSelectedReport('customer');
    }
  }, [currentUser.role, selectedReport]);

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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Báo cáo & Thống kê</h1>
        {/* <p className="text-gray-600">
          Xem và phân tích các báo cáo chi tiết của hệ thống
          {currentUser.role === 'admin' && ' - Quyền Admin: Xem tất cả báo cáo'}
          {currentUser.role === 'employee' && ' - Quyền Nhân viên: Xem báo cáo hạn chế'}
        </p> */}
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
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
                  {report.icon} {report.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Calendar size={18} />
              <span>Khoảng thời gian</span>
            </button>
            
            {isFilterOpen && (
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
            )}
          </div>

          {/* Export Buttons */}
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
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-md">
        {renderReport()}
      </div>
    </div>
  );
}
