import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { incidentAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const INCIDENT_TYPES = [
  { id: 'breakdown', label: 'Vehicle Breakdown', icon: 'tool', color: '#e67e22' },
  { id: 'accident', label: 'Accident', icon: 'alert-triangle', color: '#e74c3c' },
  { id: 'medical', label: 'Medical Emergency', icon: 'heart', color: '#e74c3c' },
  { id: 'road_hazard', label: 'Road Hazard', icon: 'alert-circle', color: '#f39c12' },
  { id: 'passenger_complaint', label: 'Passenger Issue', icon: 'users', color: '#3498db' },
  { id: 'weather', label: 'Bad Weather', icon: 'cloud-rain', color: '#95a5a6' },
  { id: 'delay', label: 'Trip Delay', icon: 'clock', color: '#8e44ad' },
  { id: 'other', label: 'Other', icon: 'edit', color: '#555' },
];

const SEVERITY = ['Low', 'Medium', 'High', 'Critical'];

export default function IncidentReportScreen({ navigation, route }) {
  const trip = route.params?.trip;
  const [type, setType] = useState(null);
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!type) { Toast.show({ type: 'error', text1: 'Select incident type' }); return; }
    if (!description.trim()) { Toast.show({ type: 'error', text1: 'Add a description' }); return; }

    setSubmitting(true);
    try {
      await incidentAPI.create({
        trip_id: trip?.id,
        type,
        severity: severity.toLowerCase(),
        description: description.trim(),
        location: location.trim(),
      });
    } catch (_) {}
    setSubmitting(false);
    Toast.show({ type: 'success', text1: 'Incident reported', text2: 'Dispatch has been notified' });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {trip && (
          <View style={styles.tripBanner}>
            <Icon name="navigation" size={16} color="#fff" />
            <Text style={styles.tripBannerText}>{trip.route_name} • {trip.bus_number}</Text>
          </View>
        )}

        {/* Incident Type */}
        <Text style={styles.sectionTitle}>Type of Incident</Text>
        <View style={styles.typeGrid}>
          {INCIDENT_TYPES.map(t => (
            <TouchableOpacity key={t.id} style={[styles.typeCard, type === t.id && { borderColor: t.color, borderWidth: 2, backgroundColor: t.color + '10' }]} onPress={() => setType(t.id)}>
              <View style={[styles.typeIcon, { backgroundColor: t.color + '20' }]}><Icon name={t.icon} size={20} color={t.color} /></View>
              <Text style={styles.typeLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Severity */}
        <Text style={styles.sectionTitle}>Severity Level</Text>
        <View style={styles.severityRow}>
          {SEVERITY.map(s => (
            <TouchableOpacity key={s} style={[styles.severityChip, severity === s && styles.severityChipActive]} onPress={() => setSeverity(s)}>
              <Text style={[styles.severityText, severity === s && styles.severityTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>Location</Text>
        <TextInput style={styles.input} placeholder="Current location or landmark" value={location} onChangeText={setLocation} />

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the incident in detail..." value={description} onChangeText={setDescription} multiline numberOfLines={5} textAlignVertical="top" />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.5 }]} onPress={handleSubmit} disabled={submitting}>
          <Icon name="send" size={18} color="#fff" />
          <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Report'}</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20, paddingBottom: 100 },
  tripBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1a5276', borderRadius: 12, padding: 12, marginBottom: 20 },
  tripBannerText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12, marginTop: 8 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  typeCard: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 2, borderColor: 'transparent', elevation: 1 },
  typeIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  typeLabel: { fontSize: 13, fontWeight: '500', color: '#333', flex: 1 },
  severityRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  severityChip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', elevation: 1 },
  severityChipActive: { backgroundColor: '#1a5276' },
  severityText: { fontSize: 13, fontWeight: '600', color: '#666' },
  severityTextActive: { color: '#fff' },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 8, elevation: 1 },
  textArea: { minHeight: 120 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', elevation: 8 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#e74c3c', paddingVertical: 16, borderRadius: 14 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
