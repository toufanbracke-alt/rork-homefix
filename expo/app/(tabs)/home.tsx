import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useUser } from "@/providers/UserProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { useJobs } from "@/providers/JobsProvider";
import { JobCard } from "@/components/JobCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useState } from "react";
import { router } from "expo-router";

export default function TabsHomeScreen() {
  const { userType } = useUser();
  const { t } = useLanguage();
  const { jobs } = useJobs();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredJobs = selectedCategory
    ? jobs.filter(job => job.category === selectedCategory)
    : jobs;

  const availableJobs = userType === "fixer" 
    ? filteredJobs.filter(job => job.status === "pending")
    : filteredJobs;

  if (userType === "fixer") {
    return (
      <View style={styles.container}>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <FlatList
          data={availableJobs}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/job/${item.id}`)}>
              <JobCard job={item} showActions={false} clientVerified={item.clientVerified} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('home.noAvailableJobs')}</Text>
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
        <Text style={styles.subText}>{t('home.subtitle')}</Text>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/(tabs)/create-job")}
      >
        <Text style={styles.createButtonText}>{t('home.createRequest')}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>{t('home.recentRequests')}</Text>
      <FlatList
        data={availableJobs.slice(0, 3)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/job/${item.id}`)}>
            <JobCard job={item} showActions={false} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('home.noRecentRequests')}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  createButton: {
    backgroundColor: "#FFD700",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});