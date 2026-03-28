import { useNotifications } from "@/providers/NotificationProvider";
import { useUser } from "@/providers/UserProvider";
import { useCallback } from "react";

export function useNotifyJobActions() {
  const { sendNotification, settings } = useNotifications();
  const { profile } = useUser();

  const notifyNewOffer = useCallback(async (jobId: string, jobTitle: string, fixerName: string, price: string) => {
    if (!settings.newOfferNotifications) return;
    
    await sendNotification(
      profile.id,
      "new_offer",
      "New Quote Received",
      `${fixerName} sent you a quote of €${price} for "${jobTitle}"`,
      { jobId }
    );
  }, [sendNotification, profile.id, settings.newOfferNotifications]);

  const notifyOfferAccepted = useCallback(async (jobId: string, jobTitle: string) => {
    if (!settings.jobStatusNotifications) return;
    
    await sendNotification(
      profile.id,
      "offer_accepted",
      "Quote Accepted",
      `Your quote for "${jobTitle}" was accepted!`,
      { jobId }
    );
  }, [sendNotification, profile.id, settings.jobStatusNotifications]);

  const notifyOfferDeclined = useCallback(async (jobId: string, jobTitle: string) => {
    if (!settings.jobStatusNotifications) return;
    
    await sendNotification(
      profile.id,
      "offer_declined",
      "Quote Declined",
      `Your quote for "${jobTitle}" was declined`,
      { jobId }
    );
  }, [sendNotification, profile.id, settings.jobStatusNotifications]);

  const notifyNewMessage = useCallback(async (jobId: string, jobTitle: string, senderName: string) => {
    if (!settings.messageNotifications) return;
    
    await sendNotification(
      profile.id,
      "new_message",
      "New Message",
      `${senderName} sent you a message about "${jobTitle}"`,
      { jobId }
    );
  }, [sendNotification, profile.id, settings.messageNotifications]);

  const notifyJobCompleted = useCallback(async (jobId: string, jobTitle: string) => {
    if (!settings.jobStatusNotifications) return;
    
    await sendNotification(
      profile.id,
      "job_completed",
      "Job Completed",
      `"${jobTitle}" has been marked as completed!`,
      { jobId }
    );
  }, [sendNotification, profile.id, settings.jobStatusNotifications]);

  return {
    notifyNewOffer,
    notifyOfferAccepted,
    notifyOfferDeclined,
    notifyNewMessage,
    notifyJobCompleted,
  };
}
