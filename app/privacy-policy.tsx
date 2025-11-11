import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useLanguage } from "@/providers/LanguageProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('settings.privacyPolicy'),
          headerStyle: { backgroundColor: "#FFD700" },
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "bold" },
        }} 
      />
      <ScrollView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy for HomeFix</Text>
          <Text style={styles.lastUpdated}>Last Updated: 18/09/2025</Text>
          
          <Text style={styles.paragraph}>
            At HomeFix, your privacy is important to us. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our mobile application and related services (collectively, the &quot;App&quot;). By using HomeFix, you agree to the practices described in this Privacy Policy.
          </Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We may collect the following types of information:
          </Text>
          
          <Text style={styles.subSectionTitle}>a) Information You Provide</Text>
          <Text style={styles.bulletPoint}>• Account Information: name, email address, phone number, password.</Text>
          <Text style={styles.bulletPoint}>• Profile Details: address, service preferences, and payment information.</Text>
          <Text style={styles.bulletPoint}>• Professional Information (for Agents): qualifications, professional licenses, ID verification documents, and business details.</Text>
          <Text style={styles.bulletPoint}>• Communications: messages, feedback, or support inquiries you send to us.</Text>
          
          <Text style={styles.subSectionTitle}>b) Information We Collect Automatically</Text>
          <Text style={styles.bulletPoint}>• Usage Data: interactions with the App, including service requests, bookings, and completed jobs.</Text>
          <Text style={styles.bulletPoint}>• Device Information: device type, operating system, IP address, unique device identifiers.</Text>
          <Text style={styles.bulletPoint}>• Location Data: approximate or precise location (when enabled) to connect clients with nearby agents.</Text>
          
          <Text style={styles.subSectionTitle}>c) Information from Third Parties</Text>
          <Text style={styles.paragraph}>
            We may receive information from trusted third-party services, such as identity verification providers or payment processors, to enhance security and enable transactions.
          </Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>We use the information collected to:</Text>
          <Text style={styles.bulletPoint}>• Facilitate connections between clients and agents.</Text>
          <Text style={styles.bulletPoint}>• Process payments securely.</Text>
          <Text style={styles.bulletPoint}>• Verify agent credentials and client information.</Text>
          <Text style={styles.bulletPoint}>• Provide customer support and resolve disputes.</Text>
          <Text style={styles.bulletPoint}>• Improve, personalize, and optimize the App.</Text>
          <Text style={styles.bulletPoint}>• Send important updates, notifications, or promotional messages (where permitted by law).</Text>
          <Text style={styles.bulletPoint}>• Comply with legal obligations and enforce our Terms of Service.</Text>

          <Text style={styles.sectionTitle}>3. How We Share Your Information</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information. We may share your information only in the following cases:
          </Text>
          <Text style={styles.bulletPoint}>• With Agents/Clients: Contact details, service request details, and location information are shared between clients and agents to enable service delivery.</Text>
          <Text style={styles.bulletPoint}>• With Service Providers: Third-party providers who help us with payment processing, identity verification, hosting, analytics, or customer support.</Text>
          <Text style={styles.bulletPoint}>• For Legal Reasons: If required by law, regulation, or legal process, or to protect our rights, safety, or the rights of others.</Text>
          <Text style={styles.bulletPoint}>• In Business Transfers: If HomeFix undergoes a merger, acquisition, or sale of assets, your information may be transferred.</Text>

          <Text style={styles.sectionTitle}>4. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When no longer needed, your data will be securely deleted or anonymized.
          </Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.paragraph}>
            Depending on your location, you may have rights regarding your personal information, including:
          </Text>
          <Text style={styles.bulletPoint}>• Accessing the data we hold about you.</Text>
          <Text style={styles.bulletPoint}>• Correcting or updating inaccurate information.</Text>
          <Text style={styles.bulletPoint}>• Deleting your account and personal data.</Text>
          <Text style={styles.bulletPoint}>• Restricting or objecting to processing.</Text>
          <Text style={styles.bulletPoint}>• Withdrawing consent to marketing communications.</Text>
          <Text style={styles.paragraph}>
            To exercise these rights, please contact us at t.g.bracke@gmail.com.
          </Text>

          <Text style={styles.sectionTitle}>6. Security</Text>
          <Text style={styles.paragraph}>
            We use industry-standard security measures (such as encryption, firewalls, and secure servers) to protect your personal information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute protection.
          </Text>

          <Text style={styles.sectionTitle}>7. Children&apos;s Privacy</Text>
          <Text style={styles.paragraph}>
            HomeFix is not intended for children under the age of 18. We do not knowingly collect personal information from minors. If we become aware that we have inadvertently collected such information, we will delete it promptly.
          </Text>

          <Text style={styles.sectionTitle}>8. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            If you access HomeFix from outside the country where our servers are located, your information may be transferred and stored across borders. We ensure appropriate safeguards are in place to protect your data.
          </Text>

          <Text style={styles.sectionTitle}>9. Updates to this Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new Privacy Policy in the App and updating the &quot;Last Updated&quot; date.
          </Text>

          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions or concerns about this Privacy Policy, please contact us at:
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