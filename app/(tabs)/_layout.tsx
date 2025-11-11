import { Tabs } from "expo-router";
import { Home, Briefcase, Plus, User, Settings } from "lucide-react-native";
import React from "react";
import { useUser } from "@/providers/UserProvider";
import { useLanguage } from "@/providers/LanguageProvider";

export default function TabLayout() {
  const { userType } = useUser();
  const { t } = useLanguage();

  if (userType === "fixer") {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFD700",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: {
            backgroundColor: "#000",
            borderTopWidth: 0,
          },
          headerStyle: {
            backgroundColor: "#FFD700",
          },
          headerTintColor: "#000",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: t('home.jobs'),
            tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="my-jobs"
          options={{
            title: t('myJobs.title'),
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: t('nav.profile'),
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('nav.settings'),
            tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="create-job"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="language-selection"
          options={{
            href: null,
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: "#FFD700",
        },
        headerTintColor: "#000",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-job"
        options={{
          title: t('createJob.title'),
          tabBarIcon: ({ color }) => <Plus size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-jobs"
        options={{
          title: t('myJobs.myRequests'),
          tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="language-selection"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

