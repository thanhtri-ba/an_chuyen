"use client";

import { useState } from "react";

import { ArrowLeft, Send, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Message, MessageAvatar, MessageContent, MessageFooter } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";

import type { SupportConversation, SupportMessage } from "./data";

interface ChatThreadProps {
  conversation: SupportConversation | null;
  messages: SupportMessage[];
  onSend?: (text: string) => Promise<unknown>;
  onOpenContact?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatThread({
  conversation,
  messages,
  onSend,
  onOpenContact,
  onBack,
  showBackButton,
  className,
}: ChatThreadProps) {
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!conversation) {
    return (
      <div
        className={cn("flex h-full flex-col items-center justify-center gap-2 py-3 text-muted-foreground", className)}
      >
        Chọn một hội thoại để bắt đầu
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim() || !onSend) return;
    setIsSending(true);
    try {
      await onSend(draft.trim());
      setDraft("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={cn("flex h-full flex-col py-3", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Back to conversations"
                onClick={onBack}
              >
                <ArrowLeft />
              </Button>
            )}
            <Avatar className="size-8">
              <AvatarFallback className="bg-background text-foreground">
                {getInitials(conversation.user?.fullName || "?")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{conversation.user?.fullName || "Khách"}</div>
              <div className="text-muted-foreground text-xs leading-3">{conversation.user?.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="More actions">
                  <UserRound />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={onOpenContact}>
                    <UserRound />
                    Xem hồ sơ
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />
      </div>

      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-6 px-2 py-8">
              {messages.length === 0 && (
                <div className="px-2 text-center text-muted-foreground text-sm">Chưa có tin nhắn nào.</div>
              )}

              {messages.map((message) => {
                const isOutbound = message.sender?.role === "admin" || message.sender?.role === "ADMIN";
                const align = isOutbound ? "end" : "start";

                return (
                  <MessageScrollerItem key={message.id} messageId={String(message.id)} scrollAnchor={align === "end"}>
                    <Message align={align}>
                      <MessageAvatar>
                        <Avatar>
                          <AvatarFallback
                            className={cn(
                              "bg-muted text-foreground text-xs",
                              isOutbound && "bg-primary text-primary-foreground",
                            )}
                          >
                            {getInitials(message.sender?.fullName || "?")}
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>

                      <MessageContent>
                        <BubbleGroup>
                          <Bubble variant={isOutbound ? "default" : "muted"} align={align}>
                            <BubbleContent>{message.text}</BubbleContent>
                          </Bubble>
                        </BubbleGroup>
                        <MessageFooter>{formatTime(message.createdAt)}</MessageFooter>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <div className="px-2">
        <form className="w-full rounded-md border" onSubmit={handleSubmit}>
          <InputGroup className="border-0 bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot][aria-invalid=true]]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot][aria-invalid=true]]:ring-0 dark:bg-transparent dark:has-[[data-slot][aria-invalid=true]]:ring-0">
            <InputGroupTextarea
              placeholder="Nhập tin nhắn trả lời..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSubmit(event);
                }
              }}
              className="min-h-14 px-3 py-2.5 text-sm ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:aria-invalid:ring-0"
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                type="submit"
                variant="default"
                size="icon-sm"
                className="ml-auto"
                disabled={isSending || !draft.trim()}
              >
                <Send />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  );
}
