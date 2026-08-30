"use client";

import { Calendar, Mail, Phone, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";

import type { SupportConversation } from "./data";

interface ChatProfileDetailsProps {
  conversation: SupportConversation | null;
  onClose?: () => void;
}

export function ChatProfileDetails({ conversation, onClose }: ChatProfileDetailsProps) {
  if (!conversation) {
    return null;
  }

  const { user } = conversation;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-start gap-3">
        <Avatar size="lg" className="shrink-0">
          <AvatarFallback className="bg-background">{getInitials(user?.fullName || "?")}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium leading-5">{user?.fullName || "Khách"}</div>
          <div className="truncate text-muted-foreground text-xs">{user?.email}</div>
        </div>

        <Button variant="ghost" size="icon-sm" aria-label="Close profile" onClick={onClose}>
          <X />
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Email</span>
            <span className="ml-auto truncate text-sm">{user?.email || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Số điện thoại</span>
            <span className="ml-auto truncate text-sm">{user?.phone || "—"}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Bắt đầu</span>
            <span className="ml-auto truncate text-sm">{new Date(conversation.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Trạng thái</span>
            <Badge variant="secondary" className="ml-auto">
              {conversation.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
