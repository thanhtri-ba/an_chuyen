import { Compass, Layout, Monitor, Moon, RefreshCw, Sun } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type FontKey, fontOptions } from "@/lib/fonts/registry";
import { THEME_PRESET_OPTIONS, type ThemePreset } from "@/lib/preferences/theme";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export default function SettingsPage() {
  const { values, resolvedThemeMode, setPreference, resetPreferences } = usePreferencesStore(
    useShallow((state) => ({
      values: state.values,
      resolvedThemeMode: state.resolvedThemeMode,
      setPreference: state.setPreference,
      resetPreferences: state.resetPreferences,
    })),
  );

  const {
    theme_mode: themeMode,
    theme_preset: themePreset,
    content_layout: contentLayout,
    navbar_style: navbarStyle,
    sidebar_variant: sidebarVariant,
    font,
  } = values;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 pb-10">
      <div className="space-y-1">
        <h1 className="font-bold text-3xl tracking-tight">Cài Đặt Hệ Thống</h1>
        <p className="text-muted-foreground text-sm">
          Tùy chỉnh giao diện hiển thị, chủ đề màu sắc và bố cục của trang quản trị.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left column - theme & preset */}
        <div className="space-y-6 md:col-span-2">
          {/* Card 1: Theme Mode */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {resolvedThemeMode === "dark" ? (
                  <Moon className="size-5 text-blue-400" />
                ) : (
                  <Sun className="size-5 text-yellow-500" />
                )}
                Chế Độ Giao Diện (Theme Mode)
              </CardTitle>
              <CardDescription>
                Thiết lập hiển thị sáng, tối hoặc tự động đồng bộ theo hệ điều hành của thiết bị. Dưới chế độ tối, chữ
                hiển thị sẽ tự chuyển sang màu sáng trên nền tối và ngược lại.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {/* Light Option */}
                <button
                  type="button"
                  onClick={() => setPreference("theme_mode", "light")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    themeMode === "light"
                      ? "border-primary bg-accent/40 text-foreground ring-2 ring-primary/20"
                      : "border-muted bg-transparent text-muted-foreground hover:border-accent"
                  }`}
                >
                  <div className="rounded-full bg-yellow-500/10 p-3 text-yellow-500">
                    <Sun className="size-6" />
                  </div>
                  <div className="font-semibold text-foreground text-sm">Trời Sáng (Light)</div>
                  <div className="text-muted-foreground text-xs">Nền trắng, chữ đen</div>
                </button>

                {/* Dark Option */}
                <button
                  type="button"
                  onClick={() => setPreference("theme_mode", "dark")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    themeMode === "dark"
                      ? "border-primary bg-accent/40 text-foreground ring-2 ring-primary/20"
                      : "border-muted bg-transparent text-muted-foreground hover:border-accent"
                  }`}
                >
                  <div className="rounded-full bg-blue-500/10 p-3 text-blue-400">
                    <Moon className="size-6" />
                  </div>
                  <div className="font-semibold text-foreground text-sm">Trời Tối (Dark)</div>
                  <div className="text-muted-foreground text-xs">Nền tối, chữ sáng</div>
                </button>

                {/* System Option */}
                <button
                  type="button"
                  onClick={() => setPreference("theme_mode", "system")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    themeMode === "system"
                      ? "border-primary bg-accent/40 text-foreground ring-2 ring-primary/20"
                      : "border-muted bg-transparent text-muted-foreground hover:border-accent"
                  }`}
                >
                  <div className="rounded-full bg-purple-500/10 p-3 text-purple-500">
                    <Monitor className="size-6" />
                  </div>
                  <div className="font-semibold text-foreground text-sm">Hệ Thống (System)</div>
                  <div className="text-muted-foreground text-xs">Tự động đồng bộ</div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Presets & Fonts */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Compass className="size-5" />
                Màu Chủ Đề & Phông Chữ (Theme Preset & Fonts)
              </CardTitle>
              <CardDescription>
                Lựa chọn bảng màu chủ đạo (Primary Color Palette) và phông chữ hiển thị cho toàn bộ trang quản trị.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="preset-select"
                    className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    Bảng Màu Chủ Đề
                  </Label>
                  <Select
                    value={themePreset}
                    onValueChange={(val) => setPreference("theme_preset", val as ThemePreset)}
                  >
                    <SelectTrigger id="preset-select" className="w-full text-sm">
                      <SelectValue placeholder="Chọn màu chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {THEME_PRESET_OPTIONS.map((preset) => (
                          <SelectItem key={preset.value} value={preset.value}>
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block size-3.5 rounded-full border border-border"
                                style={{
                                  backgroundColor:
                                    resolvedThemeMode === "dark" ? preset.primary.dark : preset.primary.light,
                                }}
                              />
                              <span>{preset.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="font-select"
                    className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    Phông Chữ
                  </Label>
                  <Select value={font} onValueChange={(val) => setPreference("font", val as FontKey)}>
                    <SelectTrigger id="font-select" className="w-full text-sm">
                      <SelectValue placeholder="Chọn phông chữ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fontOptions.map((f) => (
                          <SelectItem key={f.key} value={f.key}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Layout settings */}
        <div className="space-y-6">
          <Card className="flex h-full flex-col border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layout className="size-5" />
                Bố Cục (Layout)
              </CardTitle>
              <CardDescription>Tùy chỉnh bố cục hiển thị trang.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-5">
              {/* Page Layout */}
              <div className="space-y-2">
                <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Trang hiển thị
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={contentLayout === "centered" ? "default" : "outline"}
                    className="w-full text-xs"
                    onClick={() => setPreference("content_layout", "centered")}
                  >
                    Centered
                  </Button>
                  <Button
                    size="sm"
                    variant={contentLayout === "full-width" ? "default" : "outline"}
                    className="w-full text-xs"
                    onClick={() => setPreference("content_layout", "full-width")}
                  >
                    Full Width
                  </Button>
                </div>
              </div>

              {/* Sidebar Variant */}
              <div className="space-y-2">
                <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Kiểu Sidebar
                </Label>
                <div className="grid grid-cols-3 gap-1">
                  {(["inset", "sidebar", "floating"] as const).map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={sidebarVariant === v ? "default" : "outline"}
                      className="px-1 text-[10px] capitalize"
                      onClick={() => setPreference("sidebar_variant", v)}
                    >
                      {v}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Navbar Style */}
              <div className="space-y-2">
                <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Thanh Tiêu Đề
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={navbarStyle === "sticky" ? "default" : "outline"}
                    className="w-full text-xs"
                    onClick={() => setPreference("navbar_style", "sticky")}
                  >
                    Sticky
                  </Button>
                  <Button
                    size="sm"
                    variant={navbarStyle === "scroll" ? "default" : "outline"}
                    className="w-full text-xs"
                    onClick={() => setPreference("navbar_style", "scroll")}
                  >
                    Scroll
                  </Button>
                </div>
              </div>

              {/* Reset defaults */}
              <div className="mt-auto pt-4">
                <Button
                  variant="destructive"
                  onClick={resetPreferences}
                  className="flex w-full items-center justify-center gap-2 text-xs"
                >
                  <RefreshCw className="size-3.5" />
                  Khôi Phục Mặc Định
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
