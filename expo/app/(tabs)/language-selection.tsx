import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { router, Stack } from "expo-router";
import { useLanguage } from "@/providers/LanguageProvider";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { Check } from "lucide-react-native";

export default function LanguageSelectionScreen() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageSelect = async (languageCode: string) => {
    await setLanguage(languageCode as any);
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('settings.selectLanguage'),
          headerStyle: { backgroundColor: "#FFD700" },
          headerTintColor: "#000"
        }} 
      />
      <ScrollView style={styles.container}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.languageItem}
            onPress={() => handleLanguageSelect(lang.code)}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{lang.nativeName}</Text>
              <Text style={styles.languageSubtext}>{lang.name}</Text>
            </View>
            {language === lang.code && (
              <Check size={20} color="#FFD700" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  languageSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});