import { useCallback, useEffect, useState } from "react";

import { Ban, Search, ShieldCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ADMIN" | "USER" | "BANNED">("ALL");

  const load = useCallback(() => {
    return api
      .get<any[]>('/admin/users?sort=["createdAt","desc"]&range=[0,99]')
      .then((d) => setItems(d || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleBan(user: any) {
    setUpdatingId(user.id);
    try {
      await api.put(`/admin/users/${user.id}`, { isBanned: !user.isBanned });
      setItems((prev) => prev.map((u) => (u.id === user.id ? { ...u, isBanned: !u.isBanned } : u)));
    } catch (error) {
      console.error("Failed to update user ban status", error);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredItems = items.filter((u) => {
    if (statusFilter === "ADMIN" && u.role !== "admin") return false;
    if (statusFilter === "USER" && u.role === "admin") return false;
    if (statusFilter === "BANNED" && !u.isBanned) return false;
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });
  const filterCounts = {
    ALL: items.length,
    ADMIN: items.filter((u) => u.role === "admin").length,
    USER: items.filter((u) => u.role !== "admin").length,
    BANNED: items.filter((u) => u.isBanned).length,
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#192B1D] text-white">
          <Users className="size-5" />
        </div>
        <div className="space-y-0.5">
          <h1 className="font-bold text-2xl tracking-tight">Người Dùng</h1>
          <p className="text-muted-foreground text-sm">Danh sách người dùng đã đăng ký trên hệ thống ({items.length})</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "ALL", label: "Tất cả" },
            { key: "USER", label: "Người dùng" },
            { key: "ADMIN", label: "Admin" },
            { key: "BANNED", label: "Đã khoá" },
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
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[260px]">Họ tên</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((user) => (
                  <TableRow key={user.id} className="transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-full font-semibold text-sm",
                            user.role === "admin" ? "bg-[#192B1D] text-white" : "border border-slate-200 bg-slate-100 text-slate-600",
                          )}
                        >
                          {(user.fullName || "?").substring(0, 1).toUpperCase()}
                        </div>
                        <span className="font-semibold text-foreground">{user.fullName ?? "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.email ?? user.phone ?? "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "admin"
                            ? "border-[#192B1D]/30 bg-[#192B1D]/10 font-medium text-[#192B1D]"
                            : "border-border bg-muted/40 font-medium text-muted-foreground"
                        }
                      >
                        {user.role === "admin" ? "Admin" : "Người dùng"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.isBanned
                            ? "border-red-200 bg-red-50 font-medium text-red-700"
                            : "border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
                        }
                      >
                        {user.isBanned ? "Đã khoá" : "Hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === "admin" ? (
                        <span className="text-muted-foreground text-xs">—</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingId === user.id}
                          onClick={() => void toggleBan(user)}
                          className={
                            user.isBanned
                              ? "gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              : "gap-1.5 border-red-200 text-red-700 hover:bg-red-50"
                          }
                        >
                          {user.isBanned ? <ShieldCheck className="size-4" /> : <Ban className="size-4" />}
                          {user.isBanned ? "Mở khoá" : "Khoá"}
                        </Button>
                      )}
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
