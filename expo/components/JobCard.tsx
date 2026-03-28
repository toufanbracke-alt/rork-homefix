import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MapPin, Clock, AlertCircle, Euro, CheckCircle } from "lucide-react-native";
import { Job } from "@/types/job";
import { useLanguage } from "@/providers/LanguageProvider";
import { useUser } from "@/providers/UserProvider";

interface JobCardProps {
  job: Job;
  showActions?: boolean;
  clientVerified?: boolean;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export function JobCard({ job, showActions = false, clientVerified = false }: JobCardProps) {
  const { t } = useLanguage();
  const { profile } = useUser();
  
  const distance = job.coordinates && profile.coordinates
    ? calculateDistance(
        profile.coordinates.latitude,
        profile.coordinates.longitude,
        job.coordinates.latitude,
        job.coordinates.longitude
      )
    : null;
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "#FF3B30";
      case "medium": return "#FFA500";
      case "low": return "#4CAF50";
      default: return "#999";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#FFA500";
      case "in-progress": return "#007AFF";
      case "completed": return "#4CAF50";
      default: return "#999";
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
          {clientVerified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle size={14} color="#10B981" fill="#10B981" />
            </View>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
          <Text style={styles.statusText}>
            {t(`job.status.${job.status.replace('-', '')}` as any)}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <MapPin size={14} color="#666" />
          <Text style={styles.infoText}>{job.location}</Text>
        </View>
        <View style={styles.infoItem}>
          <Clock size={14} color="#666" />
          <Text style={styles.infoText}>{job.postedAt}</Text>
        </View>
        {distance !== null && (
          <View style={styles.infoItem}>
            <MapPin size={14} color="#FFD700" />
            <Text style={styles.distanceText}>{distance.toFixed(1)} {t('profile.distance')}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.urgencyContainer}>
          <AlertCircle size={14} color={getUrgencyColor(job.urgency)} />
          <Text style={[styles.urgencyText, { color: getUrgencyColor(job.urgency) }]}>
            {t(`job.urgency.${job.urgency}` as any)} {t('job.priority')}
          </Text>
        </View>
        {job.price && (
          <View style={styles.priceContainer}>
            <Euro size={14} color="#000" />
            <Text style={styles.price}>€{job.price}</Text>
          </View>
        )}
      </View>

      {showActions && job.status === "in-progress" && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>{t('job.markComplete')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Text style={styles.secondaryActionText}>{t('job.contact')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: "#D1FAE5",
    borderRadius: 10,
    padding: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
  },
  distanceText: {
    fontSize: 12,
    color: "#FFD700",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urgencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FFD700",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});