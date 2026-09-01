import { useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  Bus,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Lock,
  Map as MapIcon,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Seat configuration state
  const [seatList, setSeatList] = useState<any[]>([]);
  const [seatLoading, setSeatLoading] = useState(false);

  // Passenger manifest state
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [floors, setFloors] = useState("1");
  const [rows, setRows] = useState("6");
  const [cols, setCols] = useState("3");
  const [isGeneratingSeats, setIsGeneratingSeats] = useState(false);

  // Add modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [routeOptions, setRouteOptions] = useState<any[]>([]);
  const [agentOptions, setAgentOptions] = useState<any[]>([]);
  const [newRouteId, setNewRouteId] = useState("");
  const [newAgentId, setNewAgentId] = useState("");
  const [newBusClass, setNewBusClass] = useState("EXECUTIVE");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isSavingTrip, setIsSavingTrip] = useState(false);
  const [addTripError, setAddTripError] = useState("");

  const load = () => {
    api
      .get<any[]>('/admin/tripSchedules?sort=["departureTime","desc"]&range=[0,999]')
      .then((d) => {
        const data = d || [];
        setItems(data);
        if (data.length > 0) setSelectedId((prev) => prev ?? data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get<any[]>("/admin/routes?range=[0,199]").then((d) => setRouteOptions(d || [])).catch(console.error);
    api.get<any[]>("/admin/busAgents?range=[0,199]").then((d) => setAgentOptions(d || [])).catch(console.error);
  }, []);

  const handleAddTrip = async () => {
    setAddTripError("");
    if (!newRouteId || !newAgentId || !newDate || !newTime) {
      setAddTripError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const route = routeOptions.find((r) => r.id === newRouteId);
    const durationMins = route?.durationMins || 180;
    const depTime = new Date(`${newDate}T${newTime}`);
    if (isNaN(depTime.getTime())) {
      setAddTripError("Ngày giờ khởi hành không hợp lệ.");
      return;
    }
    const arrTime = new Date(depTime.getTime() + durationMins * 60000);

    setIsSavingTrip(true);
    try {
      const trip = await api.post<any>("/admin/trips", {
        busAgentId: newAgentId,
        routeId: newRouteId,
        busClass: newBusClass,
      });
      await api.post<any>("/admin/tripSchedules", {
        tripId: trip.id,
        departureTime: depTime.toISOString(),
        arrivalTime: arrTime.toISOString(),
        durationMins,
      });
      setIsAddOpen(false);
      setNewRouteId("");
      setNewAgentId("");
      setNewBusClass("EXECUTIVE");
      setNewDate("");
      setNewTime("");
      setLoading(true);
      load();
    } catch (error: any) {
      setAddTripError(error?.message || "Không thể tạo chuyến xe.");
    } finally {
      setIsSavingTrip(false);
    }
  };

  const loadSeatCount = async (tripScheduleId: string) => {
    setSeatLoading(true);
    try {
      const data = await api.get<any[]>(
        `/admin/seats?filter=${encodeURIComponent(JSON.stringify({ tripScheduleId }))}&range=[0,999]`,
      );
      setSeatList(data || []);
    } catch (error) {
      console.error("Failed to load seats", error);
      setSeatList([]);
    } finally {
      setSeatLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "seats" && selectedId) {
      void loadSeatCount(selectedId);
      void loadBookings(selectedId);
    }
  }, [activeTab, selectedId]);

  const loadBookings = async (tripScheduleId: string) => {
    setBookingsLoading(true);
    try {
      const data = await api.get<any[]>(
        `/admin/bookings?filter=${encodeURIComponent(JSON.stringify({ tripScheduleId }))}&range=[0,999]`,
      );
      setBookingList(data || []);
    } catch (error) {
      console.error("Failed to load bookings", error);
      setBookingList([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleGenerateSeats = async () => {
    if (!selectedId) return;
    const f = Number(floors) || 1;
    const r = Number(rows) || 1;
    const c = Number(cols) || 1;
    setIsGeneratingSeats(true);
    try {
      await api.post(`/admin/tripSchedules/${selectedId}/generate-seats`, { floors: f, rows: r, cols: c });
      await loadSeatCount(selectedId);
    } catch (error) {
      console.error("Failed to generate seats", error);
    } finally {
      setIsGeneratingSeats(false);
    }
  };

  const now = Date.now();
  const isInTransit = (trip: any) =>
    new Date(trip.departureTime).getTime() <= now && now < new Date(trip.arrivalTime).getTime();
  const isCompleted = (trip: any) => new Date(trip.arrivalTime).getTime() <= now;

  const filteredItems = items.filter((trip) => {
    if (filter === "in-transit" && !isInTransit(trip)) return false;
    if (filter === "completed" && !isCompleted(trip)) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const depCity = trip.trip?.route?.departureCity?.name?.toLowerCase() || "";
      const arrCity = trip.trip?.route?.arrivalCity?.name?.toLowerCase() || "";
      const tripId = trip.id?.toLowerCase() || "";

      if (!depCity.includes(q) && !arrCity.includes(q) && !tripId.includes(q)) {
        return false;
      }
    }

    return true;
  });

  const selectedTrip = items.find((i) => i.id === selectedId);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="-m-4 flex h-[calc(100vh-theme(spacing.16))] overflow-hidden bg-background font-sans text-foreground/80 md:-m-6">
      {/* LEFT SIDEBAR: Trip List */}
      <div className="flex h-full w-[380px] shrink-0 flex-col border-border border-r bg-card">
        <div className="flex items-center justify-between border-border border-b p-4">
          <h2 className="font-semibold text-foreground text-lg">Trips (Lịch trình)</h2>
          <div className="flex gap-2">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="icon" className="h-8 w-8 rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700">
                  <Plus className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Thêm Lịch Trình Mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">Tuyến đường</label>
                    <select
                      value={newRouteId}
                      onChange={(e) => setNewRouteId(e.target.value)}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="">-- Chọn tuyến --</option>
                      {routeOptions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.departureCity?.name} → {r.arrivalCity?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">Nhà xe</label>
                    <select
                      value={newAgentId}
                      onChange={(e) => setNewAgentId(e.target.value)}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="">-- Chọn nhà xe --</option>
                      {agentOptions.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">Loại xe</label>
                    <select
                      value={newBusClass}
                      onChange={(e) => setNewBusClass(e.target.value)}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="ECONOMY">Ghế ngồi (Economy)</option>
                      <option value="EXECUTIVE">Limousine (Executive)</option>
                      <option value="SUPER_EXECUTIVE">Giường nằm (Super Executive)</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-sm">Ngày đi</label>
                      <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-sm">Giờ đi</label>
                      <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                    </div>
                  </div>
                  {addTripError && <p className="text-red-600 text-xs">{addTripError}</p>}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleAddTrip}
                    disabled={isSavingTrip}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isSavingTrip ? "Đang lưu..." : "Lưu chuyến mới"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg bg-slate-100 text-muted-foreground hover:bg-slate-200 hover:text-foreground"
            >
              <SlidersHorizontal className="size-4 text-slate-700" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-border border-b bg-card px-4 py-3 font-medium text-[13px]">
          <div
            onClick={() => setFilter("all")}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${filter === "all" ? "bg-[#192B1D] text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            Tất cả ({items.length})
          </div>
          <div
            onClick={() => setFilter("in-transit")}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${filter === "in-transit" ? "bg-[#192B1D] text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            Đang chạy ({items.filter(isInTransit).length})
          </div>
          <div
            onClick={() => setFilter("completed")}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${filter === "completed" ? "bg-[#192B1D] text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            Đã hoàn thành ({items.filter(isCompleted).length})
          </div>
        </div>

        <div className="border-border border-b bg-card p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-lg border-border bg-muted/50 pl-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Search trips..."
            />
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-4">
          {filteredItems.map((trip, _idx) => {
            const isSelected = trip.id === selectedId;
            const departureCity = trip.trip?.route?.departureCity?.name ?? "Unknown";
            const arrivalCity = trip.trip?.route?.arrivalCity?.name ?? "Unknown";
            const busClass = trip.trip?.busClass ?? "Standard";
            const depTime = new Date(trip.departureTime);

            return (
              <div
                key={trip.id}
                onClick={() => setSelectedId(trip.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${isSelected ? "border-foreground/30 bg-card shadow-sm" : "border-border bg-card hover:border-foreground/20 hover:bg-accent/30"}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-semibold text-foreground text-sm">
                    #TRIP-{trip.id.substring(0, 6).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-blue-600 text-xs">
                    <Clock className="size-3.5" /> Đã lên lịch
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="mb-1 text-muted-foreground text-xs">Việt Nam,</span>
                    <span className="font-medium text-foreground text-sm">{departureCity}</span>
                  </div>
                  <div className="relative flex flex-1 items-center justify-center px-4">
                    <div className="w-full border-border/80 border-t border-dashed" />
                    <Bus className="absolute size-4 bg-card px-0.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="mb-1 text-muted-foreground text-xs">Việt Nam,</span>
                    <span className="font-medium text-foreground text-sm">{arrivalCity}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="mb-1 text-muted-foreground">Loại xe</span>
                    <span className="font-medium text-foreground/80">{busClass}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="mb-1 text-muted-foreground">Khởi hành</span>
                    <span className="font-medium text-foreground/80">
                      {depTime.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}{" "}
                      {depTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredItems.length === 0 && <div className="py-8 text-center text-muted-foreground">No trips found.</div>}
        </div>
      </div>

      {/* RIGHT MAIN PANE */}
      {selectedTrip ? (
        <div className="flex h-full flex-1 flex-col bg-background">
          {/* Map Section */}
          <div className="relative h-[45%] w-full overflow-hidden border-border border-b bg-slate-100">
            {selectedTrip.trip?.route?.departureCity?.name ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${selectedTrip.trip.route.departureCity.name} to ${selectedTrip.trip.route.arrivalCity?.name || ""}`)}&dirflg=d&t=&z=7&ie=UTF8&iwloc=&output=embed`}
                style={{ filter: "grayscale(20%)" }}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <MapIcon className="mb-4 size-12 text-slate-300" />
                <span className="font-medium text-slate-400">No Location Data</span>
              </div>
            )}
          </div>

          {/* Bottom Details Section */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex gap-7 border-border border-b bg-card px-6 font-medium text-[13px]">
              <div
                onClick={() => setActiveTab("overview")}
                className={`cursor-pointer py-4 transition-colors ${activeTab === "overview" ? "border-foreground border-b-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Tổng quan
              </div>
              <div
                onClick={() => setActiveTab("route")}
                className={`cursor-pointer py-4 transition-colors ${activeTab === "route" ? "border-foreground border-b-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Tuyến đường
              </div>
              <div
                onClick={() => setActiveTab("seats")}
                className={`cursor-pointer py-4 transition-colors ${activeTab === "seats" ? "border-foreground border-b-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Ghế ngồi
              </div>
              <div
                onClick={() => setActiveTab("documents")}
                className={`cursor-pointer py-4 transition-colors ${activeTab === "documents" ? "border-foreground border-b-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Tài liệu
              </div>
              <div
                onClick={() => setActiveTab("activity")}
                className={`cursor-pointer py-4 transition-colors ${activeTab === "activity" ? "border-foreground border-b-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Hoạt động
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 space-y-8 overflow-y-auto bg-background p-8">
              {activeTab === "overview" && (
                <>
                  {/* Header Title */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h1 className="flex items-center gap-2 font-bold text-2xl text-foreground">
                        #TRIP-{selectedTrip.id.substring(0, 6).toUpperCase()}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          <Copy className="size-3.5" />
                        </Button>
                      </h1>
                    </div>
                    <div className="flex items-center gap-4 font-medium text-sm">
                      <Badge
                        variant="outline"
                        className="gap-1.5 rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-blue-600 shadow-none"
                      >
                        <div className="size-1.5 rounded-full bg-blue-600" /> Đã lên lịch
                      </Badge>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="text-foreground">Hoàn thành 0%</span>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="text-muted-foreground">
                        Khởi hành:{" "}
                        {new Date(selectedTrip.departureTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Agent & Bus Card */}
                  <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted font-bold text-foreground/70 text-lg">
                        {selectedTrip.trip?.busAgent?.name?.substring(0, 2).toUpperCase() ?? "BA"}
                      </div>
                      <div>
                        <div className="mb-0.5 font-semibold text-foreground">
                          {selectedTrip.trip?.busAgent?.name ?? "Nhà xe chưa xác định"}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          ID: AGT-{selectedTrip.trip?.busAgent?.id?.substring(0, 8)}{" "}
                          <Copy className="size-3 cursor-pointer hover:text-foreground" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 border-border bg-background font-medium text-foreground/80 text-xs shadow-none hover:bg-accent hover:text-foreground"
                      >
                        <Clock className="size-3.5" /> Liên hệ nhà xe
                      </Button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div>
                    <h3 className="mb-4 font-semibold text-foreground text-sm">Chi tiết chuyến đi</h3>
                    <div className="grid grid-cols-4 gap-6 border-border border-b pb-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] text-muted-foreground">Tên tuyến</span>
                        <span className="font-medium text-foreground text-sm">
                          {selectedTrip.trip?.route?.departureCity?.name} -{" "}
                          {selectedTrip.trip?.route?.arrivalCity?.name}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] text-muted-foreground">Thời lượng</span>
                        <span className="font-medium text-foreground text-sm">
                          {Math.floor(selectedTrip.durationMins / 60)}h {selectedTrip.durationMins % 60}m
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] text-muted-foreground">Loại xe</span>
                        <span className="font-medium text-foreground text-sm capitalize">
                          {selectedTrip.trip?.busClass?.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] text-muted-foreground">Trạng thái</span>
                        <span className="font-medium text-foreground text-sm">Chưa khởi hành</span>
                      </div>
                    </div>
                  </div>

                  {/* Alerts Box */}
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <div className="mb-1 flex items-center gap-2 font-semibold text-orange-700 text-sm">
                      <AlertTriangle className="size-4" /> Ưu tiên khởi hành
                    </div>
                    <div className="mb-3 text-orange-900/80 text-sm">
                      Đảm bảo tất cả hành khách lên xe trước 15 phút so với giờ khởi hành. Kiểm tra vé kỹ càng.
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="h-6 rounded border-orange-300 bg-orange-100 px-2.5 text-[11px] text-orange-700 hover:bg-orange-200"
                      >
                        <CheckCircle2 className="mr-1 size-3" /> Ưu tiên lên xe
                      </Badge>
                      <Badge
                        variant="outline"
                        className="h-6 rounded border-orange-300 bg-orange-100 px-2.5 text-[11px] text-orange-700 hover:bg-orange-200"
                      >
                        <FileText className="mr-1 size-3" /> Cần kiểm tra CMND/CCCD
                      </Badge>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "route" && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-foreground text-lg">Điểm dừng & Lịch trình</h3>
                  <div className="relative ml-3 space-y-8 border-border border-l-2 py-4">
                    {/* Stop 1 */}
                    <div className="relative pl-6">
                      <div className="absolute top-1 -left-[9px] h-4 w-4 rounded-full border-4 border-blue-500 bg-white" />
                      <div className="font-semibold text-foreground">
                        {selectedTrip.trip?.route?.departureCity?.name} (Điểm đi)
                      </div>
                      <div className="mt-1 text-muted-foreground text-sm">
                        {new Date(selectedTrip.departureTime).toLocaleString()}
                      </div>
                    </div>
                    {/* Stop 2 */}
                    <div className="relative pl-6">
                      <div className="absolute top-1 -left-[9px] h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
                      <div className="font-semibold text-foreground">Điểm dừng nghỉ / Quốc lộ A1</div>
                      <div className="mt-1 text-muted-foreground text-sm">
                        Dự kiến: {new Date(selectedTrip.departureTime + 1000 * 60 * 60).toLocaleString()}
                      </div>
                    </div>
                    {/* Stop 3 */}
                    <div className="relative pl-6">
                      <div className="absolute top-1 -left-[9px] h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
                      <div className="font-semibold text-foreground">
                        {selectedTrip.trip?.route?.arrivalCity?.name} (Điểm đến)
                      </div>
                      <div className="mt-1 text-muted-foreground text-sm">
                        {new Date(selectedTrip.arrivalTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "seats" && (() => {
                const statusLabel: Record<string, { label: string; cls: string }> = {
                  COMPLETED: { label: "Đã hoàn tất", cls: "border-emerald-200 bg-emerald-50 text-emerald-600" },
                  CONFIRMED: { label: "Đã xác nhận", cls: "border-emerald-200 bg-emerald-50 text-emerald-600" },
                  PENDING_PAYMENT: { label: "Chờ thanh toán", cls: "border-yellow-200 bg-yellow-50 text-yellow-600" },
                  CANCELLED: { label: "Đã hủy", cls: "border-gray-200 bg-gray-50 text-gray-500" },
                };
                const passengerRows = bookingList.flatMap((b) =>
                  (b.seatBookings?.length ? b.seatBookings : [{ seat: null }]).map((sb: any, i: number) => ({
                    key: `${b.id}-${i}`,
                    seat: sb.seat?.seatNumber ?? "-",
                    name: b.passengers?.[i]?.name || b.passengers?.[0]?.name || b.user?.fullName || "-",
                    bookingId: b.id.slice(0, 8).toUpperCase(),
                    status: b.status,
                  })),
                );
                const seatToPassenger = new Map(passengerRows.map((r) => [r.seat, r]));
                const hasBookedSeats = seatList.some((s) => s.status === "BOOKED" || s.status === "LOCKED");

                return (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left: seat map + regenerate form */}
                    <div className="space-y-6">
                      <div className="rounded-xl border border-border bg-card p-5">
                        <div className="text-muted-foreground text-sm">Tổng số ghế hiện tại</div>
                        <div className="mt-1 font-bold text-3xl text-foreground">
                          {seatLoading ? "..." : seatList.length} <span className="text-base font-normal text-muted-foreground">ghế</span>
                        </div>
                        {!seatLoading && seatList.length > 0 && (
                          <div className="mt-3 flex gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <span className="size-2.5 rounded-full bg-emerald-500" /> Trống: {seatList.filter((s) => s.status === "AVAILABLE").length}
                            </span>
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <span className="size-2.5 rounded-full bg-amber-500" /> Đang giữ: {seatList.filter((s) => s.status === "LOCKED").length}
                            </span>
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <span className="size-2.5 rounded-full bg-red-500" /> Đã đặt: {seatList.filter((s) => s.status === "BOOKED").length}
                            </span>
                          </div>
                        )}
                      </div>

                      {!seatLoading && seatList.length > 0 && (() => {
                        const parsed = seatList.map((s) => {
                          const m = /^T(\d+)-(\d+)([A-Z])$/.exec(s.seatNumber);
                          return m ? { ...s, floor: Number(m[1]), row: Number(m[2]), col: m[3] } : { ...s, floor: 1, row: 0, col: "?" };
                        });
                        const floorNums = Array.from(new Set(parsed.map((s) => s.floor))).sort((a, b) => a - b);
                        const statusStyle: Record<string, string> = {
                          AVAILABLE: "bg-white border-border text-foreground",
                          LOCKED: "bg-amber-100 border-amber-300 text-amber-800",
                          BOOKED: "bg-red-100 border-red-300 text-red-700",
                        };
                        return (
                          <div className="rounded-xl border border-border bg-card p-5 space-y-5">
                            <h3 className="font-semibold text-foreground text-sm">Sơ đồ ghế thực tế (đồng bộ với dữ liệu đặt vé)</h3>
                            {floorNums.map((floor) => {
                              const rowsForFloor = Array.from(new Set(parsed.filter((s) => s.floor === floor).map((s) => s.row))).sort((a, b) => a - b);
                              return (
                                <div key={floor} className="space-y-2">
                                  {floorNums.length > 1 && <div className="text-muted-foreground text-xs font-medium">Tầng {floor}</div>}
                                  <div className="flex flex-col gap-2">
                                    {rowsForFloor.map((row) => (
                                      <div key={row} className="flex gap-2">
                                        {parsed
                                          .filter((s) => s.floor === floor && s.row === row)
                                          .sort((a, b) => a.col.localeCompare(b.col))
                                          .map((s) => {
                                            const p = seatToPassenger.get(s.seatNumber);
                                            return (
                                              <div
                                                key={s.id}
                                                title={p ? `${s.seatNumber} — ${p.name} (#${p.bookingId})` : `${s.seatNumber} — ${s.status}`}
                                                className={`flex h-10 w-14 items-center justify-center rounded-md border text-xs font-semibold ${statusStyle[s.status] || statusStyle.AVAILABLE}`}
                                              >
                                                {s.row}{s.col}
                                              </div>
                                            );
                                          })}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}

                      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">Tạo lại sơ đồ ghế</h3>
                          <p className="mt-1 text-muted-foreground text-xs">
                            Số ghế = số tầng × số hàng × số cột. Thao tác này sẽ xóa sơ đồ ghế cũ (kể cả ghế đã đặt) và tạo lại từ đầu — chỉ dùng khi chưa có ai đặt vé cho chuyến này.
                          </p>
                        </div>
                        {hasBookedSeats && (
                          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-xs">
                            <Lock className="size-3.5 shrink-0" />
                            Chuyến này đã có khách đặt/giữ ghế — đã khóa thao tác tạo lại sơ đồ để tránh mất dữ liệu đặt vé.
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-muted-foreground text-xs">Số tầng</label>
                            <Input type="number" min={1} max={2} value={floors} onChange={(e) => setFloors(e.target.value)} disabled={hasBookedSeats} />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-muted-foreground text-xs">Số hàng</label>
                            <Input type="number" min={1} value={rows} onChange={(e) => setRows(e.target.value)} disabled={hasBookedSeats} />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-muted-foreground text-xs">Số cột (ghế/hàng)</label>
                            <Input type="number" min={1} max={4} value={cols} onChange={(e) => setCols(e.target.value)} disabled={hasBookedSeats} />
                          </div>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Xem trước: {(Number(floors) || 0) * (Number(rows) || 0) * (Number(cols) || 0)} ghế
                        </div>
                        <Button
                          onClick={handleGenerateSeats}
                          disabled={isGeneratingSeats || hasBookedSeats}
                          className="gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {hasBookedSeats ? (
                            <>
                              <Lock className="size-3.5" /> Đã khóa (có ghế đã đặt)
                            </>
                          ) : isGeneratingSeats ? (
                            "Đang tạo..."
                          ) : (
                            "Tạo lại sơ đồ ghế"
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Right: passenger list */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground text-lg">Danh sách hành khách</h3>
                        <Button variant="outline" size="sm">
                          Xuất danh sách
                        </Button>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-border bg-card">
                        <table className="w-full text-sm">
                          <thead className="border-border border-b bg-muted/50">
                            <tr>
                              <th className="p-3 text-left font-medium text-muted-foreground">Ghế</th>
                              <th className="p-3 text-left font-medium text-muted-foreground">Tên hành khách</th>
                              <th className="p-3 text-left font-medium text-muted-foreground">Mã đặt vé</th>
                              <th className="p-3 text-left font-medium text-muted-foreground">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {bookingsLoading ? (
                              <tr>
                                <td colSpan={4} className="p-6 text-center text-muted-foreground">Đang tải...</td>
                              </tr>
                            ) : passengerRows.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-6 text-center text-muted-foreground">Chưa có hành khách nào đặt chuyến này</td>
                              </tr>
                            ) : (
                              passengerRows.map((r) => (
                                <tr key={r.key}>
                                  <td className="p-3 font-semibold text-foreground">{r.seat}</td>
                                  <td className="p-3">{r.name}</td>
                                  <td className="p-3 text-muted-foreground">#{r.bookingId}</td>
                                  <td className="p-3">
                                    <Badge variant="outline" className={statusLabel[r.status]?.cls || "border-gray-200 bg-gray-50 text-gray-500"}>
                                      {statusLabel[r.status]?.label || r.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {activeTab === "documents" && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-foreground text-lg">Tài liệu chuyến đi</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex cursor-pointer items-start gap-4 rounded-xl border border-border p-4 hover:bg-muted/30">
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <FileText className="size-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Phân công tài xế</div>
                        <div className="mt-0.5 text-muted-foreground text-sm">PDF • 1.2 MB</div>
                      </div>
                    </div>
                    <div className="flex cursor-pointer items-start gap-4 rounded-xl border border-border p-4 hover:bg-muted/30">
                      <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                        <FileText className="size-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Kiểm định xe</div>
                        <div className="mt-0.5 text-muted-foreground text-sm">PDF • 800 KB</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-foreground text-lg">Nhật ký hoạt động</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <Activity className="size-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">Chuyến đi được lên lịch bởi Admin</div>
                        <div className="mt-1 text-muted-foreground text-xs">2 ngày trước, 10:30</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">Đã phân công tài xế: Lê Hoàng</div>
                        <div className="mt-1 text-muted-foreground text-xs">Hôm qua, 14:00</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center bg-background text-muted-foreground">
          Chọn một chuyến xe để xem chi tiết
        </div>
      )}
    </div>
  );
}
