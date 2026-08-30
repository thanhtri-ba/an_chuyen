import { useCallback, useEffect, useState } from "react";

import { ArrowRight, Bus, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

const BUS_CLASSES = ["ECONOMY", "EXECUTIVE", "SUPER_EXECUTIVE", "VIP", "SLEEPER"];

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [busAgents, setBusAgents] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [busAgentId, setBusAgentId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [busClass, setBusClass] = useState("EXECUTIVE");

  const load = useCallback(async () => {
    try {
      const [trips, agents, routeList] = await Promise.all([
        api.get<any[]>("/admin/trips?range=[0,99]"),
        api.get<any[]>("/admin/busAgents?range=[0,99]"),
        api.get<any[]>("/admin/routes?range=[0,99]"),
      ]);
      setItems(trips || []);
      setBusAgents(agents || []);
      setRoutes(routeList || []);
    } catch (error) {
      console.error("Failed to load trips", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredItems = items.filter((trip) => {
    const q = searchQuery.toLowerCase();
    const agent = trip.busAgent?.name?.toLowerCase() || "";
    const dep = trip.route?.departureCity?.name?.toLowerCase() || "";
    const arr = trip.route?.arrivalCity?.name?.toLowerCase() || "";
    return agent.includes(q) || dep.includes(q) || arr.includes(q);
  });

  async function handleAdd() {
    if (!busAgentId || !routeId) return;
    setIsSaving(true);
    try {
      await api.post("/admin/trips", { busAgentId, routeId, busClass });
      setBusAgentId("");
      setRouteId("");
      setBusClass("EXECUTIVE");
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create trip", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/trips/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete trip", error);
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Chuyến Xe</h1>
          <p className="text-muted-foreground text-sm">Quản lý cấu hình chuyến xe theo từng nhà xe</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm Chuyến Xe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm Chuyến Xe Mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="trip-agent" className="font-medium text-sm">Nhà xe</label>
                <select
                  id="trip-agent"
                  value={busAgentId}
                  onChange={(e) => setBusAgentId(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">-- Chọn nhà xe --</option>
                  {busAgents.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="trip-route" className="font-medium text-sm">Tuyến đường</label>
                <select
                  id="trip-route"
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">-- Chọn tuyến --</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.departureCity?.name ?? "?"} → {r.arrivalCity?.name ?? "?"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="trip-class" className="font-medium text-sm">Hạng xe</label>
                <select
                  id="trip-class"
                  value={busClass}
                  onChange={(e) => setBusClass(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  {BUS_CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={isSaving || !busAgentId || !routeId}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSaving ? "Đang lưu..." : "Lưu chuyến xe"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden rounded-xl border-border shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-border border-b bg-card p-4 sm:flex-row">
          <div className="relative w-full sm:w-96">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-lg border-border bg-muted/50 pl-9 text-foreground placeholder:text-muted-foreground"
              placeholder="Tìm kiếm nhà xe, điểm đến..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Nhà Xe</TableHead>
                <TableHead>Tuyến đường</TableHead>
                <TableHead>Hạng xe</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy chuyến xe nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((trip) => (
                  <TableRow key={trip.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 font-bold text-indigo-600">
                          {trip.busAgent?.name ? (
                            trip.busAgent.name.substring(0, 2).toUpperCase()
                          ) : (
                            <Bus className="size-5" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{trip.busAgent?.name ?? "N/A"}</span>
                          <span className="text-muted-foreground text-xs">Trip ID: {trip.id?.substring(0, 8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {trip.route ? (
                        <div className="flex items-center gap-2 font-medium text-foreground text-sm">
                          <span>{trip.route.departureCity?.name ?? "?"}</span>
                          <ArrowRight className="size-3 text-muted-foreground" />
                          <span>{trip.route.arrivalCity?.name ?? "?"}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border bg-slate-50 text-slate-700 shadow-none">
                        {trip.busClass}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-none"
                      >
                        Đang khai thác
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleDelete(trip.id)}
                        className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
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
