import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockUserProfile } from "@/mocks/userProfile";
import * as Location from "expo-location";
import { Platform } from "react-native";

type UserType = "client" | "fixer";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

interface VerificationDocument {
  type: "id" | "license" | "insurance" | "certification";
  imageUri: string;
  submittedAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  profession: string;
  email: string;
  phone: string;
  location: string;
  coordinates?: LocationCoords;
  avatar?: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  yearsExperience: number;
  responseTime: string;
  about: string;
  skills: string[];
  verificationStatus: VerificationStatus;
  verificationDocuments?: VerificationDocument[];
  verificationSubmittedAt?: string;
  verificationCompletedAt?: string;
}

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationCoords | null>;
  isLoading: boolean;
}

export const [UserProvider, useUser] = createContextHook<UserContextType>(() => {
  const [userType, setUserType] = useState<UserType>("client");
  const [profile, setProfile] = useState<UserProfile>({ ...mockUserProfile });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserType = await AsyncStorage.getItem("userType");
      const storedProfile = await AsyncStorage.getItem("userProfile");
      
      if (storedUserType) {
        setUserType(storedUserType as UserType);
      }
      
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile({ ...parsedProfile, verificationStatus: parsedProfile.verificationStatus || "unverified" });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }, [profile]);

  const handleSetUserType = useCallback(async (type: UserType) => {
    try {
      console.log("UserProvider: Setting user type to:", type);
      setUserType(type);
      console.log("UserProvider: State updated, saving to AsyncStorage...");
      await AsyncStorage.setItem("userType", type);
      console.log("UserProvider: Successfully saved user type to AsyncStorage");
    } catch (error) {
      console.error("UserProvider: Error saving user type:", error);
      throw error;
    }
  }, []);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        if (!navigator.geolocation) {
          console.log('Geolocation is not supported by this browser.');
          return false;
        }
        return true;
      }
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationCoords | null> => {
    try {
      if (Platform.OS === 'web') {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('Error getting location on web:', error);
              resolve(null);
            }
          );
        });
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }, []);

  return useMemo(() => ({
    userType,
    setUserType: handleSetUserType,
    profile,
    updateProfile,
    requestLocationPermission,
    getCurrentLocation,
    isLoading,
  }), [userType, handleSetUserType, profile, updateProfile, requestLocationPermission, getCurrentLocation, isLoading]);
});