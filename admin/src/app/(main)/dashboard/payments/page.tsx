import { useEffect, useState } from "react";

import { CreditCard, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const STATUS_META: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Đang chờ", cls: "border-yellow-200/60 bg-yellow-50 text-yellow-700" },
  PAID: { label: "Đã thanh toán", cls: "border-emerald-200/60 bg-emerald-50 text-emerald-700" },
  FAILED: { label: "Thất bại", cls: "border-red-200/60 bg-red-50 text-red-700" },
  REFUNDED: { label: "Đã hoàn tiền", cls: "border-gray-200/60 bg-gray-50 text-gray-600" },
};
const STATUS_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "PAID", label: "Đã thanh toán" },
  { key: "PENDING", label: "Đang chờ" },
  { key: "FAILED", label: "Thất bại" },
  { key: "REFUNDED", label: "Đã hoàn tiền" },
] as const;

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_TABS)[number]["key"]>("ALL");

  useEffect(() => {
    api
      .get<any[]>('/admin/payments?sort=["createdAt","desc"]&range=[0,99]')
      .then((d) => setItems(d || []))
      .catch((error) => console.error("Failed to load payments", error))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((p) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    const q = searchQuery.toLowerCase();
    return p.transactionId?.toLowerCase().includes(q) || p.method?.toLowerCase().includes(q);
  });
  const tabCounts = Object.fromEntries(
    STATUS_TABS.map(({ key }) => [key, key === "ALL" ? items.length : items.filter((p) => p.status === key).length]),
  );

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="space-y-1">
        <h1 className="font-bold text-2xl tracking-tight">Giao Dịch Thanh Toán</h1>
        <p className="text-muted-foreground text-sm">Đối soát các giao dịch thanh toán trong hệ thống</p>
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
              placeholder="Tìm theo mã giao dịch, phương thức..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[220px]">Mã giao dịch</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    Chưa có giao dịch nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id} className="transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2 font-mono text-sm">
                        <CreditCard className="size-4 text-muted-foreground" />
                        {p.transactionId || p.id.substring(0, 12)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.method}</TableCell>
                    <TableCell className="text-sm">{Number(p.amount).toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(STATUS_META[p.status]?.cls || "border-gray-200/60 bg-gray-50 text-gray-600", "font-medium shadow-none")}
                      >
                        {STATUS_META[p.status]?.label || p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {p.createdAt ? new Date(p.createdAt).toLocaleString("vi-VN") : "-"}
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
