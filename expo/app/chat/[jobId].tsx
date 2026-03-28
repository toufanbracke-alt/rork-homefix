import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Send, Phone } from "lucide-react-native";
import { useUser } from "@/providers/UserProvider";
import { useChat } from "@/providers/ChatProvider";
import { useJobs } from "@/providers/JobsProvider";
import { useCall } from "@/providers/CallProvider";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/providers/LanguageProvider";

export default function ChatScreen() {
  const { jobId } = useLocalSearchParams();
  const { profile, userType } = useUser();
  const { sendMessage, getConversation, markMessagesAsRead } = useChat();
  const { getJobById } = useJobs();
  const { initiateCall } = useCall();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  
  const job = getJobById(jobId as string);
  const conversation = getConversation(jobId as string);

  useEffect(() => {
    if (conversation) {
      markMessagesAsRead(jobId as string, profile.id);
    }
  }, [conversation, jobId, markMessagesAsRead, profile.id]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessage(
        jobId as string,
        profile.id,
        profile.name,
        userType,
        message.trim()
      );
      setMessage("");
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const otherPartyName = userType === "client" 
    ? (job?.fixerName || t("chat.professional"))
    : (job?.clientName || t("chat.customer"));

  const handleCall = () => {
    if (!job) return;
    
    const otherPartyId = userType === "client" ? (job.fixerId || "") : job.clientId;
    const otherPartyName = userType === "client" ? (job.fixerName || "Professional") : job.clientName;
    
    if (!otherPartyId) return;
    
    initiateCall(
      jobId as string,
      profile.id,
      profile.name,
      otherPartyId,
      otherPartyName
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: otherPartyName,
          headerRight: () => (
            <TouchableOpacity onPress={handleCall} style={styles.callButton}>
              <Phone size={24} color="#000" />
            </TouchableOpacity>
          ),
        }} 
      />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {!conversation || conversation.messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("chat.noMessages")}</Text>
              <Text style={styles.emptySubtext}>{t("chat.startConversation")}</Text>
            </View>
          ) : (
            conversation.messages.map((msg, index) => {
              const isOwnMessage = msg.senderId === profile.id;
              const showDate = index === 0 || 
                new Date(msg.timestamp).toDateString() !== new Date(conversation.messages[index - 1].timestamp).toDateString();
              
              return (
                <View key={msg.id}>
                  {showDate && (
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateText}>
                        {new Date(msg.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  <View style={[
                    styles.messageBubble,
                    isOwnMessage ? styles.ownMessage : styles.otherMessage
                  ]}>
                    {!isOwnMessage && (
                      <Text style={styles.senderName}>{msg.senderName}</Text>
                    )}
                    <Text style={[
                      styles.messageText,
                      isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                    ]}>
                      {msg.text}
                    </Text>
                    <Text style={[
                      styles.timestamp,
                      isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
                    ]}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t("chat.typeMessage")}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? "#000" : "#999"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  ownMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#FFD700",
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "#000",
  },
  otherMessageText: {
    color: "#000",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  ownTimestamp: {
    color: "#666",
    textAlign: "right",
  },
  otherTimestamp: {
    color: "#999",
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
  callButton: {
    padding: 8,
    marginRight: 8,
  },
});
