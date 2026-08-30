import { useEffect, useState } from "react";

import { Filter, MoreHorizontal, Plus, Search, Ticket, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");

  async function load() {
    try {
      const data = await api.get<any[]>("/admin/promotions");
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load promotions", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleAdd() {
    if (!code.trim() || !title.trim() || !discountPct || !validUntil) return;
    setIsSaving(true);
    try {
      await api.post("/admin/promotions", {
        code: code.trim(),
        title: title.trim(),
        discountPct: Number(discountPct),
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        validUntil: new Date(validUntil).toISOString(),
      });
      setCode("");
      setTitle("");
      setDiscountPct("");
      setMaxDiscount("");
      setValidUntil("");
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create promotion", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/promotions/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete promotion", error);
    }
  }

  const filtered = items.filter(
    (p) => p.code?.toLowerCase().includes(searchQuery.toLowerCase()) || p.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Voucher / Khuyến Mãi</h1>
          <p className="text-muted-foreground text-sm">Quản lý mã giảm giá áp dụng cho khách hàng</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm Voucher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm Voucher Mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Mã code</label>
                <Input placeholder="VD: SALE50" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Tiêu đề</label>
                <Input placeholder="Giảm 50% cho đơn đầu tiên" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm">% Giảm</label>
                  <Input type="number" placeholder="10" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm">Giảm tối đa (đ)</label>
                  <Input type="number" placeholder="50000" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Hết hạn</label>
                <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSaving ? "Đang lưu..." : "Lưu voucher"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden rounded-xl border-border shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-border border-b bg-card p-4 sm:flex-row">
          <div className="relative w-full sm:w-96">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-lg border-border bg-muted/50 pl-9 text-foreground placeholder:text-muted-foreground"
              placeholder="Tìm theo mã hoặc tiêu đề..."
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 w-full gap-2 sm:w-auto">
            <Filter className="size-4" /> Lọc
          </Button>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[220px]">Mã</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>% Giảm</TableHead>
                <TableHead>Hết hạn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    Chưa có voucher nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                          <Ticket className="size-5" />
                        </div>
                        <span className="font-semibold font-mono text-foreground">{p.code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.title}</TableCell>
                    <TableCell className="text-sm">{p.discountPct}%</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {p.validUntil ? new Date(p.validUntil).toLocaleDateString("vi-VN") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          p.isActive
                            ? "border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-none"
                            : "border-gray-200/60 bg-gray-50 font-medium text-gray-500 shadow-none"
                        }
                      >
                        {p.isActive ? "Hoạt động" : "Tạm dừng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleDelete(p.id)}
                        className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
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
