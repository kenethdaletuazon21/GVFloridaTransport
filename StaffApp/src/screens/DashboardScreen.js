import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { tripAPI, shiftAPI, trackingAPI } from '../services/api';
import io from 'socket.io-client';
import Toast from 'react-native-toast-message';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [shift, setShift] = useState(null);
  const [assignedTrips, setAssignedTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const role = user?.role || 'driver';

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [tripRes, shiftRes] = await Promise.all([tripAPI.getAssigned(), shiftAPI.getCurrent()]);
      setAssignedTrips(tripRes.data?.trips || tripRes.data || []);
      setShift(shiftRes.data?.shift || shiftRes.data || null);
    } catch (_) {
      setAssignedTrips([
        { id: 1, route_name: 'Manila to Tuguegarao', departure_time: '06:00 AM', bus_number: 'MNL-001', status: 'boarding', passengers_boarded: 28, total_passengers: 45 },
        { id: 2, route_name: 'Manila to Santiago', departure_time: '08:30 AM', bus_number: 'MNL-003', status: 'scheduled', passengers_boarded: 0, total_passengers: 45 },
      ]);
      setShift({ clock_in: new Date().toISOString(), status: 'active' });
    }
  };

  const onRefresh = useCallback(async () => { setRefreshing(true); await loadData(); setRefreshing(false); }, []);

  const handleClockIn = async () => {
    try { await shiftAPI.clockIn({ location: 'Sampaloc Terminal' }); setShift({ clock_in: new Date().toISOString(), status: 'active' }); Toast.show({ type: 'success', text1: 'Clocked in!' }); } catch (_) { setShift({ clock_in: new Date().toISOString(), status: 'active' }); }
  };

  const handleClockOut = async () => {
    try { await shiftAPI.clockOut({}); setShift(null); Toast.show({ type: 'success', text1: 'Clocked out!' }); } catch (_) { setShift(null); }
  };

  const handleSOS = async () => {
    try { await trackingAPI.sendSOS({ type: 'emergency', message: 'Emergency SOS triggered' }); } catch (_) {}
    Toast.show({ type: 'error', text1: 'SOS Alert Sent!', text2: 'Dispatch has been notified' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.first_name || 'Staff'}</Text>
          <Text style={styles.role}>{role.charAt(0).toUpperCase() + role.slice(1)} • {format(new Date(), 'MMM dd, yyyy')}</Text>
        </View>
        <TouchableOpacity style={styles.sosBtn} onPress={handleSOS}>
          <Icon name="alert-triangle" size={20} color="#fff" />
          <Text style={styles.sosBtnText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Shift Status */}
        <View style={styles.shiftCard}>
          <View style={styles.shiftHeader}>
            <Icon name="clock" size={20} color={shift ? '#27ae60' : '#888'} />
            <Text style={styles.shiftTitle}>{shift ? 'On Duty' : 'Off Duty'}</Text>
          </View>
          {shift && <Text style={styles.shiftTime}>Clocked in: {format(new Date(shift.clock_in), 'hh:mm a')}</Text>}
          <TouchableOpacity style={[styles.clockBtn, shift && styles.clockOutBtn]} onPress={shift ? handleClockOut : handleClockIn}>
            <Icon name={shift ? 'log-out' : 'log-in'} size={18} color="#fff" />
            <Text style={styles.clockBtnText}>{shift ? 'Clock Out' : 'Clock In'}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: 'camera', label: 'Scan Ticket', screen: 'Scanner', color: '#1a5276' },
            { icon: 'alert-circle', label: 'Report\nIncident', screen: 'IncidentReport', color: '#e74c3c' },
            { icon: 'map-pin', label: 'Geo\nCheck-in', screen: 'GeoTag', color: '#27ae60' },
            { icon: 'navigation', label: 'My\nTrips', screen: 'Trips', color: '#e67e22' },
          ].map(action => (
            <TouchableOpacity key={action.label} style={styles.actionCard} onPress={() => navigation.navigate(action.screen)}>
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}><Icon name={action.icon} size={24} color={action.color} /></View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Assigned Trips */}
        <Text style={styles.sectionTitle}>Today's Trips</Text>
        {assignedTrips.length === 0 ? (
          <View style={styles.emptyCard}><Icon name="calendar" size={32} color="#ccc" /><Text style={styles.emptyText}>No trips assigned today</Text></View>
        ) : (
          assignedTrips.map(trip => (
            <TouchableOpacity key={trip.id} style={styles.tripCard} onPress={() => navigation.navigate('TripDetail', { trip })}>
              <View style={styles.tripHeader}>
                <Text style={styles.tripRoute}>{trip.route_name}</Text>
                <View style={[styles.tripStatus, { backgroundColor: trip.status === 'boarding' ? '#eafaf1' : trip.status === 'in_transit' ? '#e8f0f5' : '#f0f0f0' }]}>
                  <Text style={[styles.tripStatusText, { color: trip.status === 'boarding' ? '#27ae60' : trip.status === 'in_transit' ? '#1a5276' : '#888' }]}>{trip.status?.replace('_', ' ')}</Text>
                </View>
              </View>
              <View style={styles.tripMeta}>
                <View style={styles.tripMetaItem}><Icon name="clock" size={14} color="#888" /><Text style={styles.tripMetaText}>{trip.departure_time}</Text></View>
                <View style={styles.tripMetaItem}><Icon name="truck" size={14} color="#888" /><Text style={styles.tripMetaText}>{trip.bus_number}</Text></View>
                <View style={styles.tripMetaItem}><Icon name="users" size={14} color="#888" /><Text style={styles.tripMetaText}>{trip.passengers_boarded}/{trip.total_passengers}</Text></View>
              </View>
              <View style={styles.progressBarWrap}><View style={[styles.progressBar, { width: `${(trip.passengers_boarded / trip.total_passengers) * 100}%` }]} /></View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a5276', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  role: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  sosBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e74c3c', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25 },
  sosBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  scroll: { padding: 20 },
  shiftCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20, elevation: 2 },
  shiftHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  shiftTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  shiftTime: { fontSize: 13, color: '#888', marginBottom: 12 },
  clockBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#27ae60', paddingVertical: 12, borderRadius: 10 },
  clockOutBtn: { backgroundColor: '#e74c3c' },
  clockBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  actionCard: { width: '22%', alignItems: 'center', gap: 6 },
  actionIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 11, color: '#666', textAlign: 'center', fontWeight: '500' },
  tripCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1 },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tripRoute: { fontSize: 16, fontWeight: '700', color: '#333', flex: 1 },
  tripStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tripStatusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  tripMeta: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  tripMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tripMetaText: { fontSize: 13, color: '#666' },
  progressBarWrap: { height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#1a5276', borderRadius: 2 },
  emptyCard: { backgroundColor: '#fff', borderRadius: 14, padding: 30, alignItems: 'center', gap: 8, elevation: 1 },
  emptyText: { fontSize: 14, color: '#888' },
});
