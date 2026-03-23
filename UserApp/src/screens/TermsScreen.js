import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Terms & Conditions</Text>
        <Text style={styles.updated}>Last updated: January 2025</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.body}>
          By downloading, installing, or using the GV Florida Transport mobile application, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the app.
        </Text>

        <Text style={styles.sectionTitle}>2. Account Registration</Text>
        <Text style={styles.body}>
          • You must provide accurate and complete information when creating an account.{'\n'}
          • You are responsible for maintaining the confidentiality of your account credentials.{'\n'}
          • You must be at least 18 years old or have parental consent to create an account.{'\n'}
          • One phone number may only be associated with one account.
        </Text>

        <Text style={styles.sectionTitle}>3. Booking & Payment</Text>
        <Text style={styles.body}>
          • All bookings are subject to seat availability.{'\n'}
          • Ticket prices are displayed at the time of booking and may change without prior notice.{'\n'}
          • Payment must be completed to confirm a booking.{'\n'}
          • Refund and cancellation policies are subject to the terms displayed during booking.
        </Text>

        <Text style={styles.sectionTitle}>4. Travel Policies</Text>
        <Text style={styles.body}>
          • Passengers must present valid identification matching the booking details.{'\n'}
          • GV Florida Transport reserves the right to refuse boarding to passengers who violate safety regulations.{'\n'}
          • Schedules are subject to change without prior notice due to weather, road conditions, or other factors beyond our control.{'\n'}
          • GV Florida Transport is not liable for delays caused by force majeure events.
        </Text>

        <Text style={styles.sectionTitle}>5. User Conduct</Text>
        <Text style={styles.body}>
          You agree not to:{'\n\n'}
          • Use the app for any unlawful purpose{'\n'}
          • Attempt to gain unauthorized access to our systems{'\n'}
          • Share your account with others{'\n'}
          • Submit false or misleading information{'\n'}
          • Interfere with the proper functioning of the app
        </Text>

        <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
        <Text style={styles.body}>
          GV Florida Transport, Inc. shall not be liable for any indirect, incidental, or consequential damages arising from the use of this application. Our total liability shall not exceed the amount paid for the specific trip in question.
        </Text>

        <Text style={styles.sectionTitle}>7. Account Termination</Text>
        <Text style={styles.body}>
          We reserve the right to suspend or terminate your account if you violate these terms. You may also delete your account at any time through the Profile settings in the app.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
        <Text style={styles.body}>
          We may update these Terms & Conditions from time to time. Continued use of the app after changes constitutes acceptance of the updated terms.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact</Text>
        <Text style={styles.body}>
          For questions about these Terms, contact:{'\n\n'}
          GV Florida Transport, Inc.{'\n'}
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
