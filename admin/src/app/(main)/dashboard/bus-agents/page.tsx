import { useEffect, useState } from "react";

import { Bus, Filter, Plus, Search, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function Page() {
  const [busAgents, setBusAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");

  async function load() {
    try {
      const data = await api.get<any[]>("/admin/busAgents?range=[0,99]");
      setBusAgents(data || []);
    } catch (error) {
      console.error("Failed to load bus agents", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleAdd() {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await api.post("/admin/busAgents", { name: name.trim() });
      setName("");
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create bus agent", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/busAgents/${id}`);
      setBusAgents((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete bus agent", error);
    }
  }

  const filteredAgents = busAgents.filter((agent) => agent.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Nhà Xe</h1>
          <p className="text-muted-foreground text-sm">Danh sách các đối tác cung cấp dịch vụ vận tải</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm Nhà Xe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm Nhà Xe Mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="agent-name" className="font-medium text-sm">Tên nhà xe</label>
                <Input id="agent-name" placeholder="Hoang Long" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={isSaving || !name.trim()}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSaving ? "Đang lưu..." : "Lưu nhà xe"}
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
              placeholder="Tìm kiếm nhà xe..."
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
                <TableHead className="w-[300px]">Nhà Xe</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Lượt đánh giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy nhà xe nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className="group cursor-pointer transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 font-bold text-blue-600">
                          {agent.name ? agent.name.substring(0, 2).toUpperCase() : <Bus className="size-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{agent.name}</span>
                          <span className="text-muted-foreground text-xs">ID: {agent.id?.substring(0, 8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex w-max items-center gap-1.5 rounded-md border border-yellow-200/50 bg-yellow-50 px-2 py-0.5 font-medium text-xs text-yellow-700">
                        <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                        <span>{agent.rating?.toFixed(1) ?? "Chưa có"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {agent.reviewCount?.toLocaleString() ?? 0} lượt
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-none"
                      >
                        Hoạt động
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleDelete(agent.id)}
                        className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
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
