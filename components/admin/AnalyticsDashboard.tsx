"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import ChartsContainer from "./ChartsContainer";

interface OverviewData {
  vouchers: {
    total: number;
    active: number;
    expired: number;
    used: number;
    topUsed: { voucherId: string; _count: number }[];
  };
  bookings: {
    total: number;
    paid: number;
    unpaid: number;
    revenue: number;
    topProperties: { propertyId: string; _count: number }[];
  };
  users: {
    total: number;
    guests: number;
    topUsers: { profileId: string; _count: number }[];
  };
}

interface RevenueByMonth {
  month: string;
  revenue: number;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueByMonth, setRevenueByMonth] = useState<RevenueByMonth[]>([]);

  useEffect(() => {
    fetch("/api/overview")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });

    fetch("/api/revenue-by-month")
      .then((res) => res.json())
      .then((json) => setRevenueByMonth(json));
  }, []);

  const chartData = data?.vouchers.topUsed.map((v, idx) => ({
    name: `Voucher ${idx + 1}`,
    used: v._count,
  })) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📊 Thống kê toàn hệ thống</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải dữ liệu...
        </div>
      ) : data ? (
        <>
          {/* Tổng quan */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Tổng booking" value={data.bookings.total} />
            <StatCard label="Đã thanh toán" value={data.bookings.paid} />
            <StatCard label="Doanh thu (VNĐ)" value={data.bookings.revenue.toLocaleString()} />
            <StatCard label="Người dùng" value={data.users.total} />
          </div>

          {/* Voucher */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Tổng voucher" value={data.vouchers.total} />
            <StatCard label="Đang hiệu lực" value={data.vouchers.active} />
            <StatCard label="Hết hạn" value={data.vouchers.expired} />
            <StatCard label="Lượt sử dụng" value={data.vouchers.used} />
          </div>

          {/* Biểu đồ: Top voucher được sử dụng */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">🏆 Top voucher được sử dụng</h2>
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="used" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ: Doanh thu theo tháng */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">💰 Doanh thu theo tháng</h2>
            <div className="bg-white p-4 rounded-xl border shadow-sm">
             <ChartsContainer/>
            </div>
          </div>
        </>
      ) : (
        <div className="text-red-500">Lỗi khi tải dữ liệu phân tích.</div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white border shadow-sm rounded-xl p-4 text-center">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-2xl font-bold text-blue-600">{value}</div>
    </div>
  );
}
