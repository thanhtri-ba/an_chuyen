import { useEffect, useState } from "react";

import { Package, Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const STATUSES = ["PENDING", "ACCEPTED", "DELIVERING", "COMPLETED"];

const STATUS_META: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Chờ xử lý", cls: "border-yellow-200/60 bg-yellow-50 text-yellow-700" },
  ACCEPTED: { label: "Đã nhận", cls: "border-blue-200/60 bg-blue-50 text-blue-700" },
  DELIVERING: { label: "Đang giao", cls: "border-indigo-200/60 bg-indigo-50 text-indigo-700" },
  COMPLETED: { label: "Hoàn tất", cls: "border-emerald-200/60 bg-emerald-50 text-emerald-700" },
};
const STATUS_TABS = [{ key: "ALL", label: "Tất cả" }, ...STATUSES.map((s) => ({ key: s, label: STATUS_META[s].label }))] as const;

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    load();
  }, []);

  function load() {
    api
      .get<any[]>('/admin/deliveryOrders?sort=["createdAt","desc"]&range=[0,99]')
      .then((d) => setItems(d || []))
      .catch((error) => console.error("Failed to load delivery orders", error))
      .finally(() => setLoading(false));
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.put(`/admin/deliveryOrders/${id}`, { status });
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch (error) {
      console.error("Failed to update delivery status", error);
    }
  }

  const filtered = items.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    const q = searchQuery.toLowerCase();
    return o.pickupLocation?.toLowerCase().includes(q) || o.dropoffLocation?.toLowerCase().includes(q);
  });
  const tabCounts = Object.fromEntries(
    STATUS_TABS.map(({ key }) => [key, key === "ALL" ? items.length : items.filter((o) => o.status === key).length]),
  );

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="space-y-1">
        <h1 className="font-bold text-2xl tracking-tight">Đơn Giao Hàng</h1>
        <p className="text-muted-foreground text-sm">Theo dõi các đơn giao hàng từ khách hàng</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium text-sm transition-colors",
              statusFilter === tab.key
                ? "border-[#192B1D] bg-[#192B1D] text-white"
                : "border-border bg-background text-muted-foreground hover:bg-muted/50",
            )}
          >
            {tab.label}
            <span className={cn("rounded-full px-1.5 text-xs", statusFilter === tab.key ? "bg-white/20" : "bg-muted")}>
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
              placeholder="Tìm theo điểm đón/trả..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[280px]">Hành trình</TableHead>
                <TableHead>Loại hàng</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                    Chưa có đơn giao hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((o) => (
                  <TableRow key={o.id} className="transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                          <Package className="size-5" />
                        </div>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium text-foreground">{o.pickupLocation}</span>
                          <span className="text-muted-foreground text-xs">→ {o.dropoffLocation}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{o.packageType}</TableCell>
                    <TableCell className="text-sm">{Number(o.totalAmount).toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <select
                        value={o.status}
                        onChange={(e) => void updateStatus(o.id, e.target.value)}
                        className={cn(STATUS_META[o.status]?.cls || "border-gray-200/60 bg-gray-50 text-gray-600", "h-7 rounded-md border px-2 font-medium text-xs shadow-none")}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_META[s].label}</option>
                        ))}
                      </select>
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
