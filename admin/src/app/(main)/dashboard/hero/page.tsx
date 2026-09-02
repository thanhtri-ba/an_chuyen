import { useCallback, useEffect, useState } from "react";

import { Film, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

interface FormState {
  eyebrow: string;
  title: string;
  videoUrl: string;
  order: string;
}

const EMPTY_FORM: FormState = { eyebrow: "Khám phá", title: "", videoUrl: "", order: "0" };

function toForm(item: any): FormState {
  return {
    eyebrow: item.eyebrow || "Khám phá",
    title: item.title || "",
    videoUrl: item.videoUrl || "",
    order: item.order != null ? String(item.order) : "0",
  };
}

function toPayload(form: FormState) {
  return {
    eyebrow: form.eyebrow.trim() || "Khám phá",
    title: form.title.trim(),
    videoUrl: form.videoUrl.trim(),
    order: form.order ? Number(form.order) : 0,
  };
}

function HeroSlideForm({ form, onChange }: { form: FormState; onChange: (f: FormState) => void }) {
  return (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Chữ eyebrow (nhỏ, phía trên tiêu đề)</label>
        <Input placeholder="Khám phá" value={form.eyebrow} onChange={(e) => onChange({ ...form, eyebrow: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Tiêu đề chính</label>
        <Input placeholder="Đừng đứng chờ ở bến xe nữa" value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Link video (.mp4)</label>
        <Input placeholder="https://..." value={form.videoUrl} onChange={(e) => onChange({ ...form, videoUrl: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Thứ tự phát (số nhỏ phát trước)</label>
        <Input type="number" placeholder="0" value={form.order} onChange={(e) => onChange({ ...form, order: e.target.value })} />
      </div>
    </div>
  );
}

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);

  const load = useCallback(async () => {
    try {
      const data = await api.get<any[]>('/admin/heroSlides?sort=["order","asc"]&range=[0,99]');
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load hero slides", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAdd() {
    if (!addForm.title.trim() || !addForm.videoUrl.trim()) return;
    setIsSaving(true);
    try {
      await api.post("/admin/heroSlides", { ...toPayload(addForm), isActive: true });
      setAddForm(EMPTY_FORM);
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create hero slide", error);
    } finally {
      setIsSaving(false);
    }
  }

  function openEdit(item: any) {
    setEditForm(toForm(item));
    setEditingId(item.id);
  }

  async function handleSaveEdit() {
    if (!editingId || !editForm.title.trim() || !editForm.videoUrl.trim()) return;
    setIsSaving(true);
    try {
      await api.put(`/admin/heroSlides/${editingId}`, toPayload(editForm));
      setEditingId(null);
      await load();
    } catch (error) {
      console.error("Failed to update hero slide", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/heroSlides/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete hero slide", error);
    }
  }

  async function toggleActive(item: any) {
    try {
      await api.put(`/admin/heroSlides/${item.id}`, { isActive: !item.isActive });
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i)));
    } catch (error) {
      console.error("Failed to update hero slide", error);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Video Trang Chủ</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý các video nền và tiêu đề hero xoay vòng trên trang chủ web
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Thêm video hero mới</DialogTitle>
            </DialogHeader>
            <HeroSlideForm form={addForm} onChange={setAddForm} />
            <DialogFooter>
              <Button type="button" onClick={handleAdd} disabled={isSaving} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {isSaving ? "Đang lưu..." : "Lưu video"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa video hero</DialogTitle>
          </DialogHeader>
          <HeroSlideForm form={editForm} onChange={setEditForm} />
          <DialogFooter>
            <Button type="button" onClick={handleSaveEdit} disabled={isSaving} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden rounded-xl border-border shadow-sm">
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px]">Thứ tự</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Eyebrow</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    Chưa có video nào — trang chủ sẽ dùng video mặc định có sẵn trong mã nguồn
                  </TableCell>
                </TableRow>
              ) : (
                items.map((s) => (
                  <TableRow key={s.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-mono text-muted-foreground text-xs">{s.order}</TableCell>
                    <TableCell className="max-w-[260px] truncate font-semibold text-foreground">{s.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{s.eyebrow}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Film className="size-3.5 shrink-0" />
                        <span className="max-w-[220px] truncate font-mono">{s.videoUrl}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => void toggleActive(s)}>
                        <Badge
                          variant="outline"
                          className={
                            s.isActive
                              ? "border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-none"
                              : "border-gray-200/60 bg-gray-50 font-medium text-gray-500 shadow-none"
                          }
                        >
                          {s.isActive ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(s)}
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => void handleDelete(s.id)}
                          className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
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
