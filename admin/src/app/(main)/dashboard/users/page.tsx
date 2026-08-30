import { useCallback, useEffect, useState } from "react";

import { Ban, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Người dùng</h1>
        <p className="text-muted-foreground text-sm">Danh sách người dùng đã đăng ký trên hệ thống</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({items.length})</CardTitle>
          <CardDescription>Quản lý tài khoản và trạng thái người dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName ?? "N/A"}</TableCell>
                    <TableCell>{user.email ?? user.phone ?? "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role === "admin" ? "Admin" : "Người dùng"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isBanned ? "destructive" : "secondary"}>
                        {user.isBanned ? "Đã khoá" : "Hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</TableCell>
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
