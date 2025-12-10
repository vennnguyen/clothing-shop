"use client";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award } from 'lucide-react';

interface DateRange {
  from: string;
  to: string;
}

export default function EmployeePerformanceReport({ dateRange }: { dateRange: DateRange }) {
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(
          `/api/reports/employee?from=${dateRange.from}&to=${dateRange.to}`
        );
        const data = await response.json();
        if (data.success) {
          setEmployeeData(data.data.employeePerformance || []);
          setRadarData(data.data.radarData || []);
        }
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [dateRange]);

  const topPerformer = employeeData.length > 0 ? employeeData[0] : null;

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(0)}M`;
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-gray-900 mb-6">Báo cáo Hiệu suất Nhân viên</h2>
      
      {/* Top Performer Highlight */}
      {topPerformer && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 p-4 rounded-full">
              <Award size={32} className="text-yellow-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">Nhân viên xuất sắc nhất kỳ</h3>
              <p className="text-gray-700 mb-2">{topPerformer.name}</p>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Đơn hàng</p>
                  <p className="text-gray-900">{topPerformer.orders}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Doanh thu</p>
                  <p className="text-gray-900">{formatCurrency(topPerformer.revenue)} ₫</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Đánh giá KH</p>
                  <p className="text-gray-900">{topPerformer.customerSatisfaction || 4.8}/5.0</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Hiệu suất</p>
                  <p className="text-gray-900">{topPerformer.efficiency || 92}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Comparison */}
        <div>
          <h3 className="text-gray-900 mb-4">So sánh doanh thu nhân viên</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                style={{ fontSize: '11px' }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis tickFormatter={formatCurrency} style={{ fontSize: '12px' }} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value) + ' ₫', 'Doanh thu']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Radar */}
        <div>
          <h3 className="text-gray-900 mb-4">Phân tích hiệu suất tổng hợp</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" style={{ fontSize: '11px' }} />
              <PolarRadiusAxis style={{ fontSize: '10px' }} />
              <Radar name="Nhân viên 1" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
              <Radar name="Nhân viên 2" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div>
        <h3 className="text-gray-900 mb-4">Bảng chi tiết hiệu suất nhân viên</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">Xếp hạng</th>
                <th className="text-left py-3 px-4 text-gray-600 text-sm">Nhân viên</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Đơn hàng</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Doanh thu</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Đánh giá KH</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Thời gian phản hồi (h)</th>
                <th className="text-right py-3 px-4 text-gray-600 text-sm">Hiệu suất</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm
                      ${employee.rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                        employee.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        employee.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-50 text-gray-600'}`}>
                      {employee.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{employee.name}</td>
                  <td className="py-3 px-4 text-sm text-right">{employee.orders}</td>
                  <td className="py-3 px-4 text-sm text-right">{formatCurrency(employee.revenue)} ₫</td>
                  <td className="py-3 px-4 text-sm text-right">
                    <span className="text-yellow-600">★</span> {employee.customerSatisfaction || 4.8}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">{employee.responseTime || 2.5}</td>
                  <td className="py-3 px-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${employee.efficiency || 92}%` }}
                        ></div>
                      </div>
                      <span>{employee.efficiency || 92}%</span>
                    </div>
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
