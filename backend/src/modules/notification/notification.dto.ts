export type NotificationType = 'system' | 'promo' | 'booking';

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}
