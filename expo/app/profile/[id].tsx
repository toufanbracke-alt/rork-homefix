import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Star, MapPin, Clock, CheckCircle } from "lucide-react-native";
import { mockUserProfile } from "@/mocks/userProfile";

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams();
  const profile = mockUserProfile;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.profession}>{profile.profession}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={20} color="#FFD700" fill="#FFD700" />
          <Text style={styles.rating}>{profile.rating}</Text>
          <Text style={styles.reviewCount}>({profile.reviewCount} reviews)</Text>
        </View>

        <View style={styles.badges}>
          <View style={styles.badge}>
            <CheckCircle size={16} color="#4CAF50" />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
          <View style={styles.badge}>
            <Clock size={16} color="#007AFF" />
            <Text style={styles.badgeText}>{profile.responseTime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{profile.completedJobs}</Text>
          <Text style={styles.statLabel}>Jobs Done</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{profile.yearsExperience}</Text>
          <Text style={styles.statLabel}>Years Exp.</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>{profile.about}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills & Expertise</Text>
        <View style={styles.skillsContainer}>
          {profile.skills.map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#666" />
          <Text style={styles.locationText}>{profile.location}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>John D.</Text>
              <View style={styles.reviewRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={12} color="#FFD700" fill="#FFD700" />
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>
              Excellent work! Fixed my plumbing issue quickly and professionally. Highly recommend!
            </Text>
            <Text style={styles.reviewDate}>2 days ago</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  profession: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 4,
  },
  rating: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
  },
  badges: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 20,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
  },
  reviewCard: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    marginTop: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  reviewRating: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
});