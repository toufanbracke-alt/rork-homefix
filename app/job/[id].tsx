import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MapPin, Clock, AlertCircle, Star, Euro, Check, X, CheckCircle, Phone } from "lucide-react-native";
import { useUser } from "@/providers/UserProvider";
import { useJobs } from "@/providers/JobsProvider";
import { useNotifications } from "@/providers/NotificationProvider";
import { useState } from "react";

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { userType, profile } = useUser();
  const { getJobById, addOffer, acceptOffer, declineOffer, completeJob } = useJobs();
  const { sendNotification } = useNotifications();
  const job = getJobById(id as string);
  
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  if (!job) {
    return (
      <View style={styles.container}>
        <Text>Job not found</Text>
      </View>
    );
  }

  const handleSubmitOffer = async () => {
    if (!offerPrice || parseFloat(offerPrice) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }
    
    try {
      await addOffer(id as string, {
        fixerId: profile.id,
        fixerName: profile.name,
        fixerRating: profile.rating,
        fixerVerified: profile.verificationStatus === "verified",
        fixerPhone: profile.phone,
        price: parseFloat(offerPrice),
        message: offerMessage,
      });
      
      await sendNotification(
        job.clientId,
        "new_offer",
        "New Quote Received",
        `${profile.name} sent you a quote of €${offerPrice} for "${job.title}"`,
        { jobId: id as string }
      );
      
      Alert.alert("Success", "Your offer has been submitted!");
      setShowOfferForm(false);
      setOfferPrice("");
      setOfferMessage("");
      setQuoteSubmitted(true);
    } catch (error) {
      Alert.alert("Error", "Failed to submit offer");
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    Alert.alert("Accept Offer", "Are you sure you want to accept this offer?", [
      { text: "Cancel", style: "cancel" },
      { text: "Accept", onPress: async () => {
        try {
          await acceptOffer(id as string, offerId);
          
          const acceptedOffer = job.offers?.find(o => o.id === offerId);
          if (acceptedOffer) {
            await sendNotification(
              acceptedOffer.fixerId,
              "offer_accepted",
              "Quote Accepted!",
              `Your quote for "${job.title}" was accepted!`,
              { jobId: id as string }
            );
          }
          
          Alert.alert("Success", "Offer accepted! The professional will be notified.");
        } catch (error) {
          Alert.alert("Error", "Failed to accept offer");
        }
      }},
    ]);
  };

  const handleDeclineOffer = async (offerId: string) => {
    try {
      await declineOffer(id as string, offerId);
      
      const declinedOffer = job.offers?.find(o => o.id === offerId);
      if (declinedOffer) {
        await sendNotification(
          declinedOffer.fixerId,
          "offer_declined",
          "Quote Declined",
          `Your quote for "${job.title}" was declined`,
          { jobId: id as string }
        );
      }
      
      Alert.alert("Success", "Offer declined");
    } catch (error) {
      Alert.alert("Error", "Failed to decline offer");
    }
  };



  const handleCompleteJob = async () => {
    Alert.alert(
      "Complete Task",
      "Are you sure the task has been completed? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            try {
              await completeJob(id as string);
              
              if (job.fixerId) {
                await sendNotification(
                  job.fixerId,
                  "job_completed",
                  "Job Completed",
                  `"${job.title}" has been marked as completed!`,
                  { jobId: id as string }
                );
              }
              
              Alert.alert("Success", "Task marked as completed!");
            } catch (error) {
              Alert.alert("Error", "Failed to complete task");
            }
          },
        },
      ]
    );
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
    <ScrollView style={styles.container}>
      {job.images && job.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {job.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{job.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
            <Text style={styles.statusText}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace("-", " ")}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MapPin size={16} color="#666" />
            <Text style={styles.infoText}>{job.location}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={16} color="#666" />
            <Text style={styles.infoText}>{job.postedAt}</Text>
          </View>
        </View>

        <View style={styles.urgencyRow}>
          <AlertCircle size={16} color={job.urgency === "high" ? "#FF3B30" : job.urgency === "medium" ? "#FFA500" : "#4CAF50"} />
          <Text style={styles.urgencyText}>
            {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{job.category}</Text>
          </View>
        </View>

        {job.price && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget</Text>
            <Text style={styles.price}>€{job.price}</Text>
          </View>
        )}

        {userType === "fixer" && job.clientPhone && (job.status === "in-progress" || job.status === "completed") && (
          <View style={styles.clientCard}>
            <Text style={styles.sectionTitle}>Client Contact Information</Text>
            <View style={styles.contactInfoCard}>
              <Text style={styles.contactInfoTitle}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <Phone size={16} color="#007AFF" />
                <Text style={styles.phoneNumber}>{job.clientPhone}</Text>
              </View>
            </View>
          </View>
        )}

        {userType === "fixer" && job.status === "pending" && (
          <View style={styles.actionContainer}>
            {quoteSubmitted && !showOfferForm ? (
              <View style={styles.quoteSubmittedContainer}>
                <View style={styles.quoteSubmittedBadge}>
                  <Check size={24} color="#4CAF50" />
                  <Text style={styles.quoteSubmittedText}>Quote Submitted</Text>
                </View>
                <TouchableOpacity 
                  style={styles.addNewQuoteButton} 
                  onPress={() => {
                    setQuoteSubmitted(false);
                    setShowOfferForm(true);
                  }}
                >
                  <Euro size={20} color="#000" />
                  <Text style={styles.addNewQuoteButtonText}>Add New Quote</Text>
                </TouchableOpacity>
              </View>
            ) : !showOfferForm ? (
              <TouchableOpacity 
                style={styles.submitOfferButton} 
                onPress={() => setShowOfferForm(true)}
              >
                <Euro size={20} color="#000" />
                <Text style={styles.submitOfferButtonText}>Submit Your Quote</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.offerForm}>
                <Text style={styles.offerFormTitle}>Submit Your Quote</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Price (€)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your price"
                    keyboardType="numeric"
                    value={offerPrice}
                    onChangeText={setOfferPrice}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Message (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Add a message for the client"
                    multiline
                    numberOfLines={4}
                    value={offerMessage}
                    onChangeText={setOfferMessage}
                  />
                </View>
                <View style={styles.offerFormActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => {
                      setShowOfferForm(false);
                      if (quoteSubmitted) {
                        setOfferPrice("");
                        setOfferMessage("");
                      }
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleSubmitOffer}
                  >
                    <Text style={styles.submitButtonText}>Submit Offer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {userType === "client" && job.offers && job.offers.length > 0 && job.status === "pending" && (
          <View style={styles.offersSection}>
            <Text style={styles.sectionTitle}>Offers from Professionals</Text>
            {job.offers.map((offer) => (
              <View key={offer.id} style={styles.offerCard}>
                <View style={styles.offerHeader}>
                  <View style={styles.offerFixerInfo}>
                    <View style={styles.offerFixerNameRow}>
                      <Text style={styles.offerFixerName}>{offer.fixerName}</Text>
                      {offer.fixerVerified && (
                        <View style={styles.verifiedBadge}>
                          <CheckCircle size={14} color="#10B981" fill="#10B981" />
                        </View>
                      )}
                    </View>
                    <View style={styles.offerFixerRating}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.offerRatingText}>{offer.fixerRating}</Text>
                    </View>
                  </View>
                  <Text style={styles.offerPrice}>€{offer.price}</Text>
                </View>
                {offer.message && (
                  <Text style={styles.offerMessage}>{offer.message}</Text>
                )}
                <Text style={styles.offerTime}>{offer.timestamp}</Text>
                {offer.status === "pending" && (
                  <View style={styles.offerActions}>
                    <TouchableOpacity 
                      style={styles.acceptOfferButton}
                      onPress={() => handleAcceptOffer(offer.id)}
                    >
                      <Check size={16} color="#fff" />
                      <Text style={styles.acceptOfferText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.declineOfferButton}
                      onPress={() => handleDeclineOffer(offer.id)}
                    >
                      <X size={16} color="#666" />
                      <Text style={styles.declineOfferText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {offer.status === "accepted" && (
                  <View style={styles.acceptedBadge}>
                    <Text style={styles.acceptedText}>Accepted</Text>
                  </View>
                )}
                {offer.status === "declined" && (
                  <View style={styles.declinedBadge}>
                    <Text style={styles.declinedText}>Declined</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {userType === "client" && job.fixerId && (
          <View style={styles.fixerCard}>
            <Text style={styles.sectionTitle}>Assigned Professional</Text>
            <TouchableOpacity 
              style={styles.fixerInfo}
              onPress={() => router.push(`/profile/${job.fixerId}`)}
            >
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" }}
                style={styles.fixerAvatar}
              />
              <View style={styles.fixerDetails}>
                <Text style={styles.fixerName}>Mike Johnson</Text>
                <View style={styles.fixerRating}>
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>4.8 (120 reviews)</Text>
                </View>
              </View>
            </TouchableOpacity>

            {job.fixerPhone && (job.status === "in-progress" || job.status === "completed") && (
              <View style={styles.contactInfoCard}>
                <Text style={styles.contactInfoTitle}>Contact Information</Text>
                <View style={styles.phoneRow}>
                  <Phone size={16} color="#007AFF" />
                  <Text style={styles.phoneNumber}>{job.fixerPhone}</Text>
                </View>
              </View>
            )}

            {job.status === "in-progress" && (
              <TouchableOpacity style={styles.completeButton} onPress={handleCompleteJob}>
                <CheckCircle size={20} color="#fff" />
                <Text style={styles.completeButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
            {job.status === "completed" && (
              <View style={styles.completedBanner}>
                <CheckCircle size={24} color="#4CAF50" />
                <Text style={styles.completedBannerText}>Task Completed</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  imageScroll: {
    height: 250,
    backgroundColor: "#000",
  },
  image: {
    width: 300,
    height: 250,
    marginRight: 8,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  urgencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  categoryBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  actionContainer: {
    gap: 12,
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  contactButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  fixerCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  fixerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  fixerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  fixerDetails: {
    flex: 1,
  },
  fixerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  fixerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
  },

  submitOfferButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitOfferButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  offerForm: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    gap: 16,
  },
  offerFormTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  offerFormActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#FFD700",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  offersSection: {
    marginTop: 20,
    gap: 16,
  },
  offerCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  offerFixerInfo: {
    flex: 1,
    gap: 4,
  },
  offerFixerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifiedBadge: {
    backgroundColor: "#D1FAE5",
    borderRadius: 10,
    padding: 2,
  },
  offerFixerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  offerFixerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  offerRatingText: {
    fontSize: 12,
    color: "#666",
  },
  offerPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  offerMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  offerTime: {
    fontSize: 12,
    color: "#999",
  },
  offerActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  acceptOfferButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  acceptOfferText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  declineOfferButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  declineOfferText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },
  acceptedBadge: {
    backgroundColor: "#E8F5E9",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptedText: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 12,
  },
  declinedBadge: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  declinedText: {
    color: "#999",
    fontWeight: "600",
    fontSize: 12,
  },
  quoteSubmittedContainer: {
    gap: 12,
  },
  quoteSubmittedBadge: {
    backgroundColor: "#E8F5E9",
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quoteSubmittedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  addNewQuoteButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  addNewQuoteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  completedBanner: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  completedBannerText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfoCard: {
    backgroundColor: "#F0F9FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  contactInfoTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#0C4A6E",
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#007AFF",
  },
  clientCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
});