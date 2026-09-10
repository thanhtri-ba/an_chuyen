import { useEffect, useState } from "react";

import { Armchair, Check, Download, MapPin, ReceiptText, Search, StickyNote, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const AMENITY_LABEL: Record<string, { label: string; unit: string }> = {
  nuocSuoi: { label: "Nước suối", unit: "chai" },
  khanLanh: { label: "Khăn lạnh", unit: "cái" },
  goiTuaCo: { label: "Gối tựa cổ", unit: "cái" },
};

const STATUS_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING_PAYMENT", label: "Chờ duyệt" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "COMPLETED", label: "Hoàn thành" },
  { key: "CANCELLED", label: "Đã huỷ" },
] as const;

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: "Đã xác nhận", cls: "border-blue-200 bg-blue-50 text-blue-700" },
  COMPLETED: { label: "Hoàn thành", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  CANCELLED: { label: "Đã huỷ", cls: "border-red-200 bg-red-50 text-red-700" },
  PENDING_PAYMENT: { label: "Chờ duyệt", cls: "border-yellow-200 bg-yellow-50 text-yellow-700" },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  momo: "MoMo",
  zalopay: "ZaloPay",
  vnpay: "VNPay",
  shopeepay: "ShopeePay",
  card: "Visa/Mastercard",
  atm: "Thẻ ATM/Internet Banking",
  store: "Tiền mặt tại cửa hàng",
  wallet: "Ví An Chuyến",
  cod: "Thanh toán khi lên xe (COD)",
  bank_transfer: "Chuyển khoản ngân hàng (QR)",
  mock: "Thanh toán giả lập",
};

