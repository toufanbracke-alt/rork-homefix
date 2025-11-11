export type NotificationType = 
  | "new_job"
  | "new_offer"
  | "offer_accepted"
  | "offer_declined"
  | "new_message"
  | "job_completed"
  | "job_status_change";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: string;
  read: boolean;
  userId: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  newJobNotifications: boolean;
  newOfferNotifications: boolean;
  messageNotifications: boolean;
  jobStatusNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
