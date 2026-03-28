import { router } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, Wrench } from "lucide-react-native";
import { useUser } from "@/providers/UserProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SelectRoleScreen() {
  const { setUserType } = useUser();

  const handleSelectRole = async (role: "client" | "fixer") => {
    try {
      console.log("Selecting role:", role);
      await setUserType(role);
      console.log("User type set successfully");
      await AsyncStorage.setItem("hasOnboarded", "true");
      console.log("Onboarding status saved");
      console.log("Navigating to home...");
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Error selecting role:", error);
      Alert.alert(
        "Error",
        "Something went wrong while setting up your account. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>How will you use HomeFix?</Text>
          <Text style={styles.subtitle}>You can change this later in settings</Text>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelectRole("client")}
            >
              <Home size={48} color="#FFD700" />
              <Text style={styles.cardTitle}>I need repairs</Text>
              <Text style={styles.cardDescription}>
                Find trusted professionals to fix issues in your home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelectRole("fixer")}
            >
              <Wrench size={48} color="#FFD700" />
              <Text style={styles.cardTitle}>I&apos;m a professional</Text>
              <Text style={styles.cardDescription}>
                Offer your services and earn money fixing homes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  cardsContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});