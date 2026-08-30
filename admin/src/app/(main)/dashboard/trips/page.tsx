import { useEffect, useState } from "react";

import { ArrowRight, Bus, Filter, MapPin, MoreHorizontal, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .get<any[]>("/admin/trips?range=[0,99]")
      .then((d) => setItems(d || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((trip) => {
    const q = searchQuery.toLowerCase();
    const agent = trip.busAgent?.name?.toLowerCase() || "";
    const dep = trip.route?.departureCity?.name?.toLowerCase() || "";
    const arr = trip.route?.arrivalCity?.name?.toLowerCase() || "";
    return agent.includes(q) || dep.includes(q) || arr.includes(q);
  });

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight">Chuyến Xe</h1>
          <p className="text-muted-foreground text-sm">Quản lý cấu hình chuyến xe theo từng nhà xe</p>
        </div>
        <Button className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
          <Plus className="size-4" /> Thêm Chuyến Xe
        </Button>
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
          <Button variant="outline" size="sm" className="h-9 w-full gap-2 sm:w-auto">
            <Filter className="size-4" /> Lọc
          </Button>
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
                  <TableRow key={trip.id} className="group cursor-pointer transition-colors hover:bg-muted/30">
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
                          <MapPin className="size-3.5 text-muted-foreground" />
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
                        className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="size-4" />
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
