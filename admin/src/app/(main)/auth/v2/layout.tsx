import type { ReactNode } from "react";

import { Command } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full rounded-3xl bg-primary lg:flex">
          <div className="absolute top-10 space-y-1 px-10 text-primary-foreground">
            <Command className="size-10" />
            <h1 className="font-medium text-2xl">{APP_CONFIG.name}</h1>
            <p className="text-sm">Nền tảng đặt vé xe khách & du lịch tại Việt Nam.</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Quản lý toàn diện</h2>
              <p className="text-sm">Theo dõi chuyến xe, đặt vé, người dùng và doanh thu trong một nơi.</p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto!" />
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Cần hỗ trợ?</h2>
              <p className="text-sm">Liên hệ đội ngũ kỹ thuật để được hỗ trợ nhanh chóng.</p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full overflow-y-auto py-16">{children}</div>
      </div>
    </main>
  );
}
