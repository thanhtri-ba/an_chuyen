import { useEffect, useState } from "react";

import { Plus, Save, Settings2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    try {
      const data = await api.get<any[]>("/admin/appConfigs");
      setItems(data || []);
      setDrafts(Object.fromEntries((data || []).map((c) => [c.id, c.value])));
    } catch (error) {
      console.error("Failed to load app configs", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleAdd() {
    if (!key.trim() || !value.trim()) return;
    setIsSaving(true);
    try {
      await api.post("/admin/appConfigs", { key: key.trim(), value: value.trim(), description: description.trim() || undefined });
      setKey("");
      setValue("");
      setDescription("");
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create config", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSave(id: string) {
    setSavingKey(id);
    try {
      await api.put(`/admin/appConfigs/${id}`, { value: drafts[id] });
      await load();
    } catch (error) {
      console.error("Failed to update config", error);
    } finally {
      setSavingKey(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/appConfigs/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete config", error);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Cấu Hình Website</h1>
          <p className="text-muted-foreground text-sm">Quản lý nội dung động (key/value) cho web & app</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm Cấu Hình
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm Cấu Hình Mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Key</label>
                <Input placeholder="about_page_content" value={key} onChange={(e) => setKey(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Giá trị</label>
                <Input placeholder="Nội dung / JSON" value={value} onChange={(e) => setValue(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Mô tả (tuỳ chọn)</label>
                <Input placeholder="Dùng để hiển thị ở trang About" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden rounded-xl border-border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[240px]">Key</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead className="w-[220px]">Mô tả</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                    Chưa có cấu hình nào
                  </TableCell>
                </TableRow>
              ) : (
                items.map((c) => (
                  <TableRow key={c.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium font-mono text-sm">
                        <Settings2 className="size-4 text-muted-foreground" />
                        {c.key}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={drafts[c.id] ?? ""}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{c.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleSave(c.id)}
                        disabled={savingKey === c.id || drafts[c.id] === c.value}
                        className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                      >
                        <Save className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleDelete(c.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
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
