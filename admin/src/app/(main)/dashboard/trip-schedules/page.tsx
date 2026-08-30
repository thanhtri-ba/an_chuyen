import { useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  Bus,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
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

  // Add modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRoute, setNewRoute] = useState("");
  const [newAgent, setNewAgent] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    api
      .get<any[]>("/admin/tripSchedules")
      .then((d) => {
        const data = d || [];
        setItems(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddTrip = () => {
    const newId = Math.random().toString(36).substring(2, 10);
    let depTime = new Date();
    if (newDate && newTime) {
      depTime = new Date(`${newDate}T${newTime}`);
    }

    const newItem = {
      id: newId,
      departureTime: depTime.toISOString(),
      arrivalTime: new Date(depTime.getTime() + 1000 * 60 * 60 * 5).toISOString(),
      durationMins: 300,
      trip: {
        busClass: "Standard",
        busAgent: { name: newAgent || "Unknown Agent", id: Math.random().toString(36).substring(2, 10) },
        route: {
          departureCity: { name: newRoute.split("-")[0]?.trim() || "Unknown" },
          arrivalCity: { name: newRoute.split("-")[1]?.trim() || "Unknown" },
        },
      },
    };

    setItems([newItem, ...items]);
    setSelectedId(newId);
    setIsAddOpen(false);

    // Reset form
    setNewRoute("");
    setNewAgent("");
    setNewDate("");
    setNewTime("");
  };

  // Basic mock filtering
  const filteredItems = items.filter((trip) => {
    if (filter === "in-transit") return false; // Mock
    if (filter === "completed") return false; // Mock

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
                    <Input
                      placeholder="Ví dụ: TPHCM - Cà Mau"
                      value={newRoute}
                      onChange={(e) => setNewRoute(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">Nhà xe</label>
                    <Input placeholder="Tên nhà xe" value={newAgent} onChange={(e) => setNewAgent(e.target.value)} />
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
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleAddTrip}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Lưu chuyến mới
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
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            All ({items.length})
          </div>
          <div
            onClick={() => setFilter("in-transit")}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${filter === "in-transit" ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            In Transit (0)
          </div>
          <div
            onClick={() => setFilter("completed")}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${filter === "completed" ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            Completed (0)
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
                    <Clock className="size-3.5" /> Scheduled
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="mb-1 text-muted-foreground text-xs">Vietnam,</span>
                    <span className="font-medium text-foreground text-sm">{departureCity}</span>
                  </div>
                  <div className="relative flex flex-1 items-center justify-center px-4">
                    <div className="w-full border-border/80 border-t border-dashed" />
                    <Bus className="absolute size-4 bg-card px-0.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="mb-1 text-muted-foreground text-xs">Vietnam,</span>
                    <span className="font-medium text-foreground text-sm">{arrivalCity}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="mb-1 text-muted-foreground">Bus Type</span>
                    <span className="font-medium text-foreground/80">{busClass}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="mb-1 text-muted-foreground">Departure</span>
                    <span className="font-medium text-foreground/80">
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
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${selectedTrip.trip.route.departureCity.name} to ${selectedTrip.trip.route.arrivalCity?.name || ""}`)}&t=&z=7&ie=UTF8&iwloc=&output=embed`}
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
                Overview
              </div>
              <div
                onClick={() => setActiveTab("route")}
                className={`cursor-pointer py-4 transition-colors ${activeTab === "route" ? "border-foreground border-b-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Route
              </div>
              <div
                onClick={() => setActiveTab("passengers")}
                className={`cursor-pointer py-4 transition-colors ${activeTab === "passengers" ? "border-foreground border-b-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Passengers
              </div>
              <div
                onClick={() => setActiveTab("documents")}
                className={`cursor-pointer py-4 transition-colors ${activeTab === "documents" ? "border-foreground border-b-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Documents
              </div>
              <div
                onClick={() => setActiveTab("activity")}
                className={`cursor-pointer py-4 transition-colors ${activeTab === "activity" ? "border-foreground border-b-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Activity
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
                        <div className="size-1.5 rounded-full bg-blue-600" /> Scheduled
                      </Badge>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="text-foreground">0% complete</span>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="text-muted-foreground">
                        DEP:{" "}
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
                          {selectedTrip.trip?.busAgent?.name ?? "Unknown Agent"}
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
                        <Clock className="size-3.5" /> Call Agent Support
                      </Button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div>
                    <h3 className="mb-4 font-semibold text-foreground text-sm">Trip details</h3>
                    <div className="grid grid-cols-4 gap-6 border-border border-b pb-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] text-muted-foreground">Route Name</span>
                        <span className="font-medium text-foreground text-sm">
                          {selectedTrip.trip?.route?.departureCity?.name} -{" "}
                          {selectedTrip.trip?.route?.arrivalCity?.name}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground text-sm">
                          {Math.floor(selectedTrip.durationMins / 60)}h {selectedTrip.durationMins % 60}m
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] text-muted-foreground">Bus Type</span>
                        <span className="font-medium text-foreground text-sm capitalize">
                          {selectedTrip.trip?.busClass?.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] text-muted-foreground">Status</span>
                        <span className="font-medium text-foreground text-sm">Not started</span>
                      </div>
                    </div>
                  </div>

                  {/* Alerts Box */}
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <div className="mb-1 flex items-center gap-2 font-semibold text-orange-700 text-sm">
                      <AlertTriangle className="size-4" /> Priority Departure
                    </div>
                    <div className="mb-3 text-orange-900/80 text-sm">
                      Ensure all passengers are boarded 15 mins prior to departure time. Check tickets thoroughly.
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="h-6 rounded border-orange-300 bg-orange-100 px-2.5 text-[11px] text-orange-700 hover:bg-orange-200"
                      >
                        <CheckCircle2 className="mr-1 size-3" /> Boarding Priority
                      </Badge>
                      <Badge
                        variant="outline"
                        className="h-6 rounded border-orange-300 bg-orange-100 px-2.5 text-[11px] text-orange-700 hover:bg-orange-200"
                      >
                        <FileText className="mr-1 size-3" /> ID Check Required
                      </Badge>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "route" && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-foreground text-lg">Route Stops & Schedule</h3>
                  <div className="relative ml-3 space-y-8 border-border border-l-2 py-4">
                    {/* Stop 1 */}
                    <div className="relative pl-6">
                      <div className="absolute top-1 -left-[9px] h-4 w-4 rounded-full border-4 border-blue-500 bg-white" />
                      <div className="font-semibold text-foreground">
                        {selectedTrip.trip?.route?.departureCity?.name} (Departure)
                      </div>
                      <div className="mt-1 text-muted-foreground text-sm">
                        {new Date(selectedTrip.departureTime).toLocaleString()}
                      </div>
                    </div>
                    {/* Stop 2 */}
                    <div className="relative pl-6">
                      <div className="absolute top-1 -left-[9px] h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
                      <div className="font-semibold text-foreground">Rest Stop / Highway A1</div>
                      <div className="mt-1 text-muted-foreground text-sm">
                        Est: {new Date(selectedTrip.departureTime + 1000 * 60 * 60).toLocaleString()}
                      </div>
                    </div>
                    {/* Stop 3 */}
                    <div className="relative pl-6">
                      <div className="absolute top-1 -left-[9px] h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
                      <div className="font-semibold text-foreground">
                        {selectedTrip.trip?.route?.arrivalCity?.name} (Arrival)
                      </div>
                      <div className="mt-1 text-muted-foreground text-sm">
                        {new Date(selectedTrip.arrivalTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "passengers" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground text-lg">Passenger Manifest</h3>
                    <Button variant="outline" size="sm">
                      Export Manifest
                    </Button>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <table className="w-full text-sm">
                      <thead className="border-border border-b bg-muted/50">
                        <tr>
                          <th className="p-3 text-left font-medium text-muted-foreground">Seat</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Name</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Ticket ID</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="p-3 font-semibold text-foreground">A1</td>
                          <td className="p-3">Nguyen Van A</td>
                          <td className="p-3 text-muted-foreground">TK-0912</td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-600">
                              Boarded
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-foreground">A2</td>
                          <td className="p-3">Tran Thi B</td>
                          <td className="p-3 text-muted-foreground">TK-0913</td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-600">
                              Pending
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-foreground">A3</td>
                          <td className="p-3">Le Van C</td>
                          <td className="p-3 text-muted-foreground">TK-0914</td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-600">
                              Pending
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-foreground text-lg">Trip Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex cursor-pointer items-start gap-4 rounded-xl border border-border p-4 hover:bg-muted/30">
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <FileText className="size-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Driver Assignment</div>
                        <div className="mt-0.5 text-muted-foreground text-sm">PDF • 1.2 MB</div>
                      </div>
                    </div>
                    <div className="flex cursor-pointer items-start gap-4 rounded-xl border border-border p-4 hover:bg-muted/30">
                      <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                        <FileText className="size-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Vehicle Inspection</div>
                        <div className="mt-0.5 text-muted-foreground text-sm">PDF • 800 KB</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-foreground text-lg">Activity Log</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <Activity className="size-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">Trip scheduled by Admin</div>
                        <div className="mt-1 text-muted-foreground text-xs">2 days ago, 10:30 AM</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">Driver assigned: Le Hoang</div>
                        <div className="mt-1 text-muted-foreground text-xs">Yesterday, 14:00 PM</div>
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
          Select a trip to view details
        </div>
      )}
    </div>
  );
}
