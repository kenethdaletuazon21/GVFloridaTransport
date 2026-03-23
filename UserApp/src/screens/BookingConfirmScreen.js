import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Share } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import QRCode from 'react-native-qrcode-svg';
import { format } from 'date-fns';

export default function BookingConfirmScreen({ navigation, route }) {
  const { trip, seat, booking, method, total } = route.params;
  const code = booking?.booking_code || 'GVF-DEMO';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `GV Florida Transport\nBooking: ${code}\nRoute: ${trip.route_name}\nSeat: #${seat}\nAmount: ₱${total?.toLocaleString()}\nDate: ${format(new Date(), 'MMM dd, yyyy')}`,
      });
    } catch (_) {}
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Icon name="check-circle" size={64} color="#27ae60" />
        </View>
        <Text style={styles.successTitle}>{method === 'counter' ? 'Reservation Confirmed!' : 'Booking Confirmed!'}</Text>
        <Text style={styles.successSub}>Your ticket has been {method === 'counter' ? 'reserved' : 'booked'} successfully</Text>

        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <QRCode value={JSON.stringify({ code, trip_id: trip.id, seat })} size={180} backgroundColor="#fff" color="#1a5276" />
          <Text style={styles.bookingCode}>{code}</Text>
          <Text style={styles.qrHint}>Show this QR code to the conductor</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.detailRow}><Icon name="map-pin" size={16} color="#1a5276" /><Text style={styles.detailLabel}>Route</Text><Text style={styles.detailValue}>{trip.route_name}</Text></View>
          <View style={styles.detailRow}><Icon name="calendar" size={16} color="#1a5276" /><Text style={styles.detailLabel}>Date</Text><Text style={styles.detailValue}>{format(new Date(), 'MMM dd, yyyy')}</Text></View>
          <View style={styles.detailRow}><Icon name="clock" size={16} color="#1a5276" /><Text style={styles.detailLabel}>Departure</Text><Text style={styles.detailValue}>{trip.departure_time || '06:00 AM'}</Text></View>
          <View style={styles.detailRow}><Icon name="hash" size={16} color="#1a5276" /><Text style={styles.detailLabel}>Seat</Text><Text style={styles.detailValue}>#{seat}</Text></View>
          <View style={styles.detailRow}><Icon name="truck" size={16} color="#1a5276" /><Text style={styles.detailLabel}>Bus</Text><Text style={styles.detailValue}>{trip.bus_type?.replace('_', ' ')} - {trip.bus_number}</Text></View>
          <View style={styles.divider} />
          <View style={styles.detailRow}><Icon name="credit-card" size={16} color="#1a5276" /><Text style={styles.detailLabel}>Payment</Text><Text style={styles.detailValue}>{method?.toUpperCase()}</Text></View>
          <View style={styles.detailRow}><Icon name="dollar-sign" size={16} color="#1a5276" /><Text style={styles.detailLabel}>Total</Text><Text style={styles.totalValue}>₱{(total || 0).toLocaleString()}</Text></View>
        </View>

        {method === 'counter' && (
          <View style={styles.notice}>
            <Icon name="alert-circle" size={18} color="#e67e22" />
            <Text style={styles.noticeText}>Please pay at the terminal counter before departure. Unpaid reservations will be cancelled 30 minutes before departure.</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Icon name="share-2" size={20} color="#1a5276" />
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('HomeTab')}>
          <Icon name="home" size={20} color="#fff" />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20, alignItems: 'center', paddingBottom: 100 },
  successIcon: { marginTop: 10, marginBottom: 12 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#27ae60', marginBottom: 4 },
  successSub: { fontSize: 14, color: '#888', marginBottom: 24 },
  qrCard: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 20, elevation: 3, width: '100%' },
  bookingCode: { fontSize: 22, fontWeight: 'bold', color: '#1a5276', marginTop: 16, letterSpacing: 2 },
  qrHint: { fontSize: 12, color: '#888', marginTop: 6 },
  detailCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, width: '100%', marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  detailLabel: { flex: 1, fontSize: 14, color: '#888' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#1a5276' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  notice: { flexDirection: 'row', gap: 10, backgroundColor: '#fef9e7', borderRadius: 12, padding: 14, alignItems: 'flex-start', width: '100%' },
  noticeText: { flex: 1, fontSize: 13, color: '#7d6608', lineHeight: 18 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', elevation: 8 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: '#1a5276' },
  shareBtnText: { fontSize: 15, fontWeight: '600', color: '#1a5276' },
  homeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 2, backgroundColor: '#1a5276', paddingVertical: 14, borderRadius: 12 },
  homeBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
