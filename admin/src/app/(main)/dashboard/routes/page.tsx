import { useCallback, useEffect, useState } from "react";

import { ArrowRight, Map as MapIcon, MapPin, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [departureCityId, setDepartureCityId] = useState("");
  const [arrivalCityId, setArrivalCityId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [durationMins, setDurationMins] = useState("");

  const load = useCallback(async () => {
    try {
      const [routeList, cityList] = await Promise.all([
        api.get<any[]>("/admin/routes?range=[0,99]"),
        api.get<any[]>("/admin/cities?range=[0,199]"),
      ]);
      setItems(routeList || []);
      setCities(cityList || []);
    } catch (error) {
      console.error("Failed to load routes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredItems = items.filter((route) => {
    const q = searchQuery.toLowerCase();
    const dep = route.departureCity?.name?.toLowerCase() || "";
    const arr = route.arrivalCity?.name?.toLowerCase() || "";
    return dep.includes(q) || arr.includes(q);
  });

  async function handleAdd() {
    if (!departureCityId || !arrivalCityId) return;
    setIsSaving(true);
    try {
      await api.post("/admin/routes", {
        departureCityId,
        arrivalCityId,
        basePrice: basePrice ? Number(basePrice) : undefined,
        durationMins: durationMins ? Number(durationMins) : undefined,
      });
      setDepartureCityId("");
      setArrivalCityId("");
      setBasePrice("");
      setDurationMins("");
      setIsAddOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create route", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/admin/routes/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete route", error);
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Tuyến Đường</h1>
          <p className="text-muted-foreground text-sm">Quản lý danh sách các tuyến đường liên tỉnh</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
              <Plus className="size-4" /> Thêm Tuyến Đường
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm Tuyến Đường Mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="route-departure" className="font-medium text-sm">Điểm đi</label>
                <select
                  id="route-departure"
                  value={departureCityId}
                  onChange={(e) => setDepartureCityId(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">-- Chọn thành phố --</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="route-arrival" className="font-medium text-sm">Điểm đến</label>
                <select
                  id="route-arrival"
                  value={arrivalCityId}
                  onChange={(e) => setArrivalCityId(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">-- Chọn thành phố --</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="route-price" className="font-medium text-sm">Giá cơ bản (đ)</label>
                  <Input id="route-price" type="number" placeholder="150000" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="route-duration" className="font-medium text-sm">Thời gian (phút)</label>
                  <Input id="route-duration" type="number" placeholder="180" value={durationMins} onChange={(e) => setDurationMins(e.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={isSaving || !departureCityId || !arrivalCityId}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSaving ? "Đang lưu..." : "Lưu tuyến đường"}
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
              placeholder="Tìm kiếm tuyến đường (VD: Hà Nội)..."
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[350px]">Lộ trình</TableHead>
                <TableHead>Giá cơ bản</TableHead>
                <TableHead>Thời gian dự kiến</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy tuyến đường nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((route) => (
                  <TableRow key={route.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                          <MapIcon className="size-5" />
                        </div>
                        <div className="flex w-full max-w-[250px] flex-col gap-1">
                          <div className="flex items-center gap-2 font-semibold text-foreground">
                            <span>{route.departureCity?.name ?? route.departureCityId}</span>
                            <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                            <span>{route.arrivalCity?.name ?? route.arrivalCityId}</span>
                          </div>
                          <span className="flex items-center gap-1 text-muted-foreground text-xs">
                            <MapPin className="size-3" />{" "}
                            {route.distanceKm ? `${route.distanceKm} km` : "Chưa cập nhật"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {route.basePrice ? `${route.basePrice.toLocaleString()} đ` : "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {route.durationMins
                        ? `${Math.floor(route.durationMins / 60)}h ${route.durationMins % 60}m`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {route.isPopular ? (
                        <Badge className="border-blue-200 bg-blue-50 text-blue-700 shadow-none hover:bg-blue-100">
                          Phổ biến
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-border text-muted-foreground shadow-none">
                          Bình thường
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleDelete(route.id)}
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
