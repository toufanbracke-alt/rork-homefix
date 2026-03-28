import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback, useMemo } from "react";
import { Call } from "@/types/chat";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

interface CallContextType {
  currentCall: Call | null;
  initiateCall: (
    jobId: string,
    callerId: string,
    callerName: string,
    receiverId: string,
    receiverName: string
  ) => void;
  answerCall: () => void;
  endCall: () => void;
  rejectCall: () => void;
}

export const [CallProvider, useCall] = createContextHook<CallContextType>(() => {
  const [currentCall, setCurrentCall] = useState<Call | null>(null);

  const initiateCall = useCallback((
    jobId: string,
    callerId: string,
    callerName: string,
    receiverId: string,
    receiverName: string
  ) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const call: Call = {
      id: Date.now().toString(),
      jobId,
      callerId,
      callerName,
      receiverId,
      receiverName,
      status: "calling",
      startTime: new Date().toISOString(),
    };

    setCurrentCall(call);

    setTimeout(() => {
      setCurrentCall(prev => prev ? { ...prev, status: "ringing" } : null);
    }, 1000);

    setTimeout(() => {
      setCurrentCall(prev => {
        if (prev && prev.status === "ringing") {
          return { ...prev, status: "connected", startTime: new Date().toISOString() };
        }
        return prev;
      });
    }, 3000);
  }, []);

  const answerCall = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setCurrentCall(prev => {
      if (prev) {
        return { ...prev, status: "connected", startTime: new Date().toISOString() };
      }
      return null;
    });
  }, []);

  const endCall = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    setCurrentCall(prev => {
      if (prev) {
        const endTime = new Date().toISOString();
        const duration = prev.startTime 
          ? Math.floor((new Date(endTime).getTime() - new Date(prev.startTime).getTime()) / 1000)
          : 0;
        
        return { ...prev, status: "ended", endTime, duration };
      }
      return null;
    });

    setTimeout(() => {
      setCurrentCall(null);
    }, 2000);
  }, []);

  const rejectCall = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    setCurrentCall(prev => {
      if (prev) {
        return { ...prev, status: "ended", endTime: new Date().toISOString() };
      }
      return null;
    });

    setTimeout(() => {
      setCurrentCall(null);
    }, 1000);
  }, []);

  return useMemo(() => ({
    currentCall,
    initiateCall,
    answerCall,
    endCall,
    rejectCall,
  }), [currentCall, initiateCall, answerCall, endCall, rejectCall]);
});
