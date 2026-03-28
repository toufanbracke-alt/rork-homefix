import { router } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Wrench, Home } from "lucide-react-native";

export default function OnboardingWelcomeScreen() {
  return (
    <LinearGradient
      colors={["#FFD700", "#FFC700"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>HF</Text>
            </View>
            <Text style={styles.title}>HomeFix</Text>
            <Text style={styles.subtitle}>Your trusted home repair marketplace</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Home size={24} color="#000" />
              <Text style={styles.featureText}>Find trusted professionals</Text>
            </View>
            <View style={styles.feature}>
              <Wrench size={24} color="#000" />
              <Text style={styles.featureText}>Get repairs done quickly</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push("/(onboarding)/select-role")}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: "#FFD700",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#000",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  featuresContainer: {
    gap: 20,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  getStartedButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  getStartedText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
});