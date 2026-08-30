import { useEffect, useState } from "react";

import { Building2, DollarSign, TrendingUp, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

// Mock data for Line Chart
const customerGrowthData = [
  { name: "Thứ 2", customers: 400 },
  { name: "Thứ 3", customers: 300 },
  { name: "Thứ 4", customers: 550 },
  { name: "Thứ 5", customers: 450 },
  { name: "Thứ 6", customers: 700 },
  { name: "Thứ 7", customers: 1200 },
  { name: "CN", customers: 1500 },
];

export default function Page() {
  const [agentsStats, setAgentsStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ agents: 0, customers: 0, revenue: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const agents = await api.get<any[]>("/admin/busAgents");

        const validAgents = agents || [];

        let totalRevenue = 0;
        let totalCustomers = 0;

        const computedStats = validAgents
          .map((agent: any) => {
            const mockCustomers = Math.floor(Math.random() * 5000) + 500;
            const mockRevenue = mockCustomers * (Math.floor(Math.random() * 300) + 150) * 1000;

            totalCustomers += mockCustomers;
            totalRevenue += mockRevenue;

            return {
              name: agent.name || "Unknown",
              khachHang: mockCustomers,
              doanhThu: mockRevenue,
            };
          })
          .sort((a, b) => b.khachHang - a.khachHang)
          .slice(0, 8);

        setTotals({
          agents: validAgents.length,
          customers: totalCustomers,
          revenue: totalRevenue,
        });

        setAgentsStats(computedStats);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    }
    void loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center p-8 text-center text-muted-foreground">
        Đang tải dữ liệu biểu đồ...
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2">
      <div className="space-y-1">
        <h1 className="font-bold text-2xl tracking-tight">Thống Kê Tổng Quan</h1>
        <p className="text-muted-foreground text-sm">Hiệu suất kinh doanh và số liệu đối tác nhà xe</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tổng Doanh Thu</CardTitle>
            <DollarSign className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{(totals.revenue / 1000000).toFixed(1)}M đ</div>
            <p className="mt-1 text-muted-foreground text-xs">+20.1% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Đối Tác Nhà Xe</CardTitle>
            <Building2 className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">+{totals.agents}</div>
            <p className="mt-1 text-muted-foreground text-xs">+2 đối tác mới tuần này</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tổng Khách Hàng</CardTitle>
            <Users className="size-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totals.customers.toLocaleString()}</div>
            <p className="mt-1 text-muted-foreground text-xs">+1,203 so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tỷ Lệ Lấp Đầy</CardTitle>
            <TrendingUp className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">84.5%</div>
            <p className="mt-1 text-muted-foreground text-xs">+4% so với trung bình năm</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Số lượng Khách Hàng theo Nhà Xe</CardTitle>
            <CardDescription>Top 8 nhà xe có lượng khách nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentsStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    cursor={{ fill: "#f3f4f6" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="khachHang" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Khách hàng" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Tăng Trưởng Khách Hàng (7 ngày qua)</CardTitle>
            <CardDescription>Số lượng lượt khách đặt vé thành công</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={customerGrowthData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCustomers)"
                    name="Lượt khách"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
