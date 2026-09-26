import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { DragDropProvider, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/react";
import { ArrowRight, ChevronLeft, ChevronRight, GripVertical, Lock, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

// "Xếp lịch trong ngày": drag a Trip (route + operator + bus class) from the left
// column onto a 30-minute slot to create that day's schedule — the backend clones
// seats/prices/pick-up points from the trip's latest schedule (day-planner.service.ts).
// Unbooked schedules can be dragged to another slot or deleted; booked ones are locked.

interface City {
  name: string;
}
interface TripOption {
  id: string;
  busClass: string;
  busAgent: { id: string; name: string };
  route: { departureCity: City; arrivalCity: City };
  _count: { schedules: number };
}
interface DaySchedule {
  id: string;
  departureTime: string;
  arrivalTime: string;
  trip: Omit<TripOption, "_count">;
  bus: { plateNumber: string } | null;
  _count: { bookings: number; parcels: number; seats: number };
}
type DragData = { kind: "trip"; tripId: string } | { kind: "schedule"; scheduleId: string; departureTime: string };

const TZ = "Asia/Ho_Chi_Minh";
const SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  return `${h}:${i % 2 === 0 ? "00" : "30"}`;
});

const todayVN = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
const timeVN = (iso: string) =>
  new Intl.DateTimeFormat("vi-VN", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(
    new Date(iso),
  );
const slotOf = (iso: string) => {
  const [h, m] = timeVN(iso).split(":");
  return `${h}:${Number(m) < 30 ? "00" : "30"}`;
};
const shiftDate = (date: string, days: number) => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
const routeLabel = (t: Pick<TripOption, "route">) => `${t.route.departureCity.name} → ${t.route.arrivalCity.name}`;
const isLocked = (s: DaySchedule) => s._count.bookings > 0 || s._count.parcels > 0;

function TripCard({ trip }: { trip: TripOption }) {
  const { ref, isDragging } = useDraggable({
    id: `trip:${trip.id}`,
    data: { kind: "trip", tripId: trip.id } satisfies DragData,
  });
  return (
    <div
      ref={ref}
      className={`flex cursor-grab items-start gap-2 rounded-lg border bg-card p-3 text-sm shadow-xs transition hover:border-blue-400 active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
    >
      <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="truncate font-medium">{routeLabel(trip)}</div>
        <div className="truncate text-muted-foreground text-xs">{trip.busAgent.name}</div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {trip.busClass}
          </Badge>
          {trip._count.schedules === 0 && <span className="text-[10px] text-amber-600">Chưa có lịch mẫu</span>}
        </div>
      </div>
    </div>
  );
}

function ScheduleCard({
  schedule,
  onDelete,
  busy,
}: {
  schedule: DaySchedule;
  onDelete: (s: DaySchedule) => void;
  busy: boolean;
}) {
  const locked = isLocked(schedule);
  const { ref, isDragging } = useDraggable({
    id: `schedule:${schedule.id}`,
    data: { kind: "schedule", scheduleId: schedule.id, departureTime: schedule.departureTime } satisfies DragData,
    disabled: locked || busy,
  });
  return (
    <div
      ref={ref}
      title={locked ? "Đã có khách đặt vé/gửi hàng — không thể dời hoặc xoá" : "Kéo sang khung giờ khác để dời lịch"}
      className={`flex min-w-56 items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs shadow-xs ${
        locked ? "border-slate-300 bg-slate-100" : "cursor-grab border-blue-200 bg-blue-50 active:cursor-grabbing"
      } ${isDragging ? "opacity-50" : ""}`}
    >
      {locked ? (
        <Lock className="size-3.5 shrink-0 text-slate-500" />
      ) : (
        <GripVertical className="size-3.5 shrink-0 text-blue-400" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 truncate font-medium">
          {timeVN(schedule.departureTime)}
          <ArrowRight className="size-3" />
          {timeVN(schedule.arrivalTime)} · {routeLabel(schedule.trip)}
        </div>
        <div className="truncate text-muted-foreground">
          {schedule.trip.busAgent.name} · {schedule.trip.busClass} · {schedule._count.bookings} vé/
          {schedule._count.seats} ghế
          {schedule.bus ? ` · ${schedule.bus.plateNumber}` : ""}
        </div>
      </div>
      {!locked && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(schedule)}
          className="rounded p-1 text-muted-foreground hover:bg-red-100 hover:text-red-600 disabled:opacity-40"
          aria-label="Xoá lịch"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  );
}

function SlotRow({ slot, children }: { slot: string; children: ReactNode }) {
  const { ref, isDropTarget } = useDroppable({ id: `slot:${slot}` });
  return (
    <div
      ref={ref}
      className={`flex min-h-12 items-start gap-3 border-b px-3 py-1.5 transition-colors ${isDropTarget ? "bg-blue-100/70" : ""} ${
        slot.endsWith(":00") ? "border-b-muted" : "border-b-muted/40 border-dashed"
      }`}
    >
      <span className="w-12 shrink-0 pt-1.5 font-mono text-muted-foreground text-xs">{slot}</span>
      <div className="flex flex-1 flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function Page() {
  const [date, setDate] = useState(todayVN);
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [schedules, setSchedules] = useState<DaySchedule[]>([]);
  const [search, setSearch] = useState("");
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadDay = useCallback(async () => {
    try {
      setSchedules(await api.get<DaySchedule[]>(`/admin/day-planner/schedules?date=${date}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được lịch chạy.");
    }
  }, [date]);

  useEffect(() => {
    api
      .get<TripOption[]>("/admin/day-planner/trips")
      .then(setTrips)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    setLoading(true);
    void loadDay().finally(() => setLoading(false));
  }, [loadDay]);

  const agents = useMemo(() => {
    const byId = new Map(trips.map((t) => [t.busAgent.id, t.busAgent.name]));
    return [...byId].sort((a, b) => a[1].localeCompare(b[1]));
  }, [trips]);

  const visibleTrips = useMemo(() => {
    const q = search.trim().toLowerCase();
    return trips.filter(
      (t) =>
        (!agentId || t.busAgent.id === agentId) &&
        (!q || `${routeLabel(t)} ${t.busAgent.name} ${t.busClass}`.toLowerCase().includes(q)),
    );
  }, [trips, search, agentId]);

  const bySlot = useMemo(() => {
    const map = new Map<string, DaySchedule[]>();
    for (const s of schedules) {
      if (agentId && s.trip.busAgent.id !== agentId) continue;
      const key = slotOf(s.departureTime);
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return map;
  }, [schedules, agentId]);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await action();
      await loadDay();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Thao tác thất bại.");
    } finally {
      setBusy(false);
    }
  };

  const handleDragEnd: (event: DragEndEvent) => void = ({ operation, canceled }) => {
    const targetId = operation.target?.id;
    const data = operation.source?.data as DragData | undefined;
    if (canceled || !data || typeof targetId !== "string" || !targetId.startsWith("slot:")) return;

    const departure = new Date(`${date}T${targetId.slice(5)}:00+07:00`);
    if (departure.getTime() < Date.now()) {
      setError("Không thể xếp lịch vào khung giờ đã qua.");
      return;
    }
    if (data.kind === "trip") {
      void run(() =>
        api.post("/admin/day-planner/schedules", { tripId: data.tripId, departureTime: departure.toISOString() }),
      );
    } else if (new Date(data.departureTime).getTime() !== departure.getTime()) {
      void run(() =>
        api.put(`/admin/day-planner/schedules/${data.scheduleId}`, { departureTime: departure.toISOString() }),
      );
    }
  };

  const handleDelete = (s: DaySchedule) => {
    if (!window.confirm(`Xoá lịch ${timeVN(s.departureTime)} · ${routeLabel(s.trip)}?`)) return;
    void run(() => api.delete(`/admin/day-planner/schedules/${s.id}`));
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 p-2">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Xếp Lịch Trong Ngày</h1>
          <p className="text-muted-foreground text-sm">
            Kéo chuyến xe ở cột trái thả vào khung giờ để tạo lịch chạy. Kéo lịch sang giờ khác để dời.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDate((d) => shiftDate(d, -1))}
            aria-label="Ngày trước"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Input
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="w-40"
          />
          <Button variant="outline" size="icon" onClick={() => setDate((d) => shiftDate(d, 1))} aria-label="Ngày sau">
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="outline" onClick={() => setDate(todayVN())}>
            Hôm nay
          </Button>
          <select
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            aria-label="Lọc nhà xe"
          >
            <option value="">Tất cả nhà xe</option>
            {agents.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-2 text-red-700 text-sm">
          {error}
          <button type="button" onClick={() => setError("")} className="font-medium underline">
            Đóng
          </button>
        </div>
      )}

      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="py-0">
            <CardContent className="flex h-[calc(100vh-14rem)] flex-col gap-3 p-3">
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm tuyến, nhà xe…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="text-muted-foreground text-xs">{visibleTrips.length} chuyến có sẵn</div>
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {visibleTrips.map((t) => (
                  <TripCard key={t.id} trip={t} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardContent className="relative h-[calc(100vh-14rem)] overflow-y-auto p-0">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-3 py-2 text-sm">
                <span className="font-medium">
                  {new Intl.DateTimeFormat("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(`${date}T12:00:00+07:00`))}
                </span>
                <span className="text-muted-foreground">
                  {loading ? "Đang tải…" : `${schedules.length} lịch chạy`}
                  {busy && " · Đang lưu…"}
                </span>
              </div>
              {SLOTS.map((slot) => (
                <SlotRow key={slot} slot={slot}>
                  {(bySlot.get(slot) ?? []).map((s) => (
                    <ScheduleCard key={s.id} schedule={s} onDelete={handleDelete} busy={busy} />
                  ))}
                </SlotRow>
              ))}
            </CardContent>
          </Card>
        </div>
      </DragDropProvider>
    </div>
  );
}
