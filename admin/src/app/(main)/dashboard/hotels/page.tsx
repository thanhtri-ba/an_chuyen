import { useCallback, useEffect, useState } from "react";

import { Building2, Image as ImageIcon, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface FormState {
  name: string;
  location: string;
  country: string;
  desc: string;
  imageUrl: string;
  rating: string;
  reviewCount: string;
  priceFrom: string;
  discount: string;
  about: string;
  gallery: string;
  amenities: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  location: "",
  country: "",
  desc: "",
  imageUrl: "",
  rating: "5.0",
  reviewCount: "0",
  priceFrom: "",
  discount: "0%",
  about: "",
  gallery: "",
  amenities: "wifi",
};

function toForm(item: any): FormState {
  return {
    name: item.name || "",
    location: item.location || "",
    country: item.country || "",
    desc: item.desc || "",
    imageUrl: item.imageUrl || "",
    rating: item.rating || "5.0",
    reviewCount: item.reviewCount || "0",
    priceFrom: item.priceFrom ? String(item.priceFrom) : "",
    discount: item.discount || "0%",
    about: Array.isArray(item.about) ? item.about.join("\n") : "",
    gallery: Array.isArray(item.gallery) ? item.gallery.join(", ") : "",
    amenities: Array.isArray(item.amenities) ? item.amenities.join(", ") : "",
  };
}

function toPayload(form: FormState, existingSlug?: string) {
  return {
    ...(existingSlug ? {} : { slug: slugify(form.name) }),
    name: form.name.trim(),
    location: form.location.trim(),
    country: form.country.trim() || form.location.trim(),
    desc: form.desc.trim(),
    imageUrl: form.imageUrl.trim(),
    rating: form.rating.trim() || "5.0",
    reviewCount: form.reviewCount.trim() || "0",
    priceFrom: form.priceFrom ? Number(form.priceFrom) : 0,
    discount: form.discount.trim() || "0%",
    about: form.about.split("\n").map((s) => s.trim()).filter(Boolean),
    gallery: form.gallery.split(",").map((s) => s.trim()).filter(Boolean),
    amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
  };
}

function HotelForm({ form, onChange }: { form: FormState; onChange: (f: FormState) => void }) {
  return (
    <div className="grid max-h-[70vh] gap-4 overflow-y-auto py-4 pr-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Tên khách sạn</label>
          <Input placeholder="Dalat Mountain Lodge" value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Tỉnh/Thành</label>
          <Input placeholder="Lâm Đồng" value={form.country} onChange={(e) => onChange({ ...form, country: e.target.value })} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Địa điểm</label>
        <Input placeholder="Đà Lạt" value={form.location} onChange={(e) => onChange({ ...form, location: e.target.value })} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Mô tả ngắn</label>
        <Input placeholder="Ẩn mình giữa rừng thông..." value={form.desc} onChange={(e) => onChange({ ...form, desc: e.target.value })} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Link ảnh chính</label>
        <Input placeholder="https://..." value={form.imageUrl} onChange={(e) => onChange({ ...form, imageUrl: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Giá từ (đ/đêm)</label>
          <Input type="number" placeholder="1250000" value={form.priceFrom} onChange={(e) => onChange({ ...form, priceFrom: e.target.value })} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Giảm giá</label>
          <Input placeholder="-10%" value={form.discount} onChange={(e) => onChange({ ...form, discount: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Đánh giá (rating)</label>
          <Input placeholder="4.8" value={form.rating} onChange={(e) => onChange({ ...form, rating: e.target.value })} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Số lượt đánh giá</label>
          <Input placeholder="1,240" value={form.reviewCount} onChange={(e) => onChange({ ...form, reviewCount: e.target.value })} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Tiện ích (phân cách bởi dấu phẩy: wifi, pool, restaurant, gym)</label>
        <Input placeholder="wifi, pool, restaurant" value={form.amenities} onChange={(e) => onChange({ ...form, amenities: e.target.value })} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Giới thiệu (mỗi đoạn 1 dòng)</label>
        <textarea
          className="min-h-24 rounded-md border border-input bg-transparent p-2 text-sm"
          value={form.about}
          onChange={(e) => onChange({ ...form, about: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Ảnh thư viện (URL, phân cách bởi dấu phẩy)</label>
        <textarea
          className="min-h-16 rounded-md border border-input bg-transparent p-2 text-sm"
          value={form.gallery}
          onChange={(e) => onChange({ ...form, gallery: e.target.value })}
        />
      </div>
    </div>
  );
}

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);

  const load = useCallback(async () => {
    try {
      const data = await api.get<any[]>('/admin/hotels?sort=["createdAt","desc"]&range=[0,99]');
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load hotels", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAdd() {
    if (!addForm.name.trim() || !addForm.imageUrl.trim() || !addForm.location.trim()) return;
    setIsSaving(true);
    try {
      await api.post("/admin/hotels", { ...toPayload(addForm), isActive: true });
      setAddForm(EMPTY_FORM);
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create hotel", error);
    } finally {
      setIsSaving(false);
    }
  }

  function openEdit(item: any) {
    setEditForm(toForm(item));
    setEditingId(item.id);
  }

  async function handleSaveEdit() {
    if (!editingId || !editForm.name.trim() || !editForm.imageUrl.trim() || !editForm.location.trim()) return;
    setIsSaving(true);
    try {
      await api.put(`/admin/hotels/${editingId}`, toPayload(editForm, editingId));
      setEditingId(null);
      await load();
    } catch (error) {
      console.error("Failed to update hotel", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/hotels/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete hotel", error);
    }
  }

  async function toggleActive(item: any) {
    try {
      await api.put(`/admin/hotels/${item.id}`, { isActive: !item.isActive });
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i)));
    } catch (error) {
      console.error("Failed to update hotel", error);
    }
  }

  const filtered = items.filter((h) => {
    if (statusFilter === "ACTIVE" && !h.isActive) return false;
    if (statusFilter === "INACTIVE" && h.isActive) return false;
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return h.name?.toLowerCase().includes(q) || h.slug?.toLowerCase().includes(q) || h.location?.toLowerCase().includes(q);
  });
  const filterCounts = {
    ALL: items.length,
    ACTIVE: items.filter((h) => h.isActive).length,
    INACTIVE: items.filter((h) => !h.isActive).length,
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Khách Sạn</h1>
          <p className="text-muted-foreground text-sm">Quản lý khách sạn hiển thị ở trang /hotels trên web</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm khách sạn
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Thêm khách sạn mới</DialogTitle>
            </DialogHeader>
            <HotelForm form={addForm} onChange={setAddForm} />
            <DialogFooter>
              <Button type="button" onClick={handleAdd} disabled={isSaving} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {isSaving ? "Đang lưu..." : "Lưu khách sạn"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khách sạn</DialogTitle>
          </DialogHeader>
          <HotelForm form={editForm} onChange={setEditForm} />
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
              placeholder="Tìm theo tên hoặc địa điểm..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[280px]">Khách sạn</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Giá từ</TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    Chưa có khách sạn nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((h) => (
                  <TableRow key={h.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                          {h.imageUrl ? (
                            <img src={h.imageUrl} alt={h.name} className="size-full object-cover" />
                          ) : (
                            <Building2 className="size-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{h.name}</div>
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <MapPin className="size-3" /> {h.location}, {h.country}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-xs">{h.slug}</TableCell>
                    <TableCell className="text-sm">{Number(h.priceFrom || 0).toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell className="text-sm">{h.discount}</TableCell>
                    <TableCell>
                      <button onClick={() => void toggleActive(h)}>
                        <Badge
                          variant="outline"
                          className={
                            h.isActive
                              ? "border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-none"
                              : "border-gray-200/60 bg-gray-50 font-medium text-gray-500 shadow-none"
                          }
                        >
                          {h.isActive ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(h)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => void handleDelete(h.id)} className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700">
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
