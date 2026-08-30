import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get<any[]>("/admin/users")
      .then((d) => setItems(d || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
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
