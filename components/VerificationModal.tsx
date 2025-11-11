import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Image, Platform } from "react-native";
import { useState } from "react";
import { X, Shield, Camera, CheckCircle, Clock, AlertCircle } from "lucide-react-native";
import { useUser } from "@/providers/UserProvider";
import * as ImagePicker from "expo-image-picker";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
}

interface DocumentUpload {
  type: "id" | "license" | "insurance" | "certification";
  label: string;
  description: string;
  imageUri?: string;
  required: boolean;
}

export default function VerificationModal({ visible, onClose }: VerificationModalProps) {
  const { profile, updateProfile, userType } = useUser();
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      type: "id",
      label: "Government ID",
      description: "Driver's license, passport, or state ID",
      required: true,
    },
    ...(userType === "fixer"
      ? [
          {
            type: "license" as const,
            label: "Professional License",
            description: "Trade license or certification",
            required: true,
          },
          {
            type: "insurance" as const,
            label: "Liability Insurance",
            description: "Proof of insurance coverage",
            required: false,
          },
          {
            type: "certification" as const,
            label: "Additional Certifications",
            description: "Optional credentials",
            required: false,
          },
        ]
      : []),
  ]);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async (documentType: DocumentUpload["type"]) => {
    try {
      if (Platform.OS === 'web') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.type === documentType ? { ...doc, imageUri: result.assets[0].uri } : doc
            )
          );
        }
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.status !== 'granted') {
          Alert.alert('Permission Required', 'Please allow access to your photos to upload documents.');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.type === documentType ? { ...doc, imageUri: result.assets[0].uri } : doc
            )
          );
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    const requiredDocs = documents.filter((doc) => doc.required);
    const missingDocs = requiredDocs.filter((doc) => !doc.imageUri);

    if (missingDocs.length > 0) {
      Alert.alert(
        "Missing Documents",
        `Please upload the following required documents:\n${missingDocs.map((doc) => `• ${doc.label}`).join("\n")}`
      );
      return;
    }

    try {
      setSubmitting(true);
      
      const verificationDocuments = documents
        .filter((doc) => doc.imageUri)
        .map((doc) => ({
          type: doc.type,
          imageUri: doc.imageUri!,
          submittedAt: new Date().toISOString(),
        }));

      await updateProfile({
        verificationStatus: "pending",
        verificationDocuments,
        verificationSubmittedAt: new Date().toISOString(),
      });

      Alert.alert(
        "Verification Submitted",
        "Your documents have been submitted for review. We'll notify you once the verification is complete (typically within 24-48 hours).",
        [{ text: "OK", onPress: onClose }]
      );
    } catch (error) {
      console.error("Error submitting verification:", error);
      Alert.alert("Error", "Failed to submit verification. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    switch (profile.verificationStatus) {
      case "verified":
        return <CheckCircle size={24} color="#10B981" />;
      case "pending":
        return <Clock size={24} color="#F59E0B" />;
      case "rejected":
        return <AlertCircle size={24} color="#EF4444" />;
      default:
        return <Shield size={24} color="#666" />;
    }
  };

  const getStatusText = () => {
    switch (profile.verificationStatus) {
      case "verified":
        return "Your identity is verified";
      case "pending":
        return "Verification pending review";
      case "rejected":
        return "Verification rejected - please resubmit";
      default:
        return "Verify your identity to build trust";
    }
  };

  const getStatusColor = () => {
    switch (profile.verificationStatus) {
      case "verified":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "rejected":
        return "#EF4444";
      default:
        return "#666";
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              {getStatusIcon()}
              <Text style={styles.modalTitle}>Identity Verification</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={[styles.statusBanner, { backgroundColor: getStatusColor() + "20" }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {profile.verificationStatus === "verified" ? (
              <View style={styles.verifiedContainer}>
                <CheckCircle size={64} color="#10B981" />
                <Text style={styles.verifiedTitle}>You&apos;re verified!</Text>
                <Text style={styles.verifiedText}>
                  Your identity has been confirmed. This badge will be displayed on your profile.
                </Text>
                {profile.verificationCompletedAt && (
                  <Text style={styles.verifiedDate}>
                    Verified on {new Date(profile.verificationCompletedAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ) : profile.verificationStatus === "pending" ? (
              <View style={styles.pendingContainer}>
                <Clock size={64} color="#F59E0B" />
                <Text style={styles.pendingTitle}>Under Review</Text>
                <Text style={styles.pendingText}>
                  Your documents are being reviewed by our team. This usually takes 24-48 hours.
                </Text>
                {profile.verificationSubmittedAt && (
                  <Text style={styles.submittedDate}>
                    Submitted on {new Date(profile.verificationSubmittedAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ) : (
              <>
                <Text style={styles.instructions}>
                  {userType === "fixer"
                    ? "Upload clear photos of your documents to verify your professional identity. This helps customers trust your services."
                    : "Upload a clear photo of your government-issued ID to verify your identity. This helps professionals feel secure working with you."}
                </Text>

                <View style={styles.documentsContainer}>
                  {documents.map((doc) => (
                    <View key={doc.type} style={styles.documentCard}>
                      <View style={styles.documentHeader}>
                        <View>
                          <Text style={styles.documentLabel}>
                            {doc.label} {doc.required && <Text style={styles.required}>*</Text>}
                          </Text>
                          <Text style={styles.documentDescription}>{doc.description}</Text>
                        </View>
                      </View>

                      {doc.imageUri ? (
                        <View style={styles.imagePreview}>
                          <Image source={{ uri: doc.imageUri }} style={styles.previewImage} />
                          <TouchableOpacity
                            style={styles.changeButton}
                            onPress={() => pickImage(doc.type)}
                          >
                            <Text style={styles.changeButtonText}>Change</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.uploadButton}
                          onPress={() => pickImage(doc.type)}
                        >
                          <Camera size={24} color="#666" />
                          <Text style={styles.uploadButtonText}>Upload Photo</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>

                <View style={styles.infoBox}>
                  <Shield size={20} color="#3B82F6" />
                  <Text style={styles.infoText}>
                    Your documents are encrypted and securely stored. We only use them for
                    verification purposes.
                  </Text>
                </View>
              </>
            )}
          </ScrollView>

          {profile.verificationStatus !== "verified" && profile.verificationStatus !== "pending" && (
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? "Submitting..." : "Submit for Verification"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  statusBanner: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  instructions: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 20,
  },
  documentsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  documentCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  documentHeader: {
    marginBottom: 12,
  },
  documentLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  required: {
    color: "#EF4444",
  },
  documentDescription: {
    fontSize: 13,
    color: "#666",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  uploadButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  imagePreview: {
    gap: 8,
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  changeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#000",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  changeButtonText: {
    fontSize: 14,
    color: "#FFD700",
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    margin: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
  },
  verifiedContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  verifiedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 16,
  },
  verifiedText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  verifiedDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 12,
  },
  pendingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  pendingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 16,
  },
  pendingText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  submittedDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 12,
  },
});
