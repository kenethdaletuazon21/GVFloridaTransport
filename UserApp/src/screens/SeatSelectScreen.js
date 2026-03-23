import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { bookingAPI } from '../services/api';
import Toast from 'react-native-toast-message';

export default function SeatSelectScreen({ navigation, route }) {
  const { trip } = route.params;
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadSeats(); }, []);

  const loadSeats = async () => {
    try {
      const { data } = await bookingAPI.getSeats(trip.id);
      setSeats(data.seats || data || []);
    } catch (err) {
      // Generate demo seat layout - 45 seats, some occupied
      const occupied = new Set([3, 7, 12, 15, 18, 22, 25, 30, 33, 38, 41]);
      const demoSeats = Array.from({ length: 45 }, (_, i) => ({
        number: i + 1,
        status: occupied.has(i + 1) ? 'occupied' : 'available',
      }));
      setSeats(demoSeats);
    } finally { setLoading(false); }
  };

  const handleContinue = () => {
    if (!selectedSeat) { Toast.show({ type: 'error', text1: 'Please select a seat' }); return; }
    navigation.navigate('Baggage', { trip, seat: selectedSeat });
  };

  const getSeatColor = (seat) => {
    if (seat.number === selectedSeat) return '#1a5276';
    if (seat.status === 'occupied') return '#ddd';
    return '#e8f0f5';
  };

  const getSeatTextColor = (seat) => {
    if (seat.number === selectedSeat) return '#fff';
    if (seat.status === 'occupied') return '#999';
    return '#1a5276';
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1a5276" /></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Trip Summary */}
        <View style={styles.tripSummary}>
          <Text style={styles.routeName}>{trip.route_name}</Text>
          <View style={styles.tripMeta}>
            <Text style={styles.busType}>{trip.bus_type?.replace('_', ' ').toUpperCase()}</Text>
            <Text style={styles.busNum}>Bus: {trip.bus_number}</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#e8f0f5' }]} /><Text style={styles.legendText}>Available</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#1a5276' }]} /><Text style={styles.legendText}>Selected</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ddd' }]} /><Text style={styles.legendText}>Occupied</Text></View>
        </View>

        {/* Bus Layout */}
        <View style={styles.busLayout}>
          <View style={styles.driverArea}>
            <Icon name="disc" size={24} color="#888" />
            <Text style={styles.driverText}>Driver</Text>
          </View>
          <View style={styles.door}><Text style={styles.doorText}>ENTRANCE</Text></View>
          <View style={styles.seatGrid}>
            {seats.map(seat => (
              <TouchableOpacity
                key={seat.number}
                style={[styles.seat, { backgroundColor: getSeatColor(seat) }]}
                disabled={seat.status === 'occupied'}
                onPress={() => setSelectedSeat(seat.number === selectedSeat ? null : seat.number)}
              >
                <Text style={[styles.seatText, { color: getSeatTextColor(seat) }]}>{seat.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.selectedLabel}>{selectedSeat ? `Seat #${selectedSeat}` : 'No seat selected'}</Text>
          <Text style={styles.selectedFare}>₱{(trip.fare || 0).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={[styles.continueBtn, !selectedSeat && styles.continueBtnDisabled]} onPress={handleContinue} disabled={!selectedSeat}>
          <Text style={styles.continueBtnText}>Continue</Text>
          <Icon name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20, paddingBottom: 100 },
  tripSummary: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  routeName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  tripMeta: { flexDirection: 'row', gap: 12, marginTop: 6 },
  busType: { fontSize: 12, fontWeight: '600', color: '#1a5276', backgroundColor: '#e8f0f5', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  busNum: { fontSize: 13, color: '#888' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 16, height: 16, borderRadius: 4 },
  legendText: { fontSize: 12, color: '#666' },
  busLayout: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 2 },
  driverArea: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  driverText: { fontSize: 13, color: '#888', fontWeight: '500' },
  door: { alignSelf: 'flex-end', marginBottom: 16 },
  doorText: { fontSize: 10, color: '#888', fontWeight: '600', letterSpacing: 1 },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  seat: { width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  seatText: { fontSize: 14, fontWeight: '700' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#eee', elevation: 8 },
  selectedLabel: { fontSize: 13, color: '#888' },
  selectedFare: { fontSize: 22, fontWeight: 'bold', color: '#1a5276' },
  continueBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1a5276', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
