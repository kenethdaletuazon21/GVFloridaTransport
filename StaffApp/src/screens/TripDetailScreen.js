import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { tripAPI, trackingAPI } from '../services/api';
import Toast from 'react-native-toast-message';

export default function TripDetailScreen({ navigation, route }) {
  const { trip } = route.params;
  const [tripData, setTripData] = useState(trip);

  const handleStart = async () => {
    try { await tripAPI.start(trip.id); } catch (_) {}
    setTripData(prev => ({ ...prev, status: 'in_transit' }));
    Toast.show({ type: 'success', text1: 'Trip started!' });
  };

  const handleEnd = () => {
    Alert.alert('End Trip', 'Are you sure you want to end this trip?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Trip', onPress: async () => {
        try { await tripAPI.end(trip.id); } catch (_) {}
        setTripData(prev => ({ ...prev, status: 'completed' }));
        Toast.show({ type: 'success', text1: 'Trip completed!' });
      }},
    ]);
  };

  const stats = [
    { icon: 'users', label: 'Passengers', value: `${tripData.passengers_boarded || 0}/${tripData.total_passengers || 45}`, color: '#1a5276' },
    { icon: 'dollar-sign', label: 'Revenue', value: `₱${(tripData.revenue || 0).toLocaleString()}`, color: '#27ae60' },
    { icon: 'clock', label: 'Duration', value: tripData.duration || '~12 hrs', color: '#e67e22' },
    { icon: 'navigation', label: 'Status', value: tripData.status?.replace('_', ' '), color: tripData.status === 'in_transit' ? '#1a5276' : '#27ae60' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Route Header */}
        <View style={styles.routeHeader}>
          <Text style={styles.routeName}>{tripData.route_name}</Text>
          <View style={styles.routeMeta}>
            <View style={styles.metaChip}><Icon name="truck" size={14} color="#fff" /><Text style={styles.metaChipText}>{tripData.bus_number}</Text></View>
            <View style={styles.metaChip}><Icon name="layers" size={14} color="#fff" /><Text style={styles.metaChipText}>{tripData.bus_type?.replace('_', ' ')}</Text></View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map(s => (
            <View key={s.label} style={styles.statCard}>
              <Icon name={s.icon} size={20} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.timelineItem}><View style={styles.dot} /><View><Text style={styles.timeLabel}>Departure</Text><Text style={styles.timeValue}>{tripData.departure_time}</Text></View></View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}><View style={[styles.dot, { backgroundColor: '#e74c3c' }]} /><View><Text style={styles.timeLabel}>Est. Arrival</Text><Text style={styles.timeValue}>{tripData.arrival_time || 'TBD'}</Text></View></View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionsCol}>
            <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('PassengerList', { trip: tripData })}>
              <View style={[styles.actionIcon, { backgroundColor: '#e8f0f5' }]}><Icon name="list" size={18} color="#1a5276" /></View>
              <Text style={styles.actionLabel}>View Passenger Manifest</Text>
              <Icon name="chevron-right" size={18} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('GeoTag', { trip: tripData })}>
              <View style={[styles.actionIcon, { backgroundColor: '#eafaf1' }]}><Icon name="map-pin" size={18} color="#27ae60" /></View>
              <Text style={styles.actionLabel}>Geo Check-in</Text>
              <Icon name="chevron-right" size={18} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('IncidentReport', { trip: tripData })}>
              <View style={[styles.actionIcon, { backgroundColor: '#fde8e8' }]}><Icon name="alert-circle" size={18} color="#e74c3c" /></View>
              <Text style={styles.actionLabel}>Report Incident</Text>
              <Icon name="chevron-right" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {tripData.status !== 'completed' && (
        <View style={styles.bottomBar}>
          {tripData.status === 'boarding' || tripData.status === 'scheduled' ? (
            <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
              <Icon name="play" size={20} color="#fff" /><Text style={styles.btnText}>Start Trip</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.endBtn} onPress={handleEnd}>
              <Icon name="square" size={20} color="#fff" /><Text style={styles.btnText}>End Trip</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20, paddingBottom: 100 },
  routeHeader: { backgroundColor: '#1a5276', borderRadius: 16, padding: 20, marginBottom: 16 },
  routeName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  routeMeta: { flexDirection: 'row', gap: 10 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  metaChipText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', gap: 6, elevation: 1 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#333', textTransform: 'capitalize' },
  statLabel: { fontSize: 12, color: '#888' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 14 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1a5276' },
  timelineLine: { width: 2, height: 20, backgroundColor: '#ddd', marginLeft: 5 },
  timeLabel: { fontSize: 12, color: '#888' },
  timeValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  actionsCol: { gap: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  actionIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#333' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', elevation: 8 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#27ae60', paddingVertical: 16, borderRadius: 14 },
  endBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#e74c3c', paddingVertical: 16, borderRadius: 14 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
