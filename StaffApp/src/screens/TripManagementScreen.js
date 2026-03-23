import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { tripAPI } from '../services/api';

const TABS = ['Active', 'Upcoming', 'Completed'];

const DEMO_TRIPS = [
  { id: 1, route_name: 'Manila to Tuguegarao', departure_time: '06:00 AM', arrival_time: '06:00 PM', bus_number: 'MNL-001', bus_type: 'deluxe', status: 'boarding', passengers_boarded: 28, total_passengers: 45, revenue: 42750 },
  { id: 2, route_name: 'Manila to Santiago', departure_time: '08:30 AM', arrival_time: '05:30 PM', bus_number: 'MNL-003', bus_type: 'super_deluxe', status: 'scheduled', passengers_boarded: 0, total_passengers: 32, revenue: 0 },
  { id: 3, route_name: 'Manila to Ilagan', departure_time: '07:00 AM', arrival_time: '05:30 PM', bus_number: 'MNL-007', bus_type: 'regular', status: 'completed', passengers_boarded: 45, total_passengers: 45, revenue: 40500 },
  { id: 4, route_name: 'Manila to Tabuk', departure_time: '05:30 AM', arrival_time: '07:00 PM', bus_number: 'MNL-012', bus_type: 'deluxe', status: 'completed', passengers_boarded: 40, total_passengers: 45, revenue: 42000 },
];

export default function TripManagementScreen({ navigation }) {
  const [tab, setTab] = useState('Active');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTrips(); }, []);

  const loadTrips = async () => {
    try { const { data } = await tripAPI.getAssigned(); setTrips(data.trips || data || []); }
    catch (_) { setTrips(DEMO_TRIPS); }
    setLoading(false);
  };

  const handleStartTrip = async (trip) => {
    try { await tripAPI.start(trip.id); } catch (_) {}
    setTrips(prev => prev.map(t => t.id === trip.id ? { ...t, status: 'in_transit' } : t));
  };

  const handleEndTrip = async (trip) => {
    try { await tripAPI.end(trip.id); } catch (_) {}
    setTrips(prev => prev.map(t => t.id === trip.id ? { ...t, status: 'completed' } : t));
  };

  const filtered = trips.filter(t => {
    if (tab === 'Active') return ['boarding', 'in_transit'].includes(t.status);
    if (tab === 'Upcoming') return t.status === 'scheduled';
    return t.status === 'completed';
  });

  const getStatusColor = (status) => {
    const colors = { boarding: '#27ae60', in_transit: '#1a5276', scheduled: '#e67e22', completed: '#888' };
    return colors[status] || '#888';
  };

  const renderTrip = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('TripDetail', { trip: item })}>
        <View style={styles.cardHeader}>
          <Text style={styles.routeName}>{item.route_name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status?.replace('_', ' ')}</Text>
          </View>
        </View>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}><Icon name="truck" size={14} color="#888" /><Text style={styles.metaText}>{item.bus_number}</Text></View>
          <View style={styles.metaItem}><Icon name="clock" size={14} color="#888" /><Text style={styles.metaText}>{item.departure_time} → {item.arrival_time}</Text></View>
        </View>
        <View style={styles.passengerRow}>
          <Icon name="users" size={14} color="#1a5276" />
          <Text style={styles.passengerText}>{item.passengers_boarded} / {item.total_passengers} passengers</Text>
          <Text style={styles.revenueText}>₱{(item.revenue || 0).toLocaleString()}</Text>
        </View>
        <View style={styles.progressWrap}><View style={[styles.progressBar, { width: `${(item.passengers_boarded / item.total_passengers) * 100}%` }]} /></View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        {item.status === 'boarding' && (
          <TouchableOpacity style={styles.startBtn} onPress={() => handleStartTrip(item)}>
            <Icon name="play" size={16} color="#fff" /><Text style={styles.actionBtnText}>Start Trip</Text>
          </TouchableOpacity>
        )}
        {item.status === 'in_transit' && (
          <TouchableOpacity style={styles.endBtn} onPress={() => handleEndTrip(item)}>
            <Icon name="square" size={16} color="#fff" /><Text style={styles.actionBtnText}>End Trip</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.manifestBtn} onPress={() => navigation.navigate('PassengerList', { trip: item })}>
          <Icon name="list" size={16} color="#1a5276" /><Text style={styles.manifestBtnText}>Manifest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? <ActivityIndicator size="large" color="#1a5276" style={{ marginTop: 40 }} /> : (
        <FlatList data={filtered} keyExtractor={i => String(i.id)} renderItem={renderTrip} contentContainerStyle={styles.list}
          ListEmptyComponent={<View style={styles.empty}><Icon name="inbox" size={40} color="#ccc" /><Text style={styles.emptyText}>No {tab.toLowerCase()} trips</Text></View>} />
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  routeName: { fontSize: 16, fontWeight: '700', color: '#333', flex: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  cardMeta: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: '#666' },
  passengerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  passengerText: { flex: 1, fontSize: 13, color: '#555' },
  revenueText: { fontSize: 15, fontWeight: '700', color: '#27ae60' },
  progressWrap: { height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, overflow: 'hidden', marginBottom: 12 },
  progressBar: { height: '100%', backgroundColor: '#1a5276', borderRadius: 2 },
  cardActions: { flexDirection: 'row', gap: 10 },
  startBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#27ae60', paddingVertical: 10, borderRadius: 10 },
  endBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#e74c3c', paddingVertical: 10, borderRadius: 10 },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  manifestBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: '#1a5276', paddingVertical: 10, borderRadius: 10 },
  manifestBtnText: { color: '#1a5276', fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: '#888' },
});
