import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockJobs } from "@/mocks/jobs";
import { Job, Offer, Message } from "@/types/job";

interface JobsContextType {
  jobs: Job[];
  createJob: (job: Omit<Job, "id" | "postedAt" | "status" | "offers" | "messages">) => Promise<void>;
  addOffer: (jobId: string, offer: Omit<Offer, "id" | "timestamp" | "status">) => Promise<void>;
  acceptOffer: (jobId: string, offerId: string) => Promise<void>;
  declineOffer: (jobId: string, offerId: string) => Promise<void>;
  sendMessage: (jobId: string, message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  completeJob: (jobId: string) => Promise<void>;
  getJobById: (jobId: string) => Job | undefined;
  isLoading: boolean;
}

export const [JobsProvider, useJobs] = createContextHook<JobsContextType>(() => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const storedJobs = await AsyncStorage.getItem("jobs");
      if (storedJobs) {
        setJobs(JSON.parse(storedJobs));
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveJobs = async (updatedJobs: Job[]) => {
    try {
      await AsyncStorage.setItem("jobs", JSON.stringify(updatedJobs));
    } catch (error) {
      console.error("Error saving jobs:", error);
    }
  };

  const createJob = useCallback(async (job: Omit<Job, "id" | "postedAt" | "status" | "offers" | "messages">) => {
    try {
      const newJob: Job = {
        ...job,
        id: Date.now().toString(),
        postedAt: new Date().toISOString(),
        status: "pending",
        offers: [],
        messages: [],
      };
      const updatedJobs = [...jobs, newJob];
      setJobs(updatedJobs);
      await saveJobs(updatedJobs);
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  }, [jobs]);

  const addOffer = useCallback(async (jobId: string, offer: Omit<Offer, "id" | "timestamp" | "status">) => {
    try {
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          const newOffer: Offer = {
            ...offer,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            status: "pending",
          };
          return {
            ...job,
            offers: [...(job.offers || []), newOffer],
          };
        }
        return job;
      });
      setJobs(updatedJobs);
      await saveJobs(updatedJobs);
    } catch (error) {
      console.error("Error adding offer:", error);
      throw error;
    }
  }, [jobs]);

  const acceptOffer = useCallback(async (jobId: string, offerId: string) => {
    try {
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          const acceptedOffer = job.offers?.find(o => o.id === offerId);
          return {
            ...job,
            status: "in-progress" as const,
            fixerId: acceptedOffer?.fixerId,
            fixerName: acceptedOffer?.fixerName,
            fixerPhone: acceptedOffer?.fixerPhone,
            price: acceptedOffer?.price,
            offers: job.offers?.map(o => ({
              ...o,
              status: o.id === offerId ? "accepted" as const : "declined" as const,
            })),
          };
        }
        return job;
      });
      setJobs(updatedJobs);
      await saveJobs(updatedJobs);
    } catch (error) {
      console.error("Error accepting offer:", error);
      throw error;
    }
  }, [jobs]);

  const declineOffer = useCallback(async (jobId: string, offerId: string) => {
    try {
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            offers: job.offers?.map(o => 
              o.id === offerId ? { ...o, status: "declined" as const } : o
            ),
          };
        }
        return job;
      });
      setJobs(updatedJobs);
      await saveJobs(updatedJobs);
    } catch (error) {
      console.error("Error declining offer:", error);
      throw error;
    }
  }, [jobs]);

  const sendMessage = useCallback(async (jobId: string, message: Omit<Message, "id" | "timestamp">) => {
    try {
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          const newMessage: Message = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          };
          return {
            ...job,
            messages: [...(job.messages || []), newMessage],
          };
        }
        return job;
      });
      setJobs(updatedJobs);
      await saveJobs(updatedJobs);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }, [jobs]);

  const completeJob = useCallback(async (jobId: string) => {
    try {
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            status: "completed" as const,
          };
        }
        return job;
      });
      setJobs(updatedJobs);
      await saveJobs(updatedJobs);
    } catch (error) {
      console.error("Error completing job:", error);
      throw error;
    }
  }, [jobs]);

  const getJobById = useCallback((jobId: string) => {
    return jobs.find(job => job.id === jobId);
  }, [jobs]);

  return useMemo(() => ({
    jobs,
    createJob,
    addOffer,
    acceptOffer,
    declineOffer,
    sendMessage,
    completeJob,
    getJobById,
    isLoading,
  }), [jobs, createJob, addOffer, acceptOffer, declineOffer, sendMessage, completeJob, getJobById, isLoading]);
});
