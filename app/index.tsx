import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useUser } from "@/providers/UserProvider";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IndexScreen() {
  const { userType, isLoading } = useUser();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingStatus = await AsyncStorage.getItem("hasOnboarded");
      setHasOnboarded(onboardingStatus === "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setHasOnboarded(false);
    }
  };

  useEffect(() => {
    console.log("Index: Navigation check - isLoading:", isLoading, "hasOnboarded:", hasOnboarded, "userType:", userType);
    if (!isLoading && hasOnboarded !== null) {
      if (hasOnboarded && userType) {
        console.log("Index: Navigating to tabs/home");
        router.replace("/(tabs)/home");
      } else {
        console.log("Index: Navigating to onboarding/welcome");
        router.replace("/(onboarding)/welcome");
      }
    }
  }, [userType, isLoading, hasOnboarded]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFD700" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});