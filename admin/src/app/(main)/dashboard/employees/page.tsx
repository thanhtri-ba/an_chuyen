import { useEffect, useState } from "react";

import { IdCard, Pencil, Phone, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const ROLE_META: Record<string, { label: string; cls: string }> = {
  DRIVER: { label: "Tài xế", cls: "border-blue-200 bg-blue-50 text-blue-700" },
  ASSISTANT: { label: "Lơ xe", cls: "border-purple-200 bg-purple-50 text-purple-700" },
};

const SHIFT_META: Record<string, string> = {
  MORNING: "Ca sáng",
  AFTERNOON: "Ca chiều",
  NIGHT: "Ca đêm",
};

const ROLE_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "DRIVER", label: "Tài xế" },
  { key: "ASSISTANT", label: "Lơ xe" },
] as const;

interface EmployeeForm {
  name: string;
  role: "DRIVER" | "ASSISTANT";
  phone: string;
  workLocation: string;
  shift: string;
}

const EMPTY_FORM: EmployeeForm = { name: "", role: "DRIVER", phone: "", workLocation: "", shift: "MORNING" };

function EmployeeFormFields({ form, onChange }: { form: EmployeeForm; onChange: (f: EmployeeForm) => void }) {
  return (
    <div className="grid gap-4 py-2">
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Họ tên</label>
        <Input placeholder="Nguyễn Văn A" value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Vai trò</label>
          <select
            value={form.role}
            onChange={(e) => onChange({ ...form, role: e.target.value as EmployeeForm["role"] })}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="DRIVER">Tài xế</option>
            <option value="ASSISTANT">Lơ xe</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Ca làm việc</label>
          <select
            value={form.shift}
            onChange={(e) => onChange({ ...form, shift: e.target.value })}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="MORNING">Ca sáng</option>
            <option value="AFTERNOON">Ca chiều</option>
            <option value="NIGHT">Ca đêm</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Số điện thoại</label>
        <Input placeholder="09xxxxxxxx" value={form.phone} onChange={(e) => onChange({ ...form, phone: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Vị trí làm việc</label>
        <Input placeholder="Bến xe Mỹ Đình, Hà Nội" value={form.workLocation} onChange={(e) => onChange({ ...form, workLocation: e.target.value })} />
      </div>
    </div>
  );
}

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<(typeof ROLE_TABS)[number]["key"]>("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addForm, setAddForm] = useState<EmployeeForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EmployeeForm>(EMPTY_FORM);

  async function load() {
    try {
      const data = await api.get<any[]>('/admin/employees?sort=["createdAt","desc"]&range=[0,199]');
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load employees", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleAdd() {
    if (!addForm.name.trim()) return;
    setIsSaving(true);
    try {
      await api.post("/admin/employees", addForm);
      setAddForm(EMPTY_FORM);
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create employee", error);
    } finally {
      setIsSaving(false);
    }
  }

  function openEdit(emp: any) {
    setEditingId(emp.id);
    setEditForm({
      name: emp.name || "",
      role: emp.role || "DRIVER",
      phone: emp.phone || "",
      workLocation: emp.workLocation || "",
      shift: emp.shift || "MORNING",
    });
  }

  async function handleSaveEdit() {
    if (!editingId || !editForm.name.trim()) return;
    setIsSaving(true);
    try {
      await api.put(`/admin/employees/${editingId}`, editForm);
      setEditingId(null);
      await load();
    } catch (error) {
      console.error("Failed to update employee", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/employees/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  }

  async function toggleActive(emp: any) {
    try {
      await api.put(`/admin/employees/${emp.id}`, { isActive: !emp.isActive });
      setItems((prev) => prev.map((i) => (i.id === emp.id ? { ...i, isActive: !i.isActive } : i)));
    } catch (error) {
      console.error("Failed to toggle employee status", error);
    }
  }

  const filtered = items.filter((e) => {
    if (roleFilter !== "ALL" && e.role !== roleFilter) return false;
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return e.name?.toLowerCase().includes(q) || e.phone?.toLowerCase().includes(q) || e.workLocation?.toLowerCase().includes(q);
  });
  const tabCounts = Object.fromEntries(
    ROLE_TABS.map(({ key }) => [key, key === "ALL" ? items.length : items.filter((e) => e.role === key).length]),
  );

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#192B1D] text-white">
            <IdCard className="size-5" />
          </div>
          <div className="space-y-0.5">
            <h1 className="font-bold text-2xl tracking-tight">Nhân Viên</h1>
            <p className="text-muted-foreground text-sm">Quản lý tài xế và lơ xe — ca làm việc, vị trí công tác</p>
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (open) setAddForm(EMPTY_FORM); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm Nhân Viên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm Nhân Viên Mới</DialogTitle>
            </DialogHeader>
            <EmployeeFormFields form={addForm} onChange={setAddForm} />
            <DialogFooter>
              <Button type="button" onClick={handleAdd} disabled={isSaving || !addForm.name.trim()} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {isSaving ? "Đang lưu..." : "Lưu nhân viên"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sửa Thông Tin Nhân Viên</DialogTitle>
          </DialogHeader>
          <EmployeeFormFields form={editForm} onChange={setEditForm} />
          <DialogFooter>
            <Button type="button" onClick={handleSaveEdit} disabled={isSaving || !editForm.name.trim()} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-2">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setRoleFilter(tab.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium text-sm transition-colors",
              roleFilter === tab.key
                ? "border-[#192B1D] bg-[#192B1D] text-white"
                : "border-border bg-background text-muted-foreground hover:bg-muted/50",
            )}
          >
            {tab.label}
            <span className={cn("rounded-full px-1.5 text-xs", roleFilter === tab.key ? "bg-white/20" : "bg-muted")}>
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
              placeholder="Tìm theo tên, SĐT hoặc vị trí làm việc..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[240px]">Nhân viên</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vị trí làm việc</TableHead>
                <TableHead>Ca làm việc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    Chưa có nhân viên nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((emp) => (
                  <TableRow key={emp.id} className="transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-full font-semibold text-sm",
                            emp.role === "DRIVER" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700",
                          )}
                        >
                          {(emp.name || "?").substring(0, 1).toUpperCase()}
                        </div>
                        <span className="font-semibold text-foreground">{emp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium shadow-none", ROLE_META[emp.role]?.cls)}>
                        {ROLE_META[emp.role]?.label || emp.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {emp.phone ? (
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="size-3.5" /> {emp.phone}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{emp.workLocation || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{SHIFT_META[emp.shift] || "—"}</TableCell>
                    <TableCell>
                      <button type="button" onClick={() => void toggleActive(emp)}>
                        <Badge
                          variant="outline"
                          className={cn(
                            "cursor-pointer font-medium shadow-none",
                            emp.isActive
                              ? "border-emerald-200/60 bg-emerald-50 text-emerald-700"
                              : "border-gray-200/60 bg-gray-50 text-gray-500",
                          )}
                        >
                          {emp.isActive ? "Đang làm việc" : "Tạm nghỉ"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(emp)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => void handleDelete(emp.id)} className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700">
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
