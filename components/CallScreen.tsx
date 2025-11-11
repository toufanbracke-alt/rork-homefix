import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react-native";
import { useCall } from "@/providers/CallProvider";
import { useUser } from "@/providers/UserProvider";
import { useEffect, useRef, useState } from "react";

export default function CallScreen() {
  const { currentCall, endCall, answerCall } = useCall();
  const { profile } = useUser();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentCall?.status === "calling" || currentCall?.status === "ringing") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentCall?.status]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (currentCall?.status === "connected" && currentCall.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(currentCall.startTime!).getTime()) / 1000);
        setCallDuration(elapsed);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentCall?.status, currentCall?.startTime, currentCall]);

  if (!currentCall) return null;

  const isIncoming = currentCall.callerId !== profile.id;
  const otherPartyName = isIncoming ? currentCall.callerName : currentCall.receiverName;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (currentCall.status) {
      case "calling":
        return "Calling...";
      case "ringing":
        return isIncoming ? "Incoming call..." : "Ringing...";
      case "connected":
        return formatDuration(callDuration);
      case "ended":
        return "Call ended";
      default:
        return "";
    }
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{otherPartyName.charAt(0).toUpperCase()}</Text>
            </View>
          </Animated.View>
          
          <Text style={styles.name}>{otherPartyName}</Text>
          <Text style={styles.status}>{getStatusText()}</Text>
        </View>

        <View style={styles.bottomSection}>
          {currentCall.status === "connected" && (
            <View style={styles.controlsRow}>
              <TouchableOpacity 
                style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                onPress={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff size={28} color="#fff" /> : <Mic size={28} color="#fff" />}
                <Text style={styles.controlLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlButton, isSpeaker && styles.controlButtonActive]}
                onPress={() => setIsSpeaker(!isSpeaker)}
              >
                {isSpeaker ? <Volume2 size={28} color="#fff" /> : <VolumeX size={28} color="#fff" />}
                <Text style={styles.controlLabel}>Speaker</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actionsRow}>
            {isIncoming && currentCall.status === "ringing" && (
              <TouchableOpacity style={styles.answerButton} onPress={answerCall}>
                <Phone size={32} color="#fff" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.endButton} onPress={endCall}>
              <PhoneOff size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#000",
  },
  name: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  status: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
  },
  bottomSection: {
    gap: 32,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  controlButton: {
    alignItems: "center",
    gap: 8,
    padding: 16,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  controlButtonActive: {
    backgroundColor: "rgba(255, 215, 0, 0.3)",
  },
  controlLabel: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
  },
  answerButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  endButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
