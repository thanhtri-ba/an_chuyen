"use client";

import { Inbox, LifeBuoy } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function ChatSidebar() {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! **:data-[sidebar=sidebar]:bg-background"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton className="[&_svg]:size-3.5" size="sm" isActive tooltip="Hỗ trợ khách hàng">
                <LifeBuoy />
                <span className="font-medium">Hỗ trợ khách hàng</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="[&_svg]:size-3.5" size="sm" tooltip="Tất cả hội thoại">
                <Inbox />
                <span className="font-medium">Tất cả hội thoại</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
