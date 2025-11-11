import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useUser } from "@/providers/UserProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { Bell, Shield, HelpCircle, LogOut, User, ChevronRight, Globe } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";

export default function SettingsScreen() {
  const { userType, setUserType } = useUser();
  const { language, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language);

  const handleSwitchRole = () => {
    const targetRole = userType === "client" ? t('settings.professional') : t('settings.client');
    Alert.alert(
      t('alert.switchRole.title'),
      t('alert.switchRole.message', { role: targetRole }),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('alert.switchRole.switch'),
          onPress: async () => {
            const newType = userType === "client" ? "fixer" : "client";
            setUserType(newType);
            await AsyncStorage.setItem("userType", newType);
            router.replace("/home");
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(t('alert.logout.title'), t('alert.logout.message'), [
      { text: t('common.cancel'), style: "cancel" },
      {
        text: t('settings.logout'),
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
        
        <TouchableOpacity style={styles.settingRow} onPress={handleSwitchRole}>
          <View style={styles.settingLeft}>
            <User size={20} color="#666" />
            <View>
              <Text style={styles.settingText}>{t('settings.switchRole')}</Text>
              <Text style={styles.settingSubtext}>
                {t('settings.currentRole', { 
                  role: userType === "client" ? t('settings.client') : t('settings.professional') 
                })}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Bell size={20} color="#666" />
            <Text style={styles.settingText}>{t('settings.pushNotifications')}</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#e0e0e0", true: "#FFD700" }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Bell size={20} color="#666" />
            <Text style={styles.settingText}>{t('settings.emailUpdates')}</Text>
          </View>
          <Switch
            value={emailUpdates}
            onValueChange={setEmailUpdates}
            trackColor={{ false: "#e0e0e0", true: "#FFD700" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        
        <TouchableOpacity 
          style={styles.settingRow} 
          onPress={() => router.push('/(tabs)/language-selection')}
        >
          <View style={styles.settingLeft}>
            <Globe size={20} color="#666" />
            <View>
              <Text style={styles.settingText}>{t('settings.language')}</Text>
              <Text style={styles.settingSubtext}>
                {currentLanguage?.nativeName || 'English'}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
        
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <HelpCircle size={20} color="#666" />
            <Text style={styles.settingText}>{t('settings.helpCenter')}</Text>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => router.push('/privacy-policy')}
        >
          <View style={styles.settingLeft}>
            <Shield size={20} color="#666" />
            <Text style={styles.settingText}>{t('settings.privacyPolicy')}</Text>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => router.push('/terms-of-service')}
        >
          <View style={styles.settingLeft}>
            <Shield size={20} color="#666" />
            <Text style={styles.settingText}>{t('settings.termsOfService')}</Text>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>{t('settings.logout')}</Text>
      </TouchableOpacity>

      <Text style={styles.version}>{t('settings.version')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 8,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    marginHorizontal: 20,
    marginVertical: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: "#000",
  },
  settingSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    marginTop: 24,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 20,
  },
});