export default function Page() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof STATUS_TABS)[number]["key"]>("ALL");
  const [detailBookingId, setDetailBookingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<any[]>('/admin/bookings?sort=["createdAt","desc"]&range=[0,199]')
      .then((d) => setBookings(d || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleConfirmCod(booking: any) {
    if (!booking.payment?.id) {
      alert("Booking này chưa có bản ghi thanh toán (payment) để xác nhận.");
      return;
    }
    setConfirmingId(booking.id);
    try {
      await api.post("/payments/cod/confirm", { paymentId: booking.payment.id });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "CONFIRMED", payment: { ...b.payment, status: "PAID" } } : b,
        ),
      );
    } catch (error: any) {
      alert(error.message || "Không thể xác nhận thanh toán.");
    } finally {
      setConfirmingId(null);
    }
  }

  // Flatten: one row per passenger/seat rather than per booking, so seat + passenger name are visible.
  const rows = bookings.flatMap((b) => {
    const route = b.tripSchedule?.trip?.route;
    const routeLabel = route ? `${route.departureCity?.name ?? "?"} → ${route.arrivalCity?.name ?? "?"}` : "—";
    const agentName = b.tripSchedule?.trip?.busAgent?.name ?? "—";
    const departureTime = b.tripSchedule?.departureTime;
    const seatEntries = b.seatBookings?.length ? b.seatBookings : [{ seat: null }];
    return seatEntries.map((sb: any, i: number) => ({
      key: `${b.id}-${i}`,
      bookingId: b.id,
      paymentId: b.payment?.id as string | undefined,
      passengerName: b.passengers?.[i]?.name || b.passengers?.[0]?.name || b.user?.fullName || "—",
      customerName: b.user?.fullName ?? b.userId?.slice(0, 8),
      seat: sb.seat?.seatNumber ?? "—",
      routeLabel,
      agentName,
      departureTime,
      status: b.status,
      totalAmount: b.totalAmount,
      createdAt: b.createdAt,
      paymentMethod: b.payment?.method as string | undefined,
    }));
  });

  const filteredRows = rows.filter((r) => {
    if (activeTab !== "ALL" && r.status !== activeTab) return false;
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      r.passengerName?.toLowerCase().includes(q) ||
      r.customerName?.toLowerCase().includes(q) ||
      r.seat?.toLowerCase().includes(q) ||
      r.routeLabel?.toLowerCase().includes(q) ||
      r.bookingId?.toLowerCase().includes(q)
    );
  });

  const tabCounts = Object.fromEntries(
    STATUS_TABS.map(({ key }) => [key, key === "ALL" ? rows.length : rows.filter((r) => r.status === key).length]),
  );

  function exportCsv() {
    const header = ["Hành khách", "Ghế", "Tuyến xe", "Nhà xe", "Giờ khởi hành", "Tổng tiền", "Trạng thái", "Mã đặt vé", "Ngày đặt"];
    const data = filteredRows.map((r) => [
      r.passengerName,
      r.seat,
      r.routeLabel,
      r.agentName,
      r.departureTime ? new Date(r.departureTime).toISOString() : "",
      r.totalAmount,
      STATUS_LABEL[r.status]?.label || r.status,
      r.bookingId,
      new Date(r.createdAt).toISOString(),
    ]);
    const csv = [header, ...data]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dat-ve-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#192B1D] text-white">
            <ReceiptText className="size-5" />
          </div>
          <div className="space-y-0.5">
            <h1 className="font-bold text-2xl tracking-tight">Đặt Vé</h1>
            <p className="text-muted-foreground text-sm">
              Quản lý đơn đặt vé và hành khách trên toàn bộ chuyến xe — dữ liệu thật, tổng hợp từ các đơn đặt vé
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2 border-border bg-background shadow-sm" onClick={exportCsv}>
          <Download className="size-4" /> Xuất CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium text-sm transition-colors",
              activeTab === tab.key
                ? "border-[#192B1D] bg-[#192B1D] text-white"
                : "border-border bg-background text-muted-foreground hover:bg-muted/50",
            )}
          >
            {tab.label}
            <span className={cn("rounded-full px-1.5 text-xs", activeTab === tab.key ? "bg-white/20" : "bg-muted")}>
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
              placeholder="Tìm theo tên hành khách, ghế, tuyến, mã đặt vé..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table className="[&_td]:py-4 [&_th]:h-12">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[240px]">Hành khách</TableHead>
                <TableHead>Ghế</TableHead>
                <TableHead>Tuyến xe</TableHead>
                <TableHead>Nhà xe</TableHead>
                <TableHead>Giờ khởi hành</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Mã đặt vé</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy đơn đặt vé nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((r) => (
                  <TableRow
                    key={r.key}
                    className="cursor-pointer transition-colors hover:bg-muted/30"
                    onClick={() => setDetailBookingId(r.bookingId)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-600">
                          <User className="size-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{r.passengerName}</span>
                          {r.customerName && r.customerName !== r.passengerName && (
                            <span className="text-muted-foreground text-xs">KH: {r.customerName}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 font-mono font-semibold text-foreground text-sm">
                        <Armchair className="size-3.5 text-muted-foreground" /> {r.seat}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{r.routeLabel}</TableCell>
                    <TableCell className="text-sm">{r.agentName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {r.departureTime
                        ? new Date(r.departureTime).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{r.totalAmount.toLocaleString("vi-VN")} đ</TableCell>
                    <TableCell className="text-sm">
                      {r.paymentMethod ? (
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-medium shadow-none",
                              r.paymentMethod === "store" || r.paymentMethod === "cod"
                                ? "border-orange-200 bg-orange-50 text-orange-700"
                                : "border-border bg-muted/40 text-muted-foreground",
                            )}
                          >
                            {PAYMENT_METHOD_LABEL[r.paymentMethod] || r.paymentMethod}
                          </Badge>
                          {r.paymentMethod === "mock" && (
                            <Badge variant="outline" className="border-purple-200 bg-purple-50 font-semibold text-[10px] text-purple-700 shadow-none">
                              DEMO
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium shadow-none", STATUS_LABEL[r.status]?.cls || "border-gray-200 bg-gray-50 text-gray-600")}>
                        {STATUS_LABEL[r.status]?.label || r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-xs">
                      #{r.bookingId.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(r.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.status === "PENDING_PAYMENT" ? (
                        <Button
                          size="sm"
                          className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                          disabled={confirmingId === r.bookingId}
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleConfirmCod({ id: r.bookingId, payment: { id: r.paymentId } });
                          }}
                        >
                          <Check className="size-4" />
                          {confirmingId === r.bookingId ? "Đang duyệt..." : "Duyệt"}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BookingDetailSheet
        booking={bookings.find((b) => b.id === detailBookingId) ?? null}
        open={detailBookingId != null}
        onOpenChange={(open) => !open && setDetailBookingId(null)}
      />
    </div>
  );
}

function BookingDetailSheet({
  booking,
  open,
  onOpenChange,
}: {
  booking: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!booking) return null;

  const route = booking.tripSchedule?.trip?.route;
  const routeLabel = route ? `${route.departureCity?.name ?? "?"} → ${route.arrivalCity?.name ?? "?"}` : "—";
  const agentName = booking.tripSchedule?.trip?.busAgent?.name ?? "—";
  const departureTime = booking.tripSchedule?.departureTime;
  const busClass = booking.tripSchedule?.trip?.busClass;

  const amenities = booking.amenities as
    | { nuocSuoi?: number; khanLanh?: number; goiTuaCo?: number; oCamUSB?: boolean }
    | null
    | undefined;
  const amenityRows = amenities
    ? (Object.keys(AMENITY_LABEL) as (keyof typeof AMENITY_LABEL)[])
        .map((key) => ({ key, qty: amenities[key] ?? 0 }))
        .filter((r) => r.qty > 0)
    : [];
  const hasUsb = !!amenities?.oCamUSB;
  const hasAnyAmenity = amenityRows.length > 0 || hasUsb;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-border border-b">
          <SheetTitle className="flex items-center gap-2">
            Chi tiết đặt vé
            <span className="font-mono text-muted-foreground text-xs">#{booking.id.slice(0, 8).toUpperCase()}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4">
          {/* Thông tin chuyến đi — luôn ở trên cùng */}
          <section className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <MapPin className="size-4 text-muted-foreground" /> Thông tin chuyến đi
            </div>
            <div className="font-semibold text-foreground">{routeLabel}</div>
            <div className="text-muted-foreground text-sm">
              {departureTime
                ? new Date(departureTime).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
              {busClass ? ` · ${busClass}` : ""}
            </div>
            <div className="text-muted-foreground text-sm">Nhà xe: {agentName}</div>
            <Badge
              variant="outline"
              className={cn("w-fit font-medium shadow-none", STATUS_LABEL[booking.status]?.cls || "border-gray-200 bg-gray-50 text-gray-600")}
            >
              {STATUS_LABEL[booking.status]?.label || booking.status}
            </Badge>
          </section>

          {/* Khách hàng & Ghế */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <User className="size-4 text-muted-foreground" /> Khách hàng & Ghế
            </div>
            <div className="rounded-lg border border-border p-3 text-sm">
              <div className="font-medium text-foreground">{booking.user?.fullName ?? booking.userId?.slice(0, 8)}</div>
              {booking.user?.phone && <div className="text-muted-foreground">{booking.user.phone}</div>}
            </div>
            <div className="flex flex-col gap-2">
              {(booking.seatBookings ?? []).map((sb: any, i: number) => (
                <div key={sb.id ?? i} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                  <span className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
                    <Armchair className="size-3.5 text-muted-foreground" /> {sb.seat?.seatNumber ?? "—"}
                  </span>
                  <span className="text-muted-foreground">{booking.passengers?.[i]?.name ?? "—"}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tiện ích — trước đây khách chọn ở bước đặt vé nhưng không được lưu lại,
              nên mục này luôn trống; giờ đã lưu vào Booking.amenities khi tạo đơn. */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <ReceiptText className="size-4 text-muted-foreground" /> Tiện ích đã chọn
            </div>
            {hasAnyAmenity ? (
              <div className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm">
                {amenityRows.map((r) => (
                  <div key={r.key} className="flex items-center justify-between">
                    <span className="text-foreground">{AMENITY_LABEL[r.key].label}</span>
                    <span className="text-muted-foreground">
                      {r.qty} {AMENITY_LABEL[r.key].unit}
                    </span>
                  </div>
                ))}
                {hasUsb && (
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Ổ cắm USB</span>
                    <span className="text-muted-foreground">Miễn phí</span>
                  </div>
                )}
                {booking.amenitiesTotal > 0 && (
                  <div className="flex items-center justify-between border-border border-t pt-2 font-medium">
                    <span className="text-foreground">Tổng tiện ích</span>
                    <span className="text-foreground">{Number(booking.amenitiesTotal).toLocaleString("vi-VN")} đ</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-3 text-muted-foreground text-sm">
                Khách không chọn tiện ích thêm nào.
              </div>
            )}
          </section>

          {booking.notes && (
            <section className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <StickyNote className="size-4 text-muted-foreground" /> Ghi chú của khách
              </div>
              <div className="rounded-lg border border-border p-3 text-muted-foreground text-sm">{booking.notes}</div>
            </section>
          )}

          <section className="flex items-center justify-between border-border border-t pt-4">
            <span className="font-semibold text-foreground">Tổng tiền</span>
            <span className="font-bold text-foreground text-lg">{Number(booking.totalAmount).toLocaleString("vi-VN")} đ</span>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
