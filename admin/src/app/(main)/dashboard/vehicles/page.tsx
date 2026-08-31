import { useEffect, useState } from "react";

import { Armchair, Bus as BusIcon, Calendar1, CreditCard, Lock, Mail, Phone, Plus, Search, User, Wrench, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const BOOKING_STATUS_META: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: "Đã xác nhận", cls: "border-blue-200 bg-blue-50 text-blue-700" },
  COMPLETED: { label: "Hoàn thành", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  CANCELLED: { label: "Đã huỷ", cls: "border-red-200 bg-red-50 text-red-700" },
  PENDING_PAYMENT: { label: "Chờ duyệt", cls: "border-yellow-200 bg-yellow-50 text-yellow-700" },
};

interface BusForm {
  plateNumber: string;
  type: string;
  capacity: string;
  year: string;
}

const EMPTY_BUS_FORM: BusForm = { plateNumber: "", type: "", capacity: "", year: "" };

const ROLE_META: Record<string, { label: string; cls: string }> = {
  DRIVER: { label: "Tài xế", cls: "border-blue-200 bg-blue-50 text-blue-700" },
  ASSISTANT: { label: "Lơ xe", cls: "border-purple-200 bg-purple-50 text-purple-700" },
};

export default function Page() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [detail, setDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [buses, setBuses] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [assistants, setAssistants] = useState<any[]>([]);

  const [selectedBusId, setSelectedBusId] = useState<string>("");
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>("");
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);

  const [isAddBusOpen, setIsAddBusOpen] = useState(false);
  const [busForm, setBusForm] = useState<BusForm>(EMPTY_BUS_FORM);
  const [isSavingBus, setIsSavingBus] = useState(false);

  const [selectedSeat, setSelectedSeat] = useState<any | null>(null);

  const [floors, setFloors] = useState("1");
  const [rows, setRows] = useState("6");
  const [cols, setCols] = useState("3");
  const [isGeneratingSeats, setIsGeneratingSeats] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<any[]>('/admin/tripSchedules?sort=["departureTime","desc"]&range=[0,199]'),
      api.get<any[]>("/admin/buses?range=[0,199]"),
      api.get<any[]>('/admin/employees?filter={"role":"DRIVER"}&range=[0,199]'),
      api.get<any[]>('/admin/employees?filter={"role":"ASSISTANT"}&range=[0,199]'),
    ])
      .then(([tripData, busData, driverData, assistantData]) => {
        setTrips(tripData || []);
        setBuses(busData || []);
        setDrivers(driverData || []);
        setAssistants(assistantData || []);
      })
      .catch((error) => console.error("Failed to load vehicle assignment data", error))
      .finally(() => setLoading(false));
  }, []);

  function loadDetail(id: string) {
    setSelectedId(id);
    setSelectedSeat(null);
    setDetailLoading(true);
    api
      .get<any>(`/admin/tripSchedules/${id}/vehicle-detail`)
      .then((d) => {
        setDetail(d);
        setSelectedBusId(d.tripSchedule?.busId || "");
        setSelectedDriverId(d.driver?.id || "");
        setSelectedAssistantId(d.assistant?.id || "");
      })
      .catch((error) => console.error("Failed to load vehicle detail", error))
      .finally(() => setDetailLoading(false));
  }

  async function saveAssignment() {
    if (!selectedId) return;
    setIsSavingAssignment(true);
    try {
      await api.put(`/admin/tripSchedules/${selectedId}/assign`, {
        busId: selectedBusId || null,
        driverId: selectedDriverId || null,
        assistantId: selectedAssistantId || null,
      });
      setTrips((prev) => prev.map((t) => (t.id === selectedId ? { ...t, busId: selectedBusId || null } : t)));
      loadDetail(selectedId);
    } catch (error) {
      console.error("Failed to save assignment", error);
    } finally {
      setIsSavingAssignment(false);
    }
  }

  async function handleGenerateSeats() {
    if (!selectedId) return;
    const f = Number(floors) || 1;
    const r = Number(rows) || 1;
    const c = Number(cols) || 1;
    setIsGeneratingSeats(true);
    try {
      await api.post(`/admin/tripSchedules/${selectedId}/generate-seats`, { floors: f, rows: r, cols: c });
      loadDetail(selectedId);
    } catch (error) {
      console.error("Failed to generate seats", error);
    } finally {
      setIsGeneratingSeats(false);
    }
  }

  async function handleAddBus() {
    if (!busForm.plateNumber.trim() || !busForm.type.trim() || !busForm.capacity) return;
    setIsSavingBus(true);
    try {
      const created = await api.post<any>("/admin/buses", {
        plateNumber: busForm.plateNumber.trim(),
        type: busForm.type.trim(),
        capacity: Number(busForm.capacity),
        year: busForm.year ? Number(busForm.year) : null,
      });
      setBuses((prev) => [created, ...prev]);
      setSelectedBusId(created.id);
      setBusForm(EMPTY_BUS_FORM);
      setIsAddBusOpen(false);
    } catch (error) {
      console.error("Failed to create bus", error);
    } finally {
      setIsSavingBus(false);
    }
  }

  const filteredTrips = trips.filter((t) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    const dep = t.trip?.route?.departureCity?.name?.toLowerCase() || "";
    const arr = t.trip?.route?.arrivalCity?.name?.toLowerCase() || "";
    return dep.includes(q) || arr.includes(q) || t.id.toLowerCase().includes(q);
  });

  const selectedTrip = trips.find((t) => t.id === selectedId);
  const parsedSeats = (detail?.seats || []).map((s: any) => {
    const m = /^T(\d+)-(\d+)([A-Z])$/.exec(s.seatNumber);
    return m ? { ...s, floor: Number(m[1]), row: Number(m[2]), col: m[3] } : { ...s, floor: 1, row: 0, col: "?" };
  });
  const floorNums = Array.from(new Set(parsedSeats.map((s: any) => s.floor))).sort((a: number, b: number) => a - b);
  const seatStatusStyle: Record<string, string> = {
    AVAILABLE: "bg-white border-border text-foreground",
    LOCKED: "bg-amber-100 border-amber-300 text-amber-800",
    BOOKED: "bg-red-100 border-red-300 text-red-700",
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  return (
    <div className="-m-4 flex h-[calc(100vh-theme(spacing.16))] overflow-hidden bg-background md:-m-6">
      {/* Left: trip list */}
      <div className="flex w-[340px] shrink-0 flex-col border-border border-r">
        <div className="flex items-center gap-3 border-border border-b p-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#192B1D] text-white">
            <BusIcon className="size-4" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Xe & Nhân Sự</h1>
            <p className="text-muted-foreground text-xs">Gán xe, tài xế, lơ xe theo từng chuyến</p>
          </div>
        </div>
        <div className="border-border border-b p-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-lg border-border bg-muted/50 pl-9 text-sm"
              placeholder="Tìm theo điểm đi/đến..."
            />
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {filteredTrips.map((trip) => {
            const dep = trip.trip?.route?.departureCity?.name ?? "?";
            const arr = trip.trip?.route?.arrivalCity?.name ?? "?";
            const depTime = new Date(trip.departureTime);
            const hasBus = Boolean(trip.busId);
            return (
              <button
                key={trip.id}
                type="button"
                onClick={() => loadDetail(trip.id)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  selectedId === trip.id ? "border-[#192B1D] bg-[#192B1D]/5" : "border-border hover:bg-muted/40",
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-foreground text-sm">
                    #{trip.id.substring(0, 6).toUpperCase()}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium text-[10px] shadow-none",
                      hasBus ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500",
                    )}
                  >
                    {hasBus ? "Đã gán xe" : "Chưa gán xe"}
                  </Badge>
                </div>
                <div className="text-foreground text-sm">
                  {dep} → {arr}
                </div>
                <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
                  <Calendar1 className="size-3" />
                  {depTime.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}{" "}
                  {depTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: detail */}
      <div className="flex-1 overflow-y-auto p-6">
        {!selectedId || !selectedTrip ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Chọn một chuyến xe để gán xe / tài xế / lơ xe
          </div>
        ) : detailLoading || !detail ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">Đang tải chi tiết...</div>
        ) : (
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <div>
              <h2 className="font-bold text-2xl tracking-tight">
                {selectedTrip.trip?.route?.departureCity?.name} → {selectedTrip.trip?.route?.arrivalCity?.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                Khởi hành{" "}
                {new Date(selectedTrip.departureTime).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                — Nhà xe {selectedTrip.trip?.busAgent?.name}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Bus info */}
              <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-border/60 border-b !pb-3">
                  <div className="flex items-center gap-2">
                    <BusIcon className="size-4 text-muted-foreground" />
                    <p className="font-semibold text-sm">Thông tin xe</p>
                  </div>
                  <Dialog open={isAddBusOpen} onOpenChange={(open) => { setIsAddBusOpen(open); if (open) setBusForm(EMPTY_BUS_FORM); }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                        <Plus className="size-3.5" /> Thêm xe
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle>Thêm xe mới</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-2">
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-sm">Biển số xe</label>
                          <Input placeholder="29B-123.45" value={busForm.plateNumber} onChange={(e) => setBusForm({ ...busForm, plateNumber: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-sm">Loại xe</label>
                          <Input placeholder="Giường nằm 40 chỗ" value={busForm.type} onChange={(e) => setBusForm({ ...busForm, type: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm">Số ghế</label>
                            <Input type="number" placeholder="40" value={busForm.capacity} onChange={(e) => setBusForm({ ...busForm, capacity: e.target.value })} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm">Đời xe</label>
                            <Input type="number" placeholder="2022" value={busForm.year} onChange={(e) => setBusForm({ ...busForm, year: e.target.value })} />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          onClick={handleAddBus}
                          disabled={isSavingBus || !busForm.plateNumber.trim() || !busForm.type.trim() || !busForm.capacity}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {isSavingBus ? "Đang lưu..." : "Lưu xe"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground text-xs">Chọn xe</label>
                    <select
                      value={selectedBusId}
                      onChange={(e) => setSelectedBusId(e.target.value)}
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                    >
                      <option value="">— Chưa gán xe —</option>
                      {buses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.plateNumber} — {b.type} ({b.capacity} chỗ)
                        </option>
                      ))}
                    </select>
                  </div>
                  {detail.tripSchedule?.bus && (
                    <div className="space-y-1.5 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Biển số</span>
                        <span className="font-medium">{detail.tripSchedule.bus.plateNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Đời xe</span>
                        <span className="font-medium">{detail.tripSchedule.bus.year || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trạng thái</span>
                        <span className="font-medium">{detail.tripSchedule.bus.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Wrench className="size-3" /> Bảo trì kế tiếp
                        </span>
                        <span className="font-medium">
                          {detail.tripSchedule.bus.nextMaintenance
                            ? new Date(detail.tripSchedule.bus.nextMaintenance).toLocaleDateString("vi-VN")
                            : "Chưa lên lịch"}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Driver */}
              <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2 border-border/60 border-b !pb-3">
                  <User className="size-4 text-muted-foreground" />
                  <p className="font-semibold text-sm">Tài xế</p>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option value="">— Chưa gán tài xế —</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {detail.driver && (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 text-sm">
                        {detail.driver.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{detail.driver.name}</p>
                        {detail.driver.phone && (
                          <p className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Phone className="size-3" /> {detail.driver.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Assistant */}
              <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2 border-border/60 border-b !pb-3">
                  <User className="size-4 text-muted-foreground" />
                  <p className="font-semibold text-sm">Lơ xe</p>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <select
                    value={selectedAssistantId}
                    onChange={(e) => setSelectedAssistantId(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option value="">— Chưa gán lơ xe —</option>
                    {assistants.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  {detail.assistant && (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700 text-sm">
                        {detail.assistant.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{detail.assistant.name}</p>
                        {detail.assistant.phone && (
                          <p className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Phone className="size-3" /> {detail.assistant.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Button onClick={saveAssignment} disabled={isSavingAssignment} className="w-fit gap-2 bg-[#192B1D] text-white hover:bg-[#192B1D]/90">
              {isSavingAssignment ? "Đang lưu..." : "Lưu phân công"}
            </Button>

            {/* Seat map */}
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-border/60 border-b !pb-3">
                <div className="flex items-center gap-2">
                  <Armchair className="size-4 text-muted-foreground" />
                  <p className="font-semibold text-sm">Sơ đồ ghế — {detail.seatsBooked}/{detail.seatsTotal} đã lấp đầy</p>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2.5 rounded-full bg-white ring-1 ring-border" /> Trống
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2.5 rounded-full bg-amber-400" /> Đang giữ
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2.5 rounded-full bg-red-400" /> Đã đặt
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {parsedSeats.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">Chuyến này chưa có sơ đồ ghế</div>
                ) : (
                  <div className="space-y-6">
                    {floorNums.map((floor) => {
                      const colsForFloor = Array.from(new Set(parsedSeats.filter((s: any) => s.floor === floor).map((s: any) => s.col))).sort();
                      const rowsForFloor = Array.from(
                        new Set(parsedSeats.filter((s: any) => s.floor === floor).map((s: any) => s.row)),
                      ).sort((a: number, b: number) => a - b);
                      const midCol = Math.ceil(colsForFloor.length / 2);
                      return (
                        <div key={floor}>
                          {floorNums.length > 1 && <div className="mb-2 text-muted-foreground text-xs font-medium">Tầng {floor}</div>}
                          <div className="grid gap-x-6 gap-y-2" style={{ gridTemplateColumns: `repeat(${colsForFloor.length}, minmax(0, 1fr))` }}>
                            {rowsForFloor.map((row) =>
                              colsForFloor.map((col, colIdx) => {
                                const s = parsedSeats.find((x: any) => x.floor === floor && x.row === row && x.col === col);
                                if (!s) return <div key={`${row}-${col}`} />;
                                return (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setSelectedSeat(s.customer ? s : null)}
                                    title={s.customer ? `${s.seatNumber} — ${s.customer.name} — bấm để xem chi tiết` : `${s.seatNumber} — Trống`}
                                    className={cn(
                                      "flex h-14 w-full flex-col items-center justify-center rounded-md border text-xs font-semibold transition-transform",
                                      colIdx === midCol - 1 && "mr-4",
                                      s.customer && "cursor-pointer hover:scale-105",
                                      selectedSeat?.id === s.id && "ring-2 ring-[#192B1D] ring-offset-1",
                                      seatStatusStyle[s.status] || seatStatusStyle.AVAILABLE,
                                    )}
                                  >
                                    <span>{s.row}{s.col}</span>
                                    {s.customer && <span className="max-w-[90%] truncate text-[9px] font-normal">{s.customer.name}</span>}
                                  </button>
                                );
                              }),
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedSeat && (
                  <div className="mt-5 rounded-xl border border-[#192B1D]/20 bg-[#192B1D]/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="flex items-center gap-2 font-semibold text-sm">
                        <Armchair className="size-4 text-[#192B1D]" />
                        Thông tin khách hàng — Ghế {selectedSeat.seatNumber}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedSeat(null)}
                        className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#192B1D] font-bold text-lg text-white">
                        {selectedSeat.customer.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Tên hành khách</p>
                          <p className="font-medium text-foreground">{selectedSeat.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Tài khoản đặt vé</p>
                          <p className="font-medium text-foreground">{selectedSeat.customer.accountName}</p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Phone className="size-3" /> Số điện thoại
                          </p>
                          <p className="font-medium text-foreground">{selectedSeat.customer.phone || "—"}</p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Mail className="size-3" /> Email
                          </p>
                          <p className="font-medium text-foreground">{selectedSeat.customer.email || "—"}</p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-muted-foreground text-xs">
                            <CreditCard className="size-3" /> Mã đặt vé
                          </p>
                          <p className="font-mono font-medium text-foreground text-xs">
                            #{selectedSeat.booking?.id?.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Tổng tiền</p>
                          <p className="font-medium text-foreground">{selectedSeat.booking?.totalAmount?.toLocaleString("vi-VN")} đ</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Trạng thái đặt vé</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "mt-0.5 font-medium shadow-none",
                              BOOKING_STATUS_META[selectedSeat.booking?.status]?.cls || "border-gray-200 bg-gray-50 text-gray-600",
                            )}
                          >
                            {BOOKING_STATUS_META[selectedSeat.booking?.status]?.label || selectedSeat.booking?.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Ngày đặt</p>
                          <p className="font-medium text-foreground">
                            {selectedSeat.booking?.createdAt &&
                              new Date(selectedSeat.booking.createdAt).toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seat count configuration */}
            <Card className="border-border shadow-sm">
              <CardHeader className="border-border/60 border-b !pb-3">
                <p className="font-semibold text-sm">Chỉnh số lượng chỗ ngồi</p>
                <p className="text-muted-foreground text-xs">
                  Số ghế = số tầng × số hàng × số cột. Thao tác này sẽ xóa sơ đồ ghế cũ (kể cả ghế đã đặt) và tạo lại từ đầu — chỉ dùng khi chưa có ai đặt vé cho chuyến này.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {detail.seatsBooked > 0 && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-xs">
                    <Lock className="size-3.5 shrink-0" />
                    Chuyến này đã có khách đặt ghế — đã khóa thao tác chỉnh số lượng chỗ ngồi để tránh mất dữ liệu đặt vé.
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground text-xs">Số tầng</label>
                    <Input type="number" min={1} max={2} value={floors} onChange={(e) => setFloors(e.target.value)} disabled={detail.seatsBooked > 0} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground text-xs">Số hàng</label>
                    <Input type="number" min={1} value={rows} onChange={(e) => setRows(e.target.value)} disabled={detail.seatsBooked > 0} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground text-xs">Số cột (ghế/hàng)</label>
                    <Input type="number" min={1} max={4} value={cols} onChange={(e) => setCols(e.target.value)} disabled={detail.seatsBooked > 0} />
                  </div>
                </div>
                <div className="text-muted-foreground text-xs">
                  Xem trước: {(Number(floors) || 0) * (Number(rows) || 0) * (Number(cols) || 0)} ghế
                </div>
                <Button
                  onClick={handleGenerateSeats}
                  disabled={isGeneratingSeats || detail.seatsBooked > 0}
                  className="gap-2 bg-[#192B1D] text-white hover:bg-[#192B1D]/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {detail.seatsBooked > 0 ? (
                    <>
                      <Lock className="size-3.5" /> Đã khóa (có ghế đã đặt)
                    </>
                  ) : isGeneratingSeats ? (
                    "Đang tạo..."
                  ) : (
                    "Áp dụng số lượng chỗ ngồi"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
