import { useCallback, useEffect, useState } from "react";

import { Image as ImageIcon, Pencil, Plus, Search, Trash2 } from "lucide-react";

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

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [platform, setPlatform] = useState("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editTargetUrl, setEditTargetUrl] = useState("");
  const [editPlatform, setEditPlatform] = useState("all");

  const load = useCallback(async () => {
    try {
      const data = await api.get<any[]>('/admin/banners?sort=["createdAt","desc"]&range=[0,99]');
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load banners", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAdd() {
    if (!title.trim() || !imageUrl.trim()) return;
    setIsSaving(true);
    try {
      await api.post("/admin/banners", {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        targetUrl: targetUrl.trim() || undefined,
        platform,
      });
      setTitle("");
      setImageUrl("");
      setTargetUrl("");
      setPlatform("all");
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create banner", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/banners/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete banner", error);
    }
  }

  function openEdit(item: any) {
    setEditingId(item.id);
    setEditTitle(item.title || "");
    setEditImageUrl(item.imageUrl || "");
    setEditTargetUrl(item.targetUrl || "");
    setEditPlatform(item.platform || "all");
  }

  async function handleSaveEdit() {
    if (!editingId || !editTitle.trim() || !editImageUrl.trim()) return;
    setIsSaving(true);
    try {
      await api.put(`/admin/banners/${editingId}`, {
        title: editTitle.trim(),
        imageUrl: editImageUrl.trim(),
        targetUrl: editTargetUrl.trim() || undefined,
        platform: editPlatform,
      });
      setEditingId(null);
      await load();
    } catch (error) {
      console.error("Failed to update banner", error);
    } finally {
      setIsSaving(false);
    }
  }

  const filtered = items.filter((b) => {
    if (statusFilter === "ACTIVE" && !b.isActive) return false;
    if (statusFilter === "INACTIVE" && b.isActive) return false;
    return b.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const filterCounts = {
    ALL: items.length,
    ACTIVE: items.filter((b) => b.isActive).length,
    INACTIVE: items.filter((b) => !b.isActive).length,
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Banner</h1>
          <p className="text-muted-foreground text-sm">Quản lý banner quảng cáo hiển thị trên web/app</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm Banner Mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="banner-title" className="font-medium text-sm">
                  Tiêu đề
                </label>
                <Input
                  id="banner-title"
                  placeholder="Khuyến mãi hè 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="banner-image-url" className="font-medium text-sm">
                  Link ảnh
                </label>
                <Input
                  id="banner-image-url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="banner-target-url" className="font-medium text-sm">
                  Link đích (tuỳ chọn)
                </label>
                <Input
                  id="banner-target-url"
                  placeholder="/offers"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="banner-platform" className="font-medium text-sm">
                  Nền tảng
                </label>
                <select
                  id="banner-platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="all">Tất cả</option>
                  <option value="web">Web</option>
                  <option value="app">App</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSaving ? "Đang lưu..." : "Lưu banner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sửa Banner</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Tiêu đề</label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Link ảnh</label>
              <Input value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Link đích (tuỳ chọn)</label>
              <Input value={editTargetUrl} onChange={(e) => setEditTargetUrl(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Nền tảng</label>
              <select
                value={editPlatform}
                onChange={(e) => setEditPlatform(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="web">Web</option>
                <option value="app">App</option>
              </select>
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
              placeholder="Tìm theo tiêu đề..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[320px]">Banner</TableHead>
                <TableHead>Nền tảng</TableHead>
                <TableHead>Link đích</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    Chưa có banner nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((b) => (
                  <TableRow key={b.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                          {b.imageUrl ? (
                            <img src={b.imageUrl} alt={b.title} className="size-full object-cover" />
                          ) : (
                            <ImageIcon className="size-5" />
                          )}
                        </div>
                        <span className="font-semibold text-foreground">{b.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm capitalize">{b.platform}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{b.targetUrl || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          b.isActive
                            ? "border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-none"
                            : "border-gray-200/60 bg-gray-50 font-medium text-gray-500 shadow-none"
                        }
                      >
                        {b.isActive ? "Hoạt động" : "Tạm dừng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(b)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => void handleDelete(b.id)} className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700">
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
