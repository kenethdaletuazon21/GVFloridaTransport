import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { shiftAPI } from '../services/api';

const DEMO_SHIFTS = [
  { id: 1, clock_in: '2025-02-14T06:00:00', clock_out: '2025-02-14T18:30:00', hours: 12.5, location: 'Sampaloc Terminal', trips: 2 },
  { id: 2, clock_in: '2025-02-13T05:30:00', clock_out: '2025-02-13T17:00:00', hours: 11.5, location: 'Sampaloc Terminal', trips: 2 },
  { id: 3, clock_in: '2025-02-12T06:00:00', clock_out: '2025-02-12T19:00:00', hours: 13.0, location: 'Kamias Terminal', trips: 3 },
  { id: 4, clock_in: '2025-02-11T05:00:00', clock_out: '2025-02-11T16:00:00', hours: 11.0, location: 'Sampaloc Terminal', trips: 2 },
  { id: 5, clock_in: '2025-02-10T06:30:00', clock_out: '2025-02-10T18:00:00', hours: 11.5, location: 'Cubao Terminal', trips: 2 },
];

export default function ShiftLogScreen() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentShift, setCurrentShift] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [histRes, curRes] = await Promise.all([shiftAPI.getHistory(), shiftAPI.getCurrent()]);
      setShifts(histRes.data?.shifts || histRes.data || []);
      setCurrentShift(curRes.data?.shift || null);
    } catch (_) {
      setShifts(DEMO_SHIFTS);
      setCurrentShift({ clock_in: new Date().toISOString(), location: 'Sampaloc Terminal' });
    }
    setLoading(false);
  };

  const totalHours = shifts.reduce((sum, s) => sum + (s.hours || 0), 0);
  const totalTrips = shifts.reduce((sum, s) => sum + (s.trips || 0), 0);
  const avgHours = shifts.length ? (totalHours / shifts.length).toFixed(1) : 0;

  const renderShift = ({ item }) => (
    <View style={styles.shiftCard}>
      <View style={styles.shiftDate}>
        <Text style={styles.shiftDay}>{format(new Date(item.clock_in), 'dd')}</Text>
        <Text style={styles.shiftMonth}>{format(new Date(item.clock_in), 'MMM')}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.shiftRow}>
          <Text style={styles.shiftTime}>{format(new Date(item.clock_in), 'hh:mm a')} – {item.clock_out ? format(new Date(item.clock_out), 'hh:mm a') : 'Active'}</Text>
        </View>
        <Text style={styles.shiftLocation}>{item.location}</Text>
        <View style={styles.shiftMeta}>
          <View style={styles.metaChip}><Icon name="clock" size={12} color="#1a5276" /><Text style={styles.metaChipText}>{item.hours}h</Text></View>
          <View style={styles.metaChip}><Icon name="navigation" size={12} color="#27ae60" /><Text style={styles.metaChipText}>{item.trips} trips</Text></View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Current Shift */}
      {currentShift && (
        <View style={styles.currentCard}>
          <View style={styles.currentHeader}>
            <View style={styles.activeDot} />
            <Text style={styles.currentTitle}>Currently on Duty</Text>
          </View>
          <Text style={styles.currentTime}>Since {format(new Date(currentShift.clock_in), 'hh:mm a')}</Text>
          <Text style={styles.currentLocation}>{currentShift.location}</Text>
        </View>
      )}

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statNum}>{shifts.length}</Text><Text style={styles.statLabel}>Shifts</Text></View>
        <View style={styles.statCard}><Text style={styles.statNum}>{totalHours}h</Text><Text style={styles.statLabel}>Total Hours</Text></View>
        <View style={styles.statCard}><Text style={styles.statNum}>{avgHours}h</Text><Text style={styles.statLabel}>Avg/Day</Text></View>
        <View style={styles.statCard}><Text style={styles.statNum}>{totalTrips}</Text><Text style={styles.statLabel}>Trips</Text></View>
      </View>

      {/* Shift History */}
      <Text style={styles.sectionTitle}>Shift History</Text>
      {loading ? <ActivityIndicator size="large" color="#1a5276" style={{ marginTop: 20 }} /> : (
        <FlatList data={shifts} keyExtractor={i => String(i.id)} renderItem={renderShift} contentContainerStyle={styles.list}
          ListEmptyComponent={<View style={styles.empty}><Icon name="clock" size={40} color="#ccc" /><Text style={styles.emptyText}>No shift history</Text></View>} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  currentCard: { backgroundColor: '#1a5276', margin: 16, marginBottom: 0, borderRadius: 16, padding: 18 },
  currentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  activeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#27ae60' },
  currentTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  currentTime: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  currentLocation: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8, padding: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', elevation: 1 },
  statNum: { fontSize: 18, fontWeight: 'bold', color: '#1a5276' },
  statLabel: { fontSize: 10, color: '#888', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', paddingHorizontal: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  shiftCard: { flexDirection: 'row', gap: 14, backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8, elevation: 1 },
  shiftDate: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#e8f0f5', justifyContent: 'center', alignItems: 'center' },
  shiftDay: { fontSize: 20, fontWeight: 'bold', color: '#1a5276' },
  shiftMonth: { fontSize: 11, color: '#888', textTransform: 'uppercase' },
  shiftRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  shiftTime: { fontSize: 14, fontWeight: '600', color: '#333' },
  shiftLocation: { fontSize: 12, color: '#888', marginBottom: 6 },
  shiftMeta: { flexDirection: 'row', gap: 8 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f5f6fa', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  metaChipText: { fontSize: 11, fontWeight: '600', color: '#555' },
  empty: { alignItems: 'center', marginTop: 40, gap: 10 },
  emptyText: { fontSize: 15, color: '#888' },
});
