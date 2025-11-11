import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Camera, MapPin } from "lucide-react-native";
import { categories } from "@/constants/categories";
import * as ImagePicker from "expo-image-picker";
import { useLanguage } from "@/providers/LanguageProvider";
import { useUser } from "@/providers/UserProvider";
import { useJobs } from "@/providers/JobsProvider";

export default function CreateJobScreen() {
  const { t } = useLanguage();
  const { requestLocationPermission, getCurrentLocation, profile } = useUser();
  const { createJob } = useJobs();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium");
  const [images, setImages] = useState<string[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages].slice(0, 3));
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !location) {
      Alert.alert(t('createJob.error'), t('createJob.fillAllFields'));
      return;
    }

    try {
      await createJob({
        title,
        description,
        category,
        urgency,
        location,
        coordinates: coordinates || undefined,
        images,
        clientId: profile.id,
        clientName: profile.name,
        clientVerified: profile.verificationStatus === "verified",
        clientPhone: profile.phone,
      });

      Alert.alert(t('createJob.success'), t('createJob.requestPosted'), [
        { text: "OK", onPress: () => router.push("/(tabs)/my-jobs") }
      ]);
    } catch (error) {
      console.error("Error creating job:", error);
      Alert.alert(t('createJob.error'), t('createJob.submitError') || "Failed to create job");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>{t('createJob.titleField')} {t('createJob.required')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('createJob.titlePlaceholder')}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>{t('createJob.description')} {t('createJob.required')}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={t('createJob.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>{t('createJob.category')} {t('createJob.required')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, category === cat.id && styles.categoryChipActive]}
              onPress={() => setCategory(cat.id)}
            >
              <Text style={[styles.categoryText, category === cat.id && styles.categoryTextActive]}>
                {t(`category.${cat.id}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>{t('createJob.location')} {t('createJob.required')}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder={t('createJob.locationPlaceholder')}
            value={location}
            onChangeText={setLocation}
          />
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
                setCoordinates(coords);
                setLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
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
              <MapPin size={20} color="#FFD700" />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{t('createJob.urgencyLevel')}</Text>
        <View style={styles.urgencyContainer}>
          {(["low", "medium", "high"] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.urgencyButton, urgency === level && styles.urgencyButtonActive]}
              onPress={() => setUrgency(level)}
            >
              <Text style={[styles.urgencyText, urgency === level && styles.urgencyTextActive]}>
                {t(`job.urgency.${level}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t('createJob.photos')}</Text>
        <View style={styles.imageContainer}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.uploadedImage} />
          ))}
          {images.length < 3 && (
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Camera size={24} color="#999" />
              <Text style={styles.imageButtonText}>{t('createJob.addPhoto')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{t('createJob.postRequest')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  locationButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryChipActive: {
    backgroundColor: "#FFD700",
    borderColor: "#FFD700",
  },
  categoryText: {
    color: "#666",
  },
  categoryTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  urgencyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  urgencyButtonActive: {
    backgroundColor: "#FFD700",
    borderColor: "#FFD700",
  },
  urgencyText: {
    color: "#666",
  },
  urgencyTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  imageContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  imageButton: {
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imageButtonText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
});