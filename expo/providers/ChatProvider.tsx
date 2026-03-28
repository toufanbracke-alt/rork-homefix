import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatConversation, ChatMessage } from "@/types/chat";

interface ChatContextType {
  conversations: ChatConversation[];
  sendMessage: (jobId: string, senderId: string, senderName: string, senderType: "client" | "fixer", text: string) => Promise<void>;
  getConversation: (jobId: string) => ChatConversation | undefined;
  markMessagesAsRead: (jobId: string, userId: string) => Promise<void>;
  getUnreadCount: (userId: string) => number;
  isLoading: boolean;
}

export const [ChatProvider, useChat] = createContextHook<ChatContextType>(() => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const storedConversations = await AsyncStorage.getItem("conversations");
      if (storedConversations) {
        setConversations(JSON.parse(storedConversations));
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConversations = async (updatedConversations: ChatConversation[]) => {
    try {
      await AsyncStorage.setItem("conversations", JSON.stringify(updatedConversations));
    } catch (error) {
      console.error("Error saving conversations:", error);
    }
  };

  const sendMessage = useCallback(async (
    jobId: string,
    senderId: string,
    senderName: string,
    senderType: "client" | "fixer",
    text: string
  ) => {
    try {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        jobId,
        senderId,
        senderName,
        senderType,
        text,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const updatedConversations = conversations.map(conv => {
        if (conv.jobId === jobId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: text,
            lastMessageTime: newMessage.timestamp,
            unreadCount: conv.unreadCount + 1,
          };
        }
        return conv;
      });

      const existingConv = conversations.find(c => c.jobId === jobId);
      if (!existingConv) {
        const newConversation: ChatConversation = {
          id: Date.now().toString(),
          jobId,
          jobTitle: "",
          clientId: senderType === "client" ? senderId : "",
          clientName: senderType === "client" ? senderName : "",
          fixerId: senderType === "fixer" ? senderId : "",
          fixerName: senderType === "fixer" ? senderName : "",
          lastMessage: text,
          lastMessageTime: newMessage.timestamp,
          unreadCount: 1,
          messages: [newMessage],
        };
        updatedConversations.push(newConversation);
      }

      setConversations(updatedConversations);
      await saveConversations(updatedConversations);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }, [conversations]);

  const getConversation = useCallback((jobId: string) => {
    return conversations.find(conv => conv.jobId === jobId);
  }, [conversations]);

  const markMessagesAsRead = useCallback(async (jobId: string, userId: string) => {
    try {
      const updatedConversations = conversations.map(conv => {
        if (conv.jobId === jobId) {
          const updatedMessages = conv.messages.map(msg => 
            msg.senderId !== userId ? { ...msg, read: true } : msg
          );
          return {
            ...conv,
            messages: updatedMessages,
            unreadCount: 0,
          };
        }
        return conv;
      });
      setConversations(updatedConversations);
      await saveConversations(updatedConversations);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, [conversations]);

  const getUnreadCount = useCallback((userId: string) => {
    return conversations.reduce((total, conv) => {
      const unread = conv.messages.filter(msg => msg.senderId !== userId && !msg.read).length;
      return total + unread;
    }, 0);
  }, [conversations]);

  return useMemo(() => ({
    conversations,
    sendMessage,
    getConversation,
    markMessagesAsRead,
    getUnreadCount,
    isLoading,
  }), [conversations, sendMessage, getConversation, markMessagesAsRead, getUnreadCount, isLoading]);
});
