import { useEffect, useState } from "react";

import { Check, Download, Search, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const STATUS_TABS = [
  { key: "PENDING_PAYMENT", label: "Chờ duyệt" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "COMPLETED", label: "Hoàn thành" },
  { key: "CANCELLED", label: "Đã huỷ" },
  { key: "ALL", label: "Tất cả" },
] as const;

const statusColor: Record<string, string> = {
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof STATUS_TABS)[number]["key"]>("PENDING_PAYMENT");

  useEffect(() => {
    api
      .get<any[]>('/admin/bookings?sort=["createdAt","desc"]&range=[0,99]')
      .then((d) => setItems(d || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((b) => {
    if (activeTab !== "ALL" && b.status !== activeTab) return false;
    const q = searchQuery.toLowerCase();
    const name = b.user?.fullName?.toLowerCase() || "";
    return name.includes(q) || b.id.toLowerCase().includes(q);
  });

  const tabCounts = Object.fromEntries(
    STATUS_TABS.map(({ key }) => [key, key === "ALL" ? items.length : items.filter((b) => b.status === key).length]),
  );

  function exportCsv() {
    const header = ["Mã vé", "Khách hàng", "Tổng tiền", "Trạng thái", "Ngày đặt"];
    const rows = filteredItems.map((b) => [
      b.id,
      b.user?.fullName ?? b.userId,
      b.totalAmount,
      b.status,
      new Date(b.createdAt).toISOString(),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dat-ve-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleConfirmCod(booking: any) {
    if (!booking.payment?.id) {
      alert("Booking này chưa có bản ghi thanh toán (payment) để xác nhận.");
      return;
    }
    setConfirmingId(booking.id);
    try {
      await api.post("/payments/cod/confirm", { paymentId: booking.payment.id });
      setItems((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? { ...b, status: "CONFIRMED", payment: { ...b.payment, status: "PAID" } }
            : b,
        ),
      );
    } catch (error: any) {
      alert(error.message || "Không thể xác nhận thanh toán.");
    } finally {
      setConfirmingId(null);
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Đặt Vé</h1>
          <p className="text-muted-foreground text-sm">Quản lý các giao dịch đặt vé của khách hàng</p>
        </div>
        <Button variant="outline" className="gap-2 border-border bg-background shadow-sm" onClick={exportCsv}>
          <Download className="size-4" /> Xuất CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium text-sm transition-colors",
              activeTab === tab.key
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-border bg-background text-muted-foreground hover:bg-muted/50",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                activeTab === tab.key ? "bg-white/20" : "bg-muted",
              )}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <Card className="overflow-hidden rounded-xl border-border shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-border border-b bg-card p-4 sm:flex-row">
          <div className="relative w-full sm:w-96">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-lg border-border bg-muted/50 pl-9 text-foreground placeholder:text-muted-foreground"
              placeholder="Tìm theo mã vé hoặc tên khách hàng..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Khách hàng</TableHead>
                <TableHead>Chuyến xe</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy vé nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((b) => (
                  <TableRow key={b.id} className="group cursor-pointer transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-600">
                          {b.user?.fullName ? (
                            b.user.fullName.substring(0, 1).toUpperCase()
                          ) : (
                            <User className="size-4" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {b.user?.fullName ?? b.userId.slice(0, 8)}
                          </span>
                          <span className="font-mono text-muted-foreground text-xs">
                            Mã vé: {b.id.substring(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-border bg-muted/30 font-mono text-muted-foreground text-xs"
                      >
                        {b.tripScheduleId.slice(0, 8).toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {b.totalAmount.toLocaleString("vi-VN")} đ
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-medium shadow-none ${statusColor[b.status] ?? "bg-slate-50 text-slate-700"}`}
                      >
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(b.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {b.status === "PENDING_PAYMENT" ? (
                        <Button
                          size="sm"
                          className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                          disabled={confirmingId === b.id}
                          onClick={() => void handleConfirmCod(b)}
                        >
                          <Check className="size-4" />
                          {confirmingId === b.id ? "Đang duyệt..." : "Duyệt"}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
