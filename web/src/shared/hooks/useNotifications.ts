import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export type NotificationType = 'system' | 'promo' | 'booking';

export interface UiNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

function formatRelativeTime(iso: string, t: (key: string, opts?: any) => string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return t('notifications.justNow');
  if (minutes < 60) return t('notifications.minutesAgo', { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t('notifications.hoursAgo', { count: hours });
  const days = Math.floor(hours / 24);
  return t('notifications.daysAgo', { count: days });
}

// Polling interval, since there's no realtime channel wired up on the client yet.
const POLL_INTERVAL_MS = 15000;

export function useNotifications() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UiNotification[]>([]);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const res = await api.get<{ success: boolean; data: NotificationDTO[] }>('/notifications');
      setNotifications(
        res.data.data.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          time: formatRelativeTime(n.createdAt, t),
          read: n.isRead,
          type: n.type,
        }))
      );
    } catch {
      // Silently ignore — e.g. token expired between polls.
    }
  }, [t, user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.patch(`/notifications/${id}/read`, {});
    } catch {
      // Best-effort — local state already reflects the intent.
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.patch('/notifications/read-all', {});
    } catch {
      // Best-effort — local state already reflects the intent.
    }
  }, []);

  return { notifications, markAsRead, markAllAsRead, refetch: fetchNotifications };
}
