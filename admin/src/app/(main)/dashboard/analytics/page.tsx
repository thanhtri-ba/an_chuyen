import { useEffect, useState } from "react";

import { Building2, Calendar1, Clock3, Download, ShoppingBag, TrendingDown, TrendingUp, UserPlus } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { getCurrentAdminUser } from "@/lib/current-user";

interface Overview {
  totalRevenue: number;
  revenueGrowthPct: number | null;
  totalAgents: number;
  totalCustomers: number;
  customerGrowthAbs: number;
  fillRatePct: number;
  seatsBooked: number;
  seatsTotal: number;
  todayTrips: number;
  pendingBookings: number;
  totalBookingsAll: number;
  topAgents: { name: string; customers: number }[];
  topRoutes: { route: string; bookings: number; revenue: number }[];
  revenueByAgent: { name: string; revenue: number }[];
  recentTransactions: { id: string; customer: string; route: string; status: string; seats: number; totalAmount: number }[];
  dailyBookings: {
    date: string;
    name: string;
    dateLabel: string;
    dateLabelFull: string;
    bookings: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  }[];
}

const DONUT_COLORS = ["#192B1D", "#C97B2F", "#F2C118", "#4A4E46", "#8AA890", "#D9A566"];

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: "Thành công", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  COMPLETED: { label: "Thành công", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  PENDING_PAYMENT: { label: "Chờ thanh toán", cls: "border-yellow-200 bg-yellow-50 text-yellow-700" },
  CANCELLED: { label: "Đã hủy", cls: "border-red-200 bg-red-50 text-red-700" },
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  trend?: { value: string; positive: boolean } | null;
}) {
  return (
    <Card className="border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
          <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg text-white", accent)}>
            <Icon className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-bold text-2xl tracking-tight">{value}</span>
          {sub && <span className="text-muted-foreground text-sm">{sub}</span>}
        </div>
        {trend && (
          <p
            className={cn(
              "mt-2 inline-flex items-center gap-1 text-xs font-medium",
              trend.positive ? "text-emerald-600" : "text-red-600",
            )}
          >
            {trend.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const admin = getCurrentAdminUser();

  useEffect(() => {
    api
      .get<Overview>("/admin/analytics/overview")
      .then(setData)
      .catch((error) => console.error("Failed to load analytics", error))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCsv = () => {
    if (!data) return;
    const rows = [
      ["Mã đơn", "Khách hàng", "Tuyến", "Trạng thái", "Số ghế", "Tổng tiền"],
      ...data.recentTransactions.map((t) => [t.id, t.customer, t.route, STATUS_LABEL[t.status]?.label || t.status, String(t.seats), String(t.totalAmount)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `giao-dich-gan-day-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !data) {
    return (
      <div className="flex h-[50vh] items-center justify-center p-8 text-center text-muted-foreground">
        Đang tải dữ liệu thống kê...
      </div>
    );
  }

  const totalDonutRevenue = data.revenueByAgent.reduce((s, a) => s + a.revenue, 0);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-2">
      {/* Page header — greeting + actions, in the spirit of the Figma topbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* <h1 className="font-bold text-2xl tracking-tight">
            Chào mừng trở lại, {admin?.name?.split(" ").slice(-1)[0] || "Admin"}
          </h1> */}
          <p className="mt-0.5 text-muted-foreground text-sm">
            {new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })} — dữ liệu thực từ hệ thống
          </p>
        </div>
        <Button onClick={handleExportCsv} variant="outline" className="gap-2 self-start sm:self-auto">
          <Download className="size-4" /> Xuất CSV
        </Button>
      </div>

      {/* KPI row — 4 cards, Figma-style */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng Doanh Thu"
          value={`${(data.totalRevenue / 1_000_000).toFixed(1)}M đ`}
          icon={ShoppingBag}
          accent="bg-[#192B1D]"
          trend={
            data.revenueGrowthPct === null
              ? null
              : {
                  value: `${data.revenueGrowthPct >= 0 ? "+" : ""}${data.revenueGrowthPct.toFixed(1)}% so với tháng trước`,
                  positive: data.revenueGrowthPct >= 0,
                }
          }
        />
        <StatCard
          label="Tổng Đơn Đặt Vé"
          value={data.totalBookingsAll.toLocaleString("vi-VN")}
          sub="đơn"
          icon={Calendar1}
          accent="bg-[#4A4E46]"
        />
        <StatCard
          label="Khách Hàng Mới"
          value={`+${data.customerGrowthAbs}`}
          sub="tháng này"
          icon={UserPlus}
          accent="bg-[#C97B2F]"
        />
        <StatCard
          label="Tỷ Lệ Lấp Đầy Ghế"
          value={`${data.fillRatePct.toFixed(1)}%`}
          icon={TrendingUp}
          accent="bg-[#F2C118] text-[#192B1D]"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Sales trend — big chart, 2/3 width */}
        <Card className="border-border shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-border/60 border-b !pb-4">
            <div>
              <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Xu Hướng Đặt Vé</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-bold text-2xl tracking-tight">{data.dailyBookings.reduce((s, d) => s + d.bookings, 0)}</span>
                <span className="text-muted-foreground text-sm">đơn trong 7 ngày qua</span>
              </div>
            </div>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Clock3 className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="mb-3 flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-[#192B1D]" /> Đã xác nhận
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-[#F2C118]" /> Chưa thanh toán
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-red-500" /> Đã hủy
              </span>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyBookings} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#192B1D" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#192B1D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F2C118" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#F2C118" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0ee" />
                  <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} allowDecimals={false} width={28} />
                  <RechartsTooltip
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.dateLabelFull ?? ""}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="confirmed"
                    stroke="#192B1D"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorConfirmed)"
                    name="Đã xác nhận"
                    isAnimationActive={false}
                    dot={{ r: 2.5, fill: "#192B1D", strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stroke="#C97B2F"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPending)"
                    name="Chưa thanh toán"
                    isAnimationActive={false}
                    dot={{ r: 2.5, fill: "#C97B2F", strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cancelled"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCancelled)"
                    name="Đã hủy"
                    isAnimationActive={false}
                    dot={{ r: 2.5, fill: "#ef4444", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue breakdown donut — 1/3 width */}
        <Card className="border-border shadow-sm">
          <CardHeader className="border-border/60 border-b !pb-4">
            <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Doanh Thu Theo Nhà Xe</p>
            <div className="mt-1 font-bold text-2xl tracking-tight">{(totalDonutRevenue / 1_000_000).toFixed(1)}M đ</div>
          </CardHeader>
          <CardContent className="pt-5">
            {data.revenueByAgent.length === 0 ? (
              <div className="flex h-[180px] items-center justify-center text-center text-muted-foreground text-sm">
                Chưa có doanh thu trong 7 ngày qua
              </div>
            ) : (
              <>
                <div className="flex h-[180px] w-full items-center justify-center">
                  <PieChart width={220} height={180}>
                    <Pie
                      data={data.revenueByAgent}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={78}
                      paddingAngle={2}
                      stroke="none"
                      isAnimationActive={false}
                    >
                      {data.revenueByAgent.map((entry, i) => (
                        <Cell key={entry.name} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => `${value.toLocaleString("vi-VN")} đ`}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                    />
                  </PieChart>
                </div>
                <div className="mt-3 space-y-2">
                  {data.revenueByAgent.map((a, i) => (
                    <div key={a.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        {a.name}
                      </span>
                      <span className="font-medium text-foreground">{(a.revenue / 1000).toFixed(0)}k đ</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions table */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-border/60 border-b !pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#192B1D]/10 text-[#192B1D]">
              <Building2 className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Đơn Đặt Vé Gần Đây</p>
              <p className="text-muted-foreground text-xs">6 đơn mới nhất trong 7 ngày qua</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {data.recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Chưa có đơn đặt vé nào trong 7 ngày qua</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-border border-b bg-muted/40">
                  <tr>
                    <th className="p-3 text-left font-medium text-muted-foreground">Mã đơn</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Khách hàng</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Tuyến</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Trạng thái</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">Số ghế</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.recentTransactions.map((t) => (
                    <tr key={t.id} className="transition-colors hover:bg-muted/30">
                      <td className="p-3 font-mono text-muted-foreground text-xs">#{t.id}</td>
                      <td className="p-3 font-medium text-foreground">{t.customer}</td>
                      <td className="p-3 text-muted-foreground">{t.route}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={cn("font-medium shadow-none", STATUS_LABEL[t.status]?.cls || "border-gray-200 bg-gray-50 text-gray-600")}>
                          {STATUS_LABEL[t.status]?.label || t.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-muted-foreground">{t.seats}</td>
                      <td className="p-3 text-right font-semibold text-foreground">{t.totalAmount.toLocaleString("vi-VN")} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
