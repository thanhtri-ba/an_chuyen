import { useEffect, useState } from "react";

import { Bus, DollarSign, TrendingUp, Users, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  totalTrips: number;
  totalRevenue: number;
  totalWalletBalance: number;
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}

export function MetricCards() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<AdminStats>("/admin/stats")
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((error) => console.error("Failed to load admin stats", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <DollarSign className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Tổng doanh thu</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {loading ? "…" : formatCurrency(stats?.totalRevenue ?? 0)}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Tổng doanh thu từ các đơn đặt vé</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Users className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Tổng người dùng</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {loading ? "…" : (stats?.totalUsers ?? 0).toLocaleString("vi-VN")}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Tổng số tài khoản đã đăng ký</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <TrendingUp className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Tổng đơn đặt vé</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {loading ? "…" : (stats?.totalBookings ?? 0).toLocaleString("vi-VN")}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Tổng số vé đã đặt trên hệ thống</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Bus className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Tổng chuyến xe</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {loading ? "…" : (stats?.totalTrips ?? 0).toLocaleString("vi-VN")}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Tổng số chuyến xe đang vận hành</p>
        </CardContent>
      </Card>

      <Card className="xl:col-span-4">
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Wallet className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Tổng số dư ví</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {loading ? "…" : formatCurrency(stats?.totalWalletBalance ?? 0)}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Tổng số dư ví của toàn bộ người dùng</p>
        </CardContent>
      </Card>
    </div>
  );
}
