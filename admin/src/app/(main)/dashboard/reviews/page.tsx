import { useCallback, useEffect, useState } from "react";

import { Check, Search, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api.get<any[]>("/admin/reviews");
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleApprove(id: string) {
    try {
      await api.put(`/admin/reviews/${id}`, { isApproved: true });
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isApproved: true } : i)));
    } catch (error) {
      console.error("Failed to approve review", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/reviews/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete review", error);
    }
  }

  const filtered = items.filter(
    (r) =>
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2">
      <div className="space-y-1">
        <h1 className="font-bold text-2xl tracking-tight">Đánh Giá</h1>
        <p className="text-muted-foreground text-sm">Duyệt và quản lý đánh giá của khách hàng</p>
      </div>

      <Card className="overflow-hidden rounded-xl border-border shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-border border-b bg-card p-4 sm:flex-row">
          <div className="relative w-full sm:w-96">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-lg border-border bg-muted/50 pl-9 text-foreground placeholder:text-muted-foreground"
              placeholder="Tìm theo nội dung hoặc khách hàng..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[220px]">Khách hàng</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    Chưa có đánh giá nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium text-sm">
                      {r.user?.fullName || r.user?.email || "Ẩn danh"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                        {r.rating}/5
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground text-sm">
                      {r.comment || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          r.isApproved
                            ? "border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-none"
                            : "border-yellow-200/60 bg-yellow-50 font-medium text-yellow-700 shadow-none"
                        }
                      >
                        {r.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!r.isApproved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => void handleApprove(r.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-emerald-600"
                        >
                          <Check className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleDelete(r.id)}
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
