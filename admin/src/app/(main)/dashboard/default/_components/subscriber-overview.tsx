"use client";

import { useEffect, useState } from "react";

import { Download, Ticket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

const statusColor: Record<string, string> = {
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export function SubscriberOverview() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<any[]>("/admin/bookings")
      .then((d) => {
        const sorted = (d || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(sorted.slice(0, 7)); // Show top 7 recent bookings
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="border-b bg-muted/10 pb-4">
        <CardTitle className="flex items-center gap-2 leading-none">
          <Ticket className="size-5 text-primary" /> Giao dịch vé gần đây
        </CardTitle>
        <CardDescription>Danh sách các giao dịch đặt vé xe mới nhất trên hệ thống.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" className="shadow-sm">
            <Download className="mr-1.5 size-4" />
            Xuất CSV
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px] pl-6">Khách hàng</TableHead>
              <TableHead>Mã vé</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="pr-6 text-right">Ngày đặt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  Chưa có giao dịch nào
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b.id} className="group cursor-pointer transition-colors hover:bg-muted/30">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-semibold text-primary text-xs">
                        {b.user?.fullName ? b.user.fullName.substring(0, 1).toUpperCase() : "K"}
                      </div>
                      <span className="font-medium text-foreground">{b.user?.fullName ?? "Khách vãng lai"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-border bg-muted/30 font-mono text-[11px] text-muted-foreground"
                    >
                      {b.id.substring(0, 8).toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{b.totalAmount.toLocaleString("vi-VN")} đ</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2 py-0.5 font-medium shadow-none ${statusColor[b.status] ?? "bg-slate-50 text-slate-700"}`}
                    >
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right text-muted-foreground text-sm">
                    {new Date(b.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
