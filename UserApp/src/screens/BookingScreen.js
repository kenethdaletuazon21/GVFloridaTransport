import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';

export default function BookingScreen({ navigation, route }) {
  const { trip } = route.params;

  const amenities = {
    super_deluxe: ['WiFi', 'Power Outlet', 'Air Conditioning', 'Reclining Seat', 'Blanket', 'Snacks'],
    deluxe: ['Air Conditioning', 'Reclining Seat', 'Blanket', 'Power Outlet'],
    regular: ['Air Conditioning', 'Reclining Seat'],
  };
  const busAmenities = amenities[trip.bus_type] || amenities.regular;

  const amenityIcons = {
    'WiFi': 'wifi', 'Power Outlet': 'battery-charging', 'Air Conditioning': 'wind',
    'Reclining Seat': 'corner-down-right', 'Blanket': 'layers', 'Snacks': 'coffee',
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Route Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeEndpoints}>
            <View style={styles.endpoint}>
              <View style={styles.dot} />
              <View>
                <Text style={styles.endpointLabel}>From</Text>
                <Text style={styles.endpointCity}>{trip.origin || trip.route_name?.split(' to ')[0] || 'Manila'}</Text>
                <Text style={styles.endpointTerminal}>{trip.origin_terminal || 'Sampaloc Terminal'}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.endpoint}>
              <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
              <View>
                <Text style={styles.endpointLabel}>To</Text>
                <Text style={styles.endpointCity}>{trip.destination || trip.route_name?.split(' to ')[1] || 'Tuguegarao'}</Text>
                <Text style={styles.endpointTerminal}>{trip.destination_terminal || 'Tuguegarao Terminal'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Icon name="calendar" size={18} color="#1a5276" />
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{trip.departure_date || format(new Date(), 'MMM dd, yyyy')}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="clock" size={18} color="#1a5276" />
              <Text style={styles.detailLabel}>Departure</Text>
              <Text style={styles.detailValue}>{trip.departure_time || '06:00 AM'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="clock" size={18} color="#1a5276" />
              <Text style={styles.detailLabel}>Est. Arrival</Text>
              <Text style={styles.detailValue}>{trip.arrival_time || '06:00 PM'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="navigation" size={18} color="#1a5276" />
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{trip.duration || '~12 hrs'}</Text>
            </View>
          </View>
        </View>

        {/* Bus Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bus Information</Text>
          <View style={styles.busInfo}>
            <View style={styles.busTypeBadge}>
              <Text style={styles.busTypeText}>{trip.bus_type?.replace('_', ' ').toUpperCase() || 'DELUXE'}</Text>
            </View>
            <Text style={styles.busNumber}>Bus {trip.bus_number || 'MNL-001'}</Text>
          </View>
          <View style={styles.seatsInfo}>
            <Icon name="users" size={16} color="#27ae60" />
            <Text style={styles.seatsText}>{trip.available_seats || 15} seats available</Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {busAmenities.map(a => (
              <View key={a} style={styles.amenityItem}>
                <View style={styles.amenityIcon}>
                  <Icon name={amenityIcons[a] || 'check'} size={18} color="#1a5276" />
                </View>
                <Text style={styles.amenityLabel}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Policies */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Policies</Text>
          <View style={styles.policyItem}><Icon name="rotate-ccw" size={14} color="#888" /><Text style={styles.policyText}>Free cancellation up to 4 hours before departure</Text></View>
          <View style={styles.policyItem}><Icon name="package" size={14} color="#888" /><Text style={styles.policyText}>20kg baggage allowance per passenger</Text></View>
          <View style={styles.policyItem}><Icon name="alert-circle" size={14} color="#888" /><Text style={styles.policyText}>Please arrive 30 minutes before departure</Text></View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.fareLabel}>Total Fare</Text>
          <Text style={styles.fareAmount}>₱{(trip.fare || 950).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.selectSeatBtn} onPress={() => navigation.navigate('SeatSelect', { trip })}>
          <Text style={styles.selectSeatText}>Select Seat</Text>
          <Icon name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20, paddingBottom: 100 },
  routeCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 },
  routeEndpoints: { gap: 4 },
  endpoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#1a5276', marginTop: 4 },
  routeLine: { width: 2, height: 20, backgroundColor: '#ddd', marginLeft: 6 },
  endpointLabel: { fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 },
  endpointCity: { fontSize: 18, fontWeight: '700', color: '#333' },
  endpointTerminal: { fontSize: 13, color: '#888', marginTop: 2 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 14 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  detailItem: { width: '45%', alignItems: 'flex-start', gap: 4 },
  detailLabel: { fontSize: 12, color: '#888' },
  detailValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  busInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  busTypeBadge: { backgroundColor: '#1a5276', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  busTypeText: { fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  busNumber: { fontSize: 15, fontWeight: '600', color: '#555' },
  seatsInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  seatsText: { fontSize: 14, color: '#27ae60', fontWeight: '500' },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '45%', paddingVertical: 4 },
  amenityIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#e8f0f5', justifyContent: 'center', alignItems: 'center' },
  amenityLabel: { fontSize: 13, color: '#555' },
  policyItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  policyText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#eee', elevation: 8 },
  fareLabel: { fontSize: 12, color: '#888' },
  fareAmount: { fontSize: 24, fontWeight: 'bold', color: '#1a5276' },
  selectSeatBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1a5276', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  selectSeatText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
