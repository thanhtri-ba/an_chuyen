import { useCallback, useEffect, useState } from "react";

import { Pencil, Plus, Search, Ticket, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [logoPath, setLogoPath] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDiscountPct, setEditDiscountPct] = useState("");
  const [editMaxDiscount, setEditMaxDiscount] = useState("");
  const [editValidUntil, setEditValidUntil] = useState("");
  const [editLogoPath, setEditLogoPath] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api.get<any[]>('/admin/promotions?sort=["createdAt","desc"]&range=[0,99]');
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load promotions", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
        logoPath: logoPath.trim() || undefined,
      });
      setCode("");
      setTitle("");
      setDiscountPct("");
      setMaxDiscount("");
      setValidUntil("");
      setLogoPath("");
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

  function openEdit(item: any) {
    setEditingId(item.id);
    setEditCode(item.code || "");
    setEditTitle(item.title || "");
    setEditDiscountPct(item.discountPct != null ? String(item.discountPct) : "");
    setEditMaxDiscount(item.maxDiscount != null ? String(item.maxDiscount) : "");
    setEditValidUntil(item.validUntil ? item.validUntil.slice(0, 10) : "");
    setEditLogoPath(item.logoPath || "");
  }

  async function handleSaveEdit() {
    if (!editingId || !editCode.trim() || !editTitle.trim() || !editDiscountPct || !editValidUntil) return;
    setIsSaving(true);
    try {
      await api.put(`/admin/promotions/${editingId}`, {
        code: editCode.trim(),
        title: editTitle.trim(),
        discountPct: Number(editDiscountPct),
        maxDiscount: editMaxDiscount ? Number(editMaxDiscount) : undefined,
        validUntil: new Date(editValidUntil).toISOString(),
        logoPath: editLogoPath.trim() || undefined,
      });
      setEditingId(null);
      await load();
    } catch (error) {
      console.error("Failed to update promotion", error);
    } finally {
      setIsSaving(false);
    }
  }

  const filtered = items.filter((p) => {
    if (statusFilter === "ACTIVE" && !p.isActive) return false;
    if (statusFilter === "INACTIVE" && p.isActive) return false;
    const q = searchQuery.toLowerCase();
    return p.code?.toLowerCase().includes(q) || p.title?.toLowerCase().includes(q);
  });
  const filterCounts = {
    ALL: items.length,
    ACTIVE: items.filter((p) => p.isActive).length,
    INACTIVE: items.filter((p) => !p.isActive).length,
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Khuyến Mãi (Chương trình Voucher)</h1>
          <p className="text-muted-foreground text-sm">
            Tạo chương trình khuyến mãi (Promotion) — mỗi lượt khách nhận mã sẽ sinh ra một Voucher riêng gắn với chương trình này
          </p>
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
                <label htmlFor="voucher-code" className="font-medium text-sm">
                  Mã code
                </label>
                <Input
                  id="voucher-code"
                  placeholder="VD: SALE50"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="voucher-title" className="font-medium text-sm">
                  Tiêu đề
                </label>
                <Input
                  id="voucher-title"
                  placeholder="Giảm 50% cho đơn đầu tiên"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="voucher-discount-pct" className="font-medium text-sm">
                    % Giảm
                  </label>
                  <Input
                    id="voucher-discount-pct"
                    type="number"
                    placeholder="10"
                    value={discountPct}
                    onChange={(e) => setDiscountPct(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="voucher-max-discount" className="font-medium text-sm">
                    Giảm tối đa (đ)
                  </label>
                  <Input
                    id="voucher-max-discount"
                    type="number"
                    placeholder="50000"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="voucher-valid-until" className="font-medium text-sm">
                  Hết hạn
                </label>
                <Input
                  id="voucher-valid-until"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="voucher-logo" className="font-medium text-sm">
                  Link ảnh (tuỳ chọn)
                </label>
                <Input
                  id="voucher-logo"
                  placeholder="https://..."
                  value={logoPath}
                  onChange={(e) => setLogoPath(e.target.value)}
                />
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

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sửa Khuyến Mãi</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Mã code</label>
              <Input value={editCode} onChange={(e) => setEditCode(e.target.value.toUpperCase())} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Tiêu đề</label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">% Giảm</label>
                <Input type="number" value={editDiscountPct} onChange={(e) => setEditDiscountPct(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Giảm tối đa (đ)</label>
                <Input type="number" value={editMaxDiscount} onChange={(e) => setEditMaxDiscount(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Hết hạn</label>
              <Input type="date" value={editValidUntil} onChange={(e) => setEditValidUntil(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Link ảnh (tuỳ chọn)</label>
              <Input placeholder="https://..." value={editLogoPath} onChange={(e) => setEditLogoPath(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSaveEdit} disabled={isSaving} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "ALL", label: "Tất cả" },
            { key: "ACTIVE", label: "Hoạt động" },
            { key: "INACTIVE", label: "Tạm dừng" },
          ] as const
        ).map((tab) => (
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
              {filterCounts[tab.key]}
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
              placeholder="Tìm theo mã hoặc tiêu đề..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
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
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                          {p.logoPath ? (
                            <img src={p.logoPath} alt={p.title} className="size-full object-cover" />
                          ) : (
                            <Ticket className="size-5" />
                          )}
                        </div>
                        <span className="font-mono font-semibold text-foreground">{p.code}</span>
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
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => void handleDelete(p.id)} className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
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
