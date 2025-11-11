import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useLanguage } from "@/providers/LanguageProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsOfServiceScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('settings.termsOfService'),
          headerStyle: { backgroundColor: "#FFD700" },
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "bold" },
        }} 
      />
      <ScrollView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.content}>
          <Text style={styles.title}>Terms of Service for HomeFix</Text>
          <Text style={styles.lastUpdated}>Last Updated: 18/09/2025</Text>
          
          <Text style={styles.paragraph}>
            Welcome to HomeFix! These Terms of Service (&quot;Terms&quot;) govern your access and use of the HomeFix mobile application, website, and related services (collectively, the &quot;App&quot;). By using HomeFix, you agree to these Terms. If you do not agree, please do not use our services.
          </Text>

          <Text style={styles.sectionTitle}>1. About HomeFix</Text>
          <Text style={styles.paragraph}>
            HomeFix is an intermediary platform that connects individuals or households (&quot;Clients&quot;) who need home repair or maintenance services with professional service providers (&quot;Agents&quot;). HomeFix does not itself provide repair services.
          </Text>

          <Text style={styles.sectionTitle}>2. Eligibility</Text>
          <Text style={styles.bulletPoint}>• You must be at least 18 years old to use HomeFix.</Text>
          <Text style={styles.bulletPoint}>• By registering, you confirm that the information you provide is accurate and truthful.</Text>
          <Text style={styles.bulletPoint}>• Agents must comply with applicable laws, hold relevant licenses or qualifications (where required), and agree to verification checks.</Text>

          <Text style={styles.sectionTitle}>3. Accounts</Text>
          <Text style={styles.bulletPoint}>• You must create an account to use certain features of HomeFix.</Text>
          <Text style={styles.bulletPoint}>• You are responsible for maintaining the confidentiality of your login details.</Text>
          <Text style={styles.bulletPoint}>• You agree to notify us immediately if you suspect unauthorized use of your account.</Text>
          <Text style={styles.bulletPoint}>• HomeFix reserves the right to suspend or terminate accounts that violate these Terms.</Text>

          <Text style={styles.sectionTitle}>4. Services Provided</Text>
          <Text style={styles.bulletPoint}>• Clients can submit repair or maintenance requests.</Text>
          <Text style={styles.bulletPoint}>• Agents can browse available jobs and accept requests.</Text>
          <Text style={styles.bulletPoint}>• HomeFix facilitates communication and payment between Clients and Agents but is not a party to the agreement between them.</Text>

          <Text style={styles.sectionTitle}>5. Payments</Text>
          <Text style={styles.bulletPoint}>• Payments for services are processed through third-party payment providers.</Text>
          <Text style={styles.bulletPoint}>• Clients agree to pay the agreed fee for services requested through HomeFix.</Text>
          <Text style={styles.bulletPoint}>• Agents will receive payment (minus HomeFix&apos;s service fee) once a job is completed.</Text>
          <Text style={styles.bulletPoint}>• HomeFix is not responsible for payment disputes between Clients and Agents.</Text>

          <Text style={styles.sectionTitle}>6. Responsibilities</Text>
          <Text style={styles.subSectionTitle}>Clients:</Text>
          <Text style={styles.bulletPoint}>• Provide accurate details about the issue.</Text>
          <Text style={styles.bulletPoint}>• Ensure safe and lawful access to the property.</Text>
          <Text style={styles.bulletPoint}>• Pay agreed fees promptly.</Text>
          
          <Text style={styles.subSectionTitle}>Agents:</Text>
          <Text style={styles.bulletPoint}>• Provide professional, lawful, and high-quality services.</Text>
          <Text style={styles.bulletPoint}>• Respect Clients&apos; property and privacy.</Text>
          <Text style={styles.bulletPoint}>• Comply with all licensing, safety, and regulatory requirements.</Text>
          
          <Text style={styles.subSectionTitle}>HomeFix:</Text>
          <Text style={styles.bulletPoint}>• Acts only as an intermediary.</Text>
          <Text style={styles.bulletPoint}>• Does not guarantee the quality, safety, or legality of services provided by Agents.</Text>
          <Text style={styles.bulletPoint}>• Is not liable for disputes, damages, or losses arising from services performed.</Text>

          <Text style={styles.sectionTitle}>7. Prohibited Activities</Text>
          <Text style={styles.paragraph}>You agree not to:</Text>
          <Text style={styles.bulletPoint}>• Use HomeFix for illegal or fraudulent purposes.</Text>
          <Text style={styles.bulletPoint}>• Misrepresent your identity or qualifications.</Text>
          <Text style={styles.bulletPoint}>• Harass, abuse, or harm other users.</Text>
          <Text style={styles.bulletPoint}>• Attempt to hack, reverse-engineer, or disrupt the App.</Text>

          <Text style={styles.sectionTitle}>8. Disclaimers</Text>
          <Text style={styles.bulletPoint}>• HomeFix is provided on an &quot;as is&quot; and &quot;as available&quot; basis.</Text>
          <Text style={styles.bulletPoint}>• We do not guarantee uninterrupted or error-free operation of the App.</Text>
          <Text style={styles.bulletPoint}>• HomeFix makes no warranties regarding the reliability, skill, or conduct of Agents or Clients.</Text>

          <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
          <Text style={styles.paragraph}>To the maximum extent permitted by law:</Text>
          <Text style={styles.bulletPoint}>• HomeFix is not liable for damages, losses, or injuries arising from the services provided by Agents.</Text>
          <Text style={styles.bulletPoint}>• Our total liability to you will not exceed the greater of:</Text>
          <Text style={styles.bulletPoint}>  1. The amount you paid to HomeFix in the last 12 months, or</Text>
          <Text style={styles.bulletPoint}>  2. €100 (one hundred euros).</Text>

          <Text style={styles.sectionTitle}>10. Termination</Text>
          <Text style={styles.bulletPoint}>• You may terminate your account at any time.</Text>
          <Text style={styles.bulletPoint}>• HomeFix may suspend or terminate your account if you violate these Terms or misuse the platform.</Text>

          <Text style={styles.sectionTitle}>12. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            HomeFix may update these Terms from time to time. Material changes will be communicated via the App. Continued use of the App after changes take effect means you accept the new Terms.
          </Text>

          <Text style={styles.sectionTitle}>13. Contact Us</Text>
          <Text style={styles.paragraph}>
            For questions or concerns about these Terms, please contact:
          </Text>
          <Text style={styles.paragraph}>
            HomeFix Support Team{"\n"}
            Email: t.g.bracke@gmail.com
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  lastUpdated: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 24,
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 8,
  },
});