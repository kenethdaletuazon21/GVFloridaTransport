import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: January 2025</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.body}>
          GV Florida Transport, Inc. ("we", "our", "us") collects the following information when you use our mobile application:{'\n\n'}
          • Personal Information: Name, phone number, email address (optional){'\n'}
          • Booking Information: Trip details, payment records, seat preferences{'\n'}
          • Device Information: Device type, operating system, app version{'\n'}
          • Location Data: Only when you enable bus tracking features
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.body}>
          We use your personal information to:{'\n\n'}
          • Process and manage your bus ticket bookings{'\n'}
          • Send booking confirmations and trip updates{'\n'}
          • Provide customer support{'\n'}
          • Improve our services and user experience{'\n'}
          • Send promotional offers (with your consent){'\n'}
          • Comply with legal obligations
        </Text>

        <Text style={styles.sectionTitle}>3. Data Sharing</Text>
        <Text style={styles.body}>
          We do not sell your personal data. We may share your information with:{'\n\n'}
          • Payment processors to complete transactions{'\n'}
          • Our booking partner (iwantseats.com) for ticket reservations{'\n'}
          • Law enforcement when required by law
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.body}>
          We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information. However, no method of electronic transmission is 100% secure.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Retention</Text>
        <Text style={styles.body}>
          We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time through the app settings.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.body}>
          You have the right to:{'\n\n'}
          • Access your personal data{'\n'}
          • Correct inaccurate information{'\n'}
          • Delete your account and personal data{'\n'}
          • Opt out of promotional communications{'\n'}
          • Request a copy of your data
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.body}>
          For privacy-related concerns, contact us at:{'\n\n'}
          Email: gvfloridatrans@gmail.com{'\n'}
          Phone: 02-493-7956{'\n'}
          Address: 832 AH Lacson Ave. Cor. Earnshaw St. Sampaloc, Manila
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  updated: { fontSize: 13, color: '#999', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#D90045', marginTop: 20, marginBottom: 8 },
  body: { fontSize: 14, color: '#555', lineHeight: 22 },
});
