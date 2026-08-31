import { useCallback, useEffect, useState } from "react";

import { Car, Pencil, Plus, Search, Trash2 } from "lucide-react";

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

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [seats, setSeats] = useState("4");
  const [pricePerDay, setPricePerDay] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editSeats, setEditSeats] = useState("4");
  const [editPricePerDay, setEditPricePerDay] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api.get<any[]>('/admin/rentalCars?sort=["createdAt","desc"]&range=[0,99]');
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load rental cars", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAdd() {
    if (!name.trim() || !type.trim() || !pricePerDay) return;
    setIsSaving(true);
    try {
      await api.post("/admin/rentalCars", {
        name: name.trim(),
        type: type.trim(),
        seats: Number(seats) || 4,
        pricePerDay: Number(pricePerDay),
      });
      setName("");
      setType("");
      setSeats("4");
      setPricePerDay("");
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create rental car", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/rentalCars/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete rental car", error);
    }
  }

  function openEdit(item: any) {
    setEditingId(item.id);
    setEditName(item.name || "");
    setEditType(item.type || "");
    setEditSeats(item.seats != null ? String(item.seats) : "4");
    setEditPricePerDay(item.pricePerDay != null ? String(item.pricePerDay) : "");
  }

  async function handleSaveEdit() {
    if (!editingId || !editName.trim() || !editType.trim() || !editPricePerDay) return;
    setIsSaving(true);
    try {
      await api.put(`/admin/rentalCars/${editingId}`, {
        name: editName.trim(),
        type: editType.trim(),
        seats: Number(editSeats) || 4,
        pricePerDay: Number(editPricePerDay),
      });
      setEditingId(null);
      await load();
    } catch (error) {
      console.error("Failed to update rental car", error);
    } finally {
      setIsSaving(false);
    }
  }

  const filtered = items.filter((c) => {
    if (statusFilter === "ACTIVE" && !c.isActive) return false;
    if (statusFilter === "INACTIVE" && c.isActive) return false;
    return c.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const filterCounts = {
    ALL: items.length,
    ACTIVE: items.filter((c) => c.isActive).length,
    INACTIVE: items.filter((c) => !c.isActive).length,
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Xe Tự Lái</h1>
          <p className="text-muted-foreground text-sm">Quản lý danh sách xe cho thuê tự lái</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm Xe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm Xe Mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="rental-name" className="font-medium text-sm">
                  Tên xe
                </label>
                <Input
                  id="rental-name"
                  placeholder="Toyota Vios 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="rental-type" className="font-medium text-sm">
                    Loại xe
                  </label>
                  <Input
                    id="rental-type"
                    placeholder="Sedan, SUV..."
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="rental-seats" className="font-medium text-sm">
                    Số ghế
                  </label>
                  <Input id="rental-seats" type="number" value={seats} onChange={(e) => setSeats(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="rental-price-per-day" className="font-medium text-sm">
                  Giá/ngày (đ)
                </label>
                <Input
                  id="rental-price-per-day"
                  type="number"
                  placeholder="800000"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
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
                {isSaving ? "Đang lưu..." : "Lưu xe"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sửa Xe</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Tên xe</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Loại xe</label>
                <Input value={editType} onChange={(e) => setEditType(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Số ghế</label>
                <Input type="number" value={editSeats} onChange={(e) => setEditSeats(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Giá/ngày (đ)</label>
              <Input type="number" value={editPricePerDay} onChange={(e) => setEditPricePerDay(e.target.value)} />
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
              placeholder="Tìm theo tên xe..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[280px]">Xe</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số ghế</TableHead>
                <TableHead>Giá/ngày</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    Chưa có xe nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                          <Car className="size-5" />
                        </div>
                        <span className="font-semibold text-foreground">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.type}</TableCell>
                    <TableCell className="text-sm">{c.seats}</TableCell>
                    <TableCell className="text-sm">{Number(c.pricePerDay).toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          c.isActive
                            ? "border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-none"
                            : "border-gray-200/60 bg-gray-50 font-medium text-gray-500 shadow-none"
                        }
                      >
                        {c.isActive ? "Hoạt động" : "Tạm dừng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => void handleDelete(c.id)} className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700">
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
