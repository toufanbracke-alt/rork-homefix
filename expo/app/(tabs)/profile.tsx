import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useUser } from "@/providers/UserProvider";
import { Star, MapPin, Phone, Mail, Edit2, Navigation, Shield, CheckCircle } from "lucide-react-native";
import { useLanguage } from "@/providers/LanguageProvider";
import EditProfileModal from "@/components/EditProfileModal";
import VerificationModal from "@/components/VerificationModal";

export default function ProfileScreen() {
  const { userType, profile, requestLocationPermission, getCurrentLocation, updateProfile } = useUser();
  const { t } = useLanguage();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: profile.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400" }}
            style={styles.avatar}
          />
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Edit2 size={16} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{profile.name}</Text>
          {profile.verificationStatus === "verified" && (
            <View style={styles.verifiedBadge}>
              <CheckCircle size={16} color="#10B981" fill="#10B981" />
            </View>
          )}
        </View>
        <Text style={styles.role}>
          {userType === "fixer" ? profile.profession : t('profile.homeowner')}
        </Text>
        
        {userType === "fixer" && (
          <View style={styles.ratingContainer}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{profile.rating}</Text>
            <Text style={styles.reviewCount}>({profile.reviewCount} {t('profile.reviews')})</Text>
          </View>
        )}
      </View>

      <View style={styles.verificationSection}>
        <View style={styles.verificationHeader}>
          <Shield size={20} color="#666" />
          <Text style={styles.verificationTitle}>Identity Verification</Text>
        </View>
        
        {profile.verificationStatus === "verified" ? (
          <View style={styles.verificationCard}>
            <CheckCircle size={24} color="#10B981" />
            <View style={styles.verificationInfo}>
              <Text style={styles.verificationStatusText}>Verified Identity</Text>
              <Text style={styles.verificationDescription}>Your identity has been confirmed</Text>
            </View>
            <TouchableOpacity onPress={() => setShowVerificationModal(true)}>
              <Text style={styles.viewButton}>View</Text>
            </TouchableOpacity>
          </View>
        ) : profile.verificationStatus === "pending" ? (
          <View style={styles.verificationCard}>
            <ActivityIndicator size="small" color="#F59E0B" />
            <View style={styles.verificationInfo}>
              <Text style={styles.verificationStatusText}>Under Review</Text>
              <Text style={styles.verificationDescription}>We&apos;re reviewing your documents</Text>
            </View>
            <TouchableOpacity onPress={() => setShowVerificationModal(true)}>
              <Text style={styles.viewButton}>View</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.verificationCard}
            onPress={() => setShowVerificationModal(true)}
          >
            <Shield size={24} color="#EF4444" />
            <View style={styles.verificationInfo}>
              <Text style={styles.verificationStatusText}>Not Verified</Text>
              <Text style={styles.verificationDescription}>Verify your identity to build trust</Text>
            </View>
            <Text style={styles.startButton}>Start</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>{t('profile.contactInfo')}</Text>
        
        <TouchableOpacity 
          style={styles.infoRow}
          onPress={() => setShowEditModal(true)}
        >
          <Phone size={16} color="#666" />
          <Text style={styles.infoText}>{profile.phone}</Text>
          <Edit2 size={14} color="#999" style={styles.editIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.infoRow}
          onPress={() => setShowEditModal(true)}
        >
          <Mail size={16} color="#666" />
          <Text style={styles.infoText}>{profile.email}</Text>
          <Edit2 size={14} color="#999" style={styles.editIcon} />
        </TouchableOpacity>
        
        <View style={styles.locationContainer}>
          <TouchableOpacity 
            style={styles.infoRow}
            onPress={() => setShowEditModal(true)}
          >
            <MapPin size={16} color="#666" />
            <Text style={styles.infoText}>{profile.location}</Text>
            <Edit2 size={14} color="#999" style={styles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={async () => {
              setLoadingLocation(true);
              const hasPermission = await requestLocationPermission();
              if (!hasPermission) {
                Alert.alert(t('common.error'), t('profile.locationPermissionDenied'));
                setLoadingLocation(false);
                return;
              }
              
              const coords = await getCurrentLocation();
              if (coords) {
                await updateProfile({ coordinates: coords });
                Alert.alert(t('common.success'), t('profile.profileUpdated'));
              } else {
                Alert.alert(t('common.error'), t('profile.updateError'));
              }
              setLoadingLocation(false);
            }}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color="#FFD700" />
            ) : (
              <>
                <Navigation size={14} color="#FFD700" />
                <Text style={styles.locationButtonText}>{t('profile.useCurrentLocation')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {userType === "fixer" && (
        <>
          <View style={styles.infoSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('profile.about')}</Text>
              <TouchableOpacity onPress={() => setShowEditModal(true)}>
                <Edit2 size={16} color="#999" />
              </TouchableOpacity>
            </View>
            <Text style={styles.aboutText}>{profile.about}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('profile.skills')}</Text>
              <TouchableOpacity onPress={() => setShowEditModal(true)}>
                <Edit2 size={16} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.skillsContainer}>
              {profile.skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{profile.completedJobs}</Text>
              <Text style={styles.statLabel}>{t('profile.jobsDone')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{profile.yearsExperience}</Text>
              <Text style={styles.statLabel}>{t('profile.yearsExp')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{profile.responseTime}</Text>
              <Text style={styles.statLabel}>{t('profile.response')}</Text>
            </View>
          </View>
        </>
      )}

      {userType === "client" && (
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>{t('profile.requests')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>{t('profile.completed')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>{t('profile.avgRating')}</Text>
          </View>
        </View>
      )}
      
      <EditProfileModal 
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
      
      <VerificationModal
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFD700",
    padding: 8,
    borderRadius: 20,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  verifiedBadge: {
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    padding: 2,
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
  },
  infoSection: {
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    paddingVertical: 4,
  },
  editIcon: {
    marginLeft: "auto",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  locationContainer: {
    gap: 8,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#000",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  locationButtonText: {
    fontSize: 14,
    color: "#FFD700",
    fontWeight: "600",
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
  },
  statsSection: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
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
  verificationSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 8,
  },
  verificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  verificationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  verificationInfo: {
    flex: 1,
  },
  verificationStatusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  verificationDescription: {
    fontSize: 12,
    color: "#666",
  },
  viewButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  startButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFD700",
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});