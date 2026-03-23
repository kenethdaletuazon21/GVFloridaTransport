import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { bookingAPI } from '../services/api';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

const DESTINATIONS = ['Tuguegarao', 'Santiago', 'Ilagan', 'Cauayan', 'Tabuk', 'Banaue', 'Solano', 'Bayombong', 'Bambang', 'Bontoc', 'Aparri', 'Laoag'];

export default function SearchScreen({ navigation, route }) {
  const [origin, setOrigin] = useState('Manila');
  const [destination, setDestination] = useState(route?.params?.destination || '');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [busType, setBusType] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!origin || !destination) { Toast.show({ type: 'error', text1: 'Select origin and destination' }); return; }
    setLoading(true);
    setSearched(true);
    try {
      const params = { origin, destination, date };
      if (busType) params.bus_type = busType;
      const { data } = await bookingAPI.search(params);
      setResults(data.trips || data || []);
    } catch (err) {
      // Demo data if API unavailable
      setResults([
        { id: 't1', departure_time: `${date}T02:00:00`, arrival_time: `${date}T12:00:00`, bus_type: 'deluxe', bus_number: 'MNL-001', available_seats: 18, fare: 950, route_name: `${origin} → ${destination}` },
        { id: 't2', departure_time: `${date}T06:00:00`, arrival_time: `${date}T16:00:00`, bus_type: 'super_deluxe', bus_number: 'MNL-005', available_seats: 12, fare: 1200, route_name: `${origin} → ${destination}` },
        { id: 't3', departure_time: `${date}T14:00:00`, arrival_time: `${date}T00:00:00`, bus_type: 'deluxe', bus_number: 'MNL-008', available_seats: 25, fare: 950, route_name: `${origin} → ${destination}` },
        { id: 't4', departure_time: `${date}T20:00:00`, arrival_time: `${date}T06:00:00`, bus_type: 'regular', bus_number: 'MNL-012', available_seats: 32, fare: 750, route_name: `${origin} → ${destination}` },
      ]);
    } finally { setLoading(false); }
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => navigation.navigate('SeatSelect', { trip: item })}>
      <View style={styles.tripHeader}>
        <View style={[styles.busTypeBadge, { backgroundColor: item.bus_type === 'super_deluxe' ? '#f39c12' : item.bus_type === 'deluxe' ? '#1a5276' : '#888' }]}>
          <Text style={styles.busTypeText}>{item.bus_type?.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <Text style={styles.busNumber}>{item.bus_number}</Text>
      </View>
      <View style={styles.tripTimes}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Departure</Text>
          <Text style={styles.time}>{item.departure_time ? format(new Date(item.departure_time), 'h:mm a') : '--'}</Text>
        </View>
        <View style={styles.timeLine}>
          <View style={styles.dot} /><View style={styles.line} /><View style={styles.dot} />
        </View>
        <View style={[styles.timeBlock, { alignItems: 'flex-end' }]}>
          <Text style={styles.timeLabel}>Arrival</Text>
          <Text style={styles.time}>{item.arrival_time ? format(new Date(item.arrival_time), 'h:mm a') : '--'}</Text>
        </View>
      </View>
      <View style={styles.tripFooter}>
        <Text style={styles.seats}>{item.available_seats} seats left</Text>
        <Text style={styles.fare}>₱{(item.fare || 0).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Form */}
      <View style={styles.searchForm}>
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <Icon name="circle" size={12} color="#27ae60" style={styles.inputIcon} />
            <TextInput style={styles.input} value={origin} onChangeText={setOrigin} placeholder="From" />
          </View>
          <TouchableOpacity onPress={() => { const tmp = origin; setOrigin(destination); setDestination(tmp); }} style={styles.swapBtn}>
            <Icon name="repeat" size={18} color="#1a5276" />
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <Icon name="map-pin" size={12} color="#e74c3c" style={styles.inputIcon} />
            <TextInput style={styles.input} value={destination} onChangeText={setDestination} placeholder="To" />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={[styles.inputWrap, { flex: 1 }]}>
            <Icon name="calendar" size={14} color="#888" style={styles.inputIcon} />
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
          </View>
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Icon name="search" size={18} color="#fff" />
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>
        {/* Quick Destinations */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {DESTINATIONS.map(d => (
            <TouchableOpacity key={d} onPress={() => setDestination(d)} style={[styles.chip, destination === d && styles.chipActive]}>
              <Text style={[styles.chipText, destination === d && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#1a5276" /></View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderTrip}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={searched ? <View style={styles.center}><Icon name="inbox" size={48} color="#ccc" /><Text style={styles.emptyText}>No trips found</Text></View> : null}
        />
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  searchForm: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15 },
  swapBtn: { padding: 10, backgroundColor: '#e8f0f5', borderRadius: 10 },
  searchBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1a5276', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14 },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  chips: { marginTop: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  chipActive: { backgroundColor: '#1a5276' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#888', marginTop: 12, fontSize: 15 },
  tripCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  busTypeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  busTypeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  busNumber: { fontSize: 13, color: '#888', fontWeight: '500' },
  tripTimes: { flexDirection: 'row', alignItems: 'center' },
  timeBlock: { flex: 1 },
  timeLabel: { fontSize: 11, color: '#888' },
  time: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 2 },
  timeLine: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingHorizontal: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1a5276' },
  line: { flex: 1, height: 2, backgroundColor: '#ddd', marginHorizontal: 4 },
  tripFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  seats: { fontSize: 13, color: '#27ae60', fontWeight: '500' },
  fare: { fontSize: 22, fontWeight: 'bold', color: '#1a5276' },
});
