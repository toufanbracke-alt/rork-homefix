import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { UserProvider } from "@/providers/UserProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { JobsProvider } from "@/providers/JobsProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="job/[id]" options={{ 
        title: "Job Details",
        headerStyle: { backgroundColor: "#FFD700" },
        headerTintColor: "#000"
      }} />
      <Stack.Screen name="profile/[id]" options={{ 
        title: "Profile",
        headerStyle: { backgroundColor: "#FFD700" },
        headerTintColor: "#000"
      }} />
      <Stack.Screen name="index" options={{ 
        headerShown: false
      }} />

    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <LanguageProvider>
          <JobsProvider>
            <UserProvider>
              <NotificationProvider>
                <RootLayoutNav />
              </NotificationProvider>
            </UserProvider>
          </JobsProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});