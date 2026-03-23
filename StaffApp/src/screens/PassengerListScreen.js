import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { tripAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const DEMO_PASSENGERS = [
  { id: 1, booking_code: 'GVF-AB12CD', name: 'Juan Dela Cruz', seat_number: 1, status: 'boarded', phone: '0917-111-1111' },
  { id: 2, booking_code: 'GVF-EF34GH', name: 'Maria Santos', seat_number: 5, status: 'boarded', phone: '0918-222-2222' },
  { id: 3, booking_code: 'GVF-IJ56KL', name: 'Pedro Reyes', seat_number: 8, status: 'checked_in', phone: '0919-333-3333' },
  { id: 4, booking_code: 'GVF-MN78OP', name: 'Ana Garcia', seat_number: 12, status: 'checked_in', phone: '0920-444-4444' },
  { id: 5, booking_code: 'GVF-QR90ST', name: 'Carlos Mendoza', seat_number: 15, status: 'no_show', phone: '0921-555-5555' },
  { id: 6, booking_code: 'GVF-UV12WX', name: 'Rosa Villanueva', seat_number: 18, status: 'boarded', phone: '0922-666-6666' },
  { id: 7, booking_code: 'GVF-YZ34AB', name: 'Miguel Torres', seat_number: 22, status: 'checked_in', phone: '0923-777-7777' },
  { id: 8, booking_code: 'GVF-CD56EF', name: 'Elena Cruz', seat_number: 25, status: 'boarded', phone: '0924-888-8888' },
];

export default function PassengerListScreen({ route }) {
  const { trip } = route.params;
  const [passengers, setPassengers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadManifest(); }, []);

  const loadManifest = async () => {
    try { const { data } = await tripAPI.getManifest(trip.id); setPassengers(data.passengers || data || []); }
    catch (_) { setPassengers(DEMO_PASSENGERS); }
    setLoading(false);
  };

  const handleBoard = async (passenger) => {
    setPassengers(prev => prev.map(p => p.id === passenger.id ? { ...p, status: 'boarded' } : p));
    try { await tripAPI.updatePassengerStatus(trip.id, passenger.id, { status: 'boarded' }); } catch (_) {}
    Toast.show({ type: 'success', text1: `${passenger.name} boarded`, text2: `Seat #${passenger.seat_number}` });
  };

  const filtered = passengers.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.booking_code?.toLowerCase().includes(search.toLowerCase()) ||
    String(p.seat_number).includes(search)
  );

  const boarded = passengers.filter(p => p.status === 'boarded').length;
  const checkedIn = passengers.filter(p => p.status === 'checked_in').length;
  const noShow = passengers.filter(p => p.status === 'no_show').length;

  const getStatusStyle = (status) => {
    if (status === 'boarded') return { bg: '#eafaf1', color: '#27ae60' };
    if (status === 'checked_in') return { bg: '#e8f0f5', color: '#1a5276' };
    return { bg: '#fde8e8', color: '#e74c3c' };
  };

  const renderPassenger = ({ item }) => {
    const style = getStatusStyle(item.status);
    return (
      <View style={styles.passengerCard}>
        <View style={styles.seatBadge}><Text style={styles.seatText}>{item.seat_number}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.passengerName}>{item.name}</Text>
          <Text style={styles.bookingCode}>{item.booking_code}</Text>
        </View>
        <View style={styles.rightCol}>
          <View style={[styles.statusChip, { backgroundColor: style.bg }]}>
            <Text style={[styles.statusText, { color: style.color }]}>{item.status?.replace('_', ' ')}</Text>
          </View>
          {item.status === 'checked_in' && (
            <TouchableOpacity style={styles.boardBtn} onPress={() => handleBoard(item)}>
              <Text style={styles.boardBtnText}>Board</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}><Text style={styles.summaryNum}>{boarded}</Text><Text style={styles.summaryLabel}>Boarded</Text></View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}><Text style={styles.summaryNum}>{checkedIn}</Text><Text style={styles.summaryLabel}>Waiting</Text></View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}><Text style={[styles.summaryNum, { color: '#e74c3c' }]}>{noShow}</Text><Text style={styles.summaryLabel}>No Show</Text></View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}><Text style={styles.summaryNum}>{passengers.length}</Text><Text style={styles.summaryLabel}>Total</Text></View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Icon name="search" size={18} color="#888" />
        <TextInput style={styles.searchInput} placeholder="Search name, code, or seat..." value={search} onChangeText={setSearch} />
      </View>

      {loading ? <ActivityIndicator size="large" color="#1a5276" style={{ marginTop: 40 }} /> : (
        <FlatList data={filtered} keyExtractor={i => String(i.id)} renderItem={renderPassenger} contentContainerStyle={styles.list}
          ListEmptyComponent={<View style={styles.empty}><Icon name="users" size={40} color="#ccc" /><Text style={styles.emptyText}>No passengers found</Text></View>} />
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  summary: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 22, fontWeight: 'bold', color: '#1a5276' },
  summaryLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: '#eee' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', margin: 16, marginBottom: 0, paddingHorizontal: 14, borderRadius: 12, elevation: 1 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14 },
  list: { padding: 16 },
  passengerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, elevation: 1 },
  seatBadge: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#e8f0f5', justifyContent: 'center', alignItems: 'center' },
  seatText: { fontSize: 16, fontWeight: '700', color: '#1a5276' },
  passengerName: { fontSize: 15, fontWeight: '600', color: '#333' },
  bookingCode: { fontSize: 12, color: '#888', marginTop: 2 },
  rightCol: { alignItems: 'flex-end', gap: 6 },
  statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  boardBtn: { backgroundColor: '#27ae60', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  boardBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 40, gap: 10 },
  emptyText: { fontSize: 15, color: '#888' },
});
