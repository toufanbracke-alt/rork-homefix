export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderType: "client" | "fixer";
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  fixerId: string;
  fixerName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "ended";

export interface Call {
  id: string;
  jobId: string;
  callerId: string;
  callerName: string;
  receiverId: string;
  receiverName: string;
  status: CallStatus;
  startTime?: string;
  endTime?: string;
  duration?: number;
}
