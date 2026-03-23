import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { userAPI } from '../services/api';

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

const DEMO_TRIPS = [
  { id: 1, booking_code: 'GVF-AB12CD', route_name: 'Manila to Tuguegarao', departure_time: '2025-02-15T06:00:00', arrival_time: '2025-02-15T18:00:00', seat_number: 12, bus_type: 'deluxe', fare: 950, status: 'confirmed' },
  { id: 2, booking_code: 'GVF-EF34GH', route_name: 'Manila to Santiago', departure_time: '2025-02-20T08:30:00', arrival_time: '2025-02-20T17:00:00', seat_number: 5, bus_type: 'super_deluxe', fare: 850, status: 'confirmed' },
  { id: 3, booking_code: 'GVF-IJ56KL', route_name: 'Manila to Ilagan', departure_time: '2025-01-10T07:00:00', arrival_time: '2025-01-10T17:30:00', seat_number: 22, bus_type: 'regular', fare: 900, status: 'completed', rating: 5 },
  { id: 4, booking_code: 'GVF-MN78OP', route_name: 'Manila to Tabuk', departure_time: '2025-01-05T05:30:00', arrival_time: '2025-01-05T19:00:00', seat_number: 8, bus_type: 'deluxe', fare: 1050, status: 'completed', rating: 4 },
  { id: 5, booking_code: 'GVF-QR90ST', route_name: 'Manila to Cauayan', departure_time: '2024-12-25T09:00:00', arrival_time: '2024-12-25T18:00:00', seat_number: 15, bus_type: 'regular', fare: 800, status: 'cancelled' },
];

export default function MyTripsScreen({ navigation }) {
  const [tab, setTab] = useState('Upcoming');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTrips(); }, []);

  const loadTrips = async () => {
    try {
      const { data } = await userAPI.getTrips();
      setTrips(data.trips || data || []);
    } catch (_) { setTrips(DEMO_TRIPS); }
    setLoading(false);
  };

  const filtered = trips.filter(t => {
    if (tab === 'Upcoming') return t.status === 'confirmed' || t.status === 'booked';
    if (tab === 'Completed') return t.status === 'completed';
    return t.status === 'cancelled';
  });

  const renderTrip = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TripDetail', { trip: item })}>
      <View style={styles.cardHeader}>
        <Text style={styles.bookingCode}>{item.booking_code}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'confirmed' ? '#eafaf1' : item.status === 'completed' ? '#e8f0f5' : '#fde8e8' }]}>
          <Text style={[styles.statusText, { color: item.status === 'confirmed' ? '#27ae60' : item.status === 'completed' ? '#1a5276' : '#e74c3c' }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.routeName}>{item.route_name}</Text>
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}><Icon name="calendar" size={14} color="#888" /><Text style={styles.detailText}>{format(new Date(item.departure_time), 'MMM dd, yyyy')}</Text></View>
        <View style={styles.detailItem}><Icon name="clock" size={14} color="#888" /><Text style={styles.detailText}>{format(new Date(item.departure_time), 'hh:mm a')}</Text></View>
        <View style={styles.detailItem}><Icon name="hash" size={14} color="#888" /><Text style={styles.detailText}>Seat {item.seat_number}</Text></View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.busType}>{item.bus_type?.replace('_', ' ').toUpperCase()}</Text>
        <Text style={styles.fare}>₱{item.fare?.toLocaleString()}</Text>
      </View>
      {item.status === 'completed' && item.rating && (
        <View style={styles.ratingRow}>
          {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={14} color={s <= item.rating ? '#f1c40f' : '#ddd'} />)}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <ActivityIndicator size="large" color="#1a5276" style={{ marginTop: 40 }} /> : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderTrip}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<View style={styles.empty}><Icon name="inbox" size={48} color="#ccc" /><Text style={styles.emptyText}>No {tab.toLowerCase()} trips</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#1a5276' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#888' },
  tabTextActive: { color: '#1a5276' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bookingCode: { fontSize: 13, fontWeight: '700', color: '#888', letterSpacing: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  routeName: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 10 },
  cardDetails: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 13, color: '#666' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  busType: { fontSize: 11, fontWeight: '600', color: '#1a5276', backgroundColor: '#e8f0f5', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  fare: { fontSize: 18, fontWeight: 'bold', color: '#1a5276' },
  ratingRow: { flexDirection: 'row', gap: 2, marginTop: 8 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: '#888' },
});
