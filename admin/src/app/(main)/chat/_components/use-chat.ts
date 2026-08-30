import { useCallback, useEffect, useState } from "react";

import { create } from "zustand";

import { api } from "@/lib/api";

import type { SupportConversation, SupportMessage } from "./data";

type Config = {
  selected: SupportConversation["id"] | null;
};

type ChatStore = {
  chat: Config;
  setChat: (chat: Config) => void;
};

const useChatStore = create<ChatStore>((set) => ({
  chat: {
    selected: null,
  },
  setChat: (chat) => set({ chat }),
}));

export function useChat() {
  const chat = useChatStore((state) => state.chat);
  const setChat = useChatStore((state) => state.setChat);

  return [chat, setChat] as const;
}

export function useConversations() {
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useChat();

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<SupportConversation[]>("/admin/support/conversations");
      setConversations(data);
      const stillExists = chat.selected && data.some((c) => c.id === chat.selected);
      if (!stillExists) {
        setChat({ selected: data[0]?.id ?? null });
      }
    } catch (err: any) {
      setError(err.message || "Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, [chat.selected, setChat]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { conversations, isLoading, error, refetch };
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<SupportMessage[]>(`/admin/support/conversations/${conversationId}/messages`);
      setMessages(data);
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!conversationId || !text.trim()) return;
      const message = await api.post<SupportMessage>(`/admin/support/conversations/${conversationId}/messages`, {
        text,
      });
      setMessages((prev) => [...prev, message]);
      return message;
    },
    [conversationId],
  );

  return { messages, isLoading, error, refetch, sendMessage };
}
