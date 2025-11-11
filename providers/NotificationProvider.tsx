import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppNotification, NotificationSettings, NotificationType } from "@/types/notification";

interface NotificationContextType {
  notifications: AppNotification[];
  settings: NotificationSettings;
  unreadCount: number;
  registerForPushNotifications: () => Promise<string | null>;
  sendNotification: (
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>
  ) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  updateSettings: (updates: Partial<NotificationSettings>) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: NotificationSettings = {
  pushEnabled: true,
  newJobNotifications: true,
  newOfferNotifications: true,
  messageNotifications: true,
  jobStatusNotifications: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

export const [NotificationProvider, useNotifications] = createContextHook<NotificationContextType>(() => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem("notifications");
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem("notificationSettings");
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  const saveNotifications = async (updatedNotifications: AppNotification[]) => {
    try {
      await AsyncStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  };

  const saveSettings = async (updatedSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem("notificationSettings", JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  };

  const registerForPushNotifications = useCallback(async (): Promise<string | null> => {
    console.log('Push notifications require a development build (not available in Expo Go)');
    return null;
  }, []);

  const sendNotification = useCallback(async (
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>
  ) => {
    try {
      const notification: AppNotification = {
        id: Date.now().toString(),
        type,
        title,
        body,
        data,
        timestamp: new Date().toISOString(),
        read: false,
        userId,
      };

      const updatedNotifications = [notification, ...notifications];
      setNotifications(updatedNotifications);
      await saveNotifications(updatedNotifications);

      console.log('In-app notification created:', { title, body });
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }, [notifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, [notifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [notifications]);

  const clearNotification = useCallback(async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error clearing notification:", error);
    }
  }, [notifications]);

  const clearAllNotifications = useCallback(async () => {
    try {
      setNotifications([]);
      await saveNotifications([]);
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  }, []);

  const updateSettings = useCallback(async (updates: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...updates };
      setSettings(updatedSettings);
      await saveSettings(updatedSettings);
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw error;
    }
  }, [settings]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return useMemo(() => ({
    notifications,
    settings,
    unreadCount,
    registerForPushNotifications,
    sendNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    updateSettings,
    isLoading,
  }), [
    notifications,
    settings,
    unreadCount,
    registerForPushNotifications,
    sendNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    updateSettings,
    isLoading,
  ]);
});
