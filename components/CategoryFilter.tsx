import { StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { categories } from "@/constants/categories";
import { useLanguage } from "@/providers/LanguageProvider";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { t } = useLanguage();
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        style={[styles.chip, !selectedCategory && styles.chipActive]}
        onPress={() => onSelectCategory(null)}
      >
        <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>
          {t('category.all')}
        </Text>
      </TouchableOpacity>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.chip, selectedCategory === category.id && styles.chipActive]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text style={[styles.chipText, selectedCategory === category.id && styles.chipTextActive]}>
            {t(`category.${category.id}` as any)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#FFD700",
  },
  chipText: {
    fontSize: 14,
    color: "#666",
  },
  chipTextActive: {
    color: "#000",
    fontWeight: "600",
  },
});