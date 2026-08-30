"use client";

import { ChevronDown, PanelRightClose, PanelRightOpen } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { cn, getInitials } from "@/lib/utils";

import type { SupportConversation } from "./data";
import { useChat } from "./use-chat";

interface ChatConversationListProps {
  conversations: SupportConversation[];
  isLoading?: boolean;
  onSelectConversation?: (conversation: SupportConversation) => void;
  className?: string;
}

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return date.toLocaleDateString();
}

export function ChatConversationList({
  conversations,
  isLoading,
  onSelectConversation,
  className,
}: ChatConversationListProps) {
  const [chat, setChat] = useChat();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const openConversations = conversations.filter((c) => c.status !== "CLOSED");
  const closedConversations = conversations.filter((c) => c.status === "CLOSED");

  return (
    <div className={cn("flex h-full flex-col gap-3 pt-3", className)}>
      <div className="flex items-center justify-between gap-4 px-2 py-0.5">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            className="[&_svg]:transition-transform [&_svg]:duration-300"
          >
            {isCollapsed ? <PanelRightClose /> : <PanelRightOpen />}
          </Button>
          <Separator orientation="vertical" className="mr-1.5 h-4 data-vertical:self-center" />
          <h1 className="font-medium text-xl leading-none">Hỗ trợ khách hàng</h1>
        </div>
      </div>

      <Separator />

      <div className="flex min-h-0 flex-1 flex-col">
        <ScrollArea
          type="hover"
          className="**:data-[slot=scroll-area-viewport]:scroll-fade h-full min-h-0 flex-1 overflow-hidden [&_[data-orientation=vertical][data-slot=scroll-area-scrollbar]]:w-1.5"
        >
          <div className="flex flex-col gap-3 pt-0">
            {isLoading && <div className="px-3 py-4 text-muted-foreground text-sm">Đang tải hội thoại...</div>}

            {!isLoading && conversations.length === 0 && (
              <div className="px-3 py-4 text-muted-foreground text-sm">Chưa có hội thoại nào.</div>
            )}

            {[
              { label: "Đang mở", items: openConversations },
              { label: "Đã đóng", items: closedConversations },
            ]
              .filter((group) => group.items.length > 0)
              .map(({ label, items }) => (
                <Collapsible key={label} defaultOpen>
                  <CollapsibleTrigger className="flex w-full items-center justify-between gap-1 px-3 py-2 font-medium text-muted-foreground text-xs hover:text-foreground [&[data-state=open]>svg]:rotate-180">
                    {label}
                    <ChevronDown className="size-3 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="flex flex-col gap-1 px-2">
                      {items.map((conversation) => {
                        const isSelected = chat.selected === conversation.id;
                        const lastMessage = conversation.messages?.[0];

                        return (
                          <button
                            key={conversation.id}
                            type="button"
                            className={cn(
                              "w-full overflow-hidden rounded-lg px-2.5 py-2.5 text-left ring-inset transition-colors",
                              isSelected ? "bg-muted ring-1 ring-border" : "hover:bg-muted/75",
                            )}
                            onClick={(event) => {
                              event.currentTarget.blur();
                              setChat({ selected: conversation.id });
                              onSelectConversation?.(conversation);
                            }}
                          >
                            <div className="flex min-w-0 items-start gap-2.5">
                              <Avatar className="shrink-0">
                                <AvatarFallback
                                  className={cn(
                                    "text-foreground text-xs transition-colors duration-400",
                                    isSelected && "bg-background/50",
                                  )}
                                >
                                  {getInitials(conversation.user?.fullName || "?")}
                                </AvatarFallback>
                              </Avatar>

                              <div className="w-0 flex-1 overflow-hidden">
                                <div className="flex w-full items-center justify-between gap-2">
                                  <div className="truncate font-medium text-sm leading-5">
                                    {conversation.user?.fullName || "Khách"}
                                  </div>
                                  <span className="text-nowrap text-muted-foreground text-xs leading-5">
                                    {formatRelativeTime(conversation.updatedAt)}
                                  </span>
                                </div>
                                <div className="flex min-w-0 items-end gap-2">
                                  <div className="w-0 flex-1 overflow-hidden">
                                    <div className="truncate text-muted-foreground text-xs leading-4">
                                      {lastMessage ? lastMessage.text : "Chưa có tin nhắn"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
