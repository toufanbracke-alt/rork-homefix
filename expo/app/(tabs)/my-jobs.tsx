import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useUser } from "@/providers/UserProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { useJobs } from "@/providers/JobsProvider";
import { JobCard } from "@/components/JobCard";
import { router } from "expo-router";
import { useState } from "react";

export default function MyJobsScreen() {
  const { userType } = useUser();
  const { t } = useLanguage();
  const { jobs } = useJobs();
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all");

  const myJobs = userType === "fixer" 
    ? jobs.filter(job => job.fixerId === "current-user")
    : jobs.filter(job => job.clientId === "current-user");

  const filteredJobs = filter === "all" 
    ? myJobs 
    : myJobs.filter(job => job.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {(["all", "pending", "in-progress", "completed"] as const).map((status) => {
          const getFilterText = (status: string) => {
            switch (status) {
              case "all": return t('myJobs.filter.all');
              case "pending": return t('myJobs.filter.pending');
              case "in-progress": return t('myJobs.filter.inProgress');
              case "completed": return t('myJobs.filter.completed');
              default: return status;
            }
          };
          
          return (
            <TouchableOpacity
              key={status}
              style={[styles.filterButton, filter === status && styles.filterButtonActive]}
              onPress={() => setFilter(status)}
            >
              <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
                {getFilterText(status)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredJobs}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/job/${item.id}`)}>
            <JobCard job={item} showActions={true} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {userType === "fixer" 
                ? t('myJobs.noJobsAccepted')
                : t('myJobs.noRepairRequests')}
            </Text>
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
  filterContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
    backgroundColor: "#fff",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#FFD700",
  },
  filterText: {
    fontSize: 12,
    color: "#666",
  },
  filterTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
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