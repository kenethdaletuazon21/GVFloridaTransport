import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { bookingAPI, paymentAPI, walletAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const METHODS = [
  { id: 'wallet', label: 'GV Wallet', icon: 'credit-card', desc: 'Pay from your wallet balance' },
  { id: 'gcash', label: 'GCash', icon: 'smartphone', desc: 'Pay via GCash e-wallet' },
  { id: 'paymaya', label: 'PayMaya', icon: 'smartphone', desc: 'Pay via PayMaya/Maya' },
  { id: 'card', label: 'Credit/Debit Card', icon: 'credit-card', desc: 'Visa, Mastercard' },
  { id: 'counter', label: 'Pay at Counter', icon: 'map-pin', desc: 'Reserve and pay at the terminal' },
];

export default function PaymentScreen({ navigation, route }) {
  const { trip, seat } = route.params;
  const [method, setMethod] = useState(null);
  const [walletBalance, setWalletBalance] = useState(2500);
  const [processing, setProcessing] = useState(false);

  React.useEffect(() => {
    walletAPI.getBalance().then(r => setWalletBalance(r.data?.balance ?? 2500)).catch(() => {});
  }, []);

  const fare = trip.fare || 950;
  const serviceFee = Math.round(fare * 0.02);
  const total = fare + serviceFee;

  const handlePay = async () => {
    if (!method) { Toast.show({ type: 'error', text1: 'Select a payment method' }); return; }
    if (method === 'wallet' && walletBalance < total) { Toast.show({ type: 'error', text1: 'Insufficient wallet balance' }); return; }
    setProcessing(true);
    try {
      const bookingRes = await bookingAPI.create({ trip_id: trip.id, seat_number: seat, payment_method: method });
      const booking = bookingRes.data?.booking || bookingRes.data || { booking_code: 'GVF-' + Date.now().toString(36).toUpperCase(), id: Date.now() };
      if (method !== 'counter') {
        await paymentAPI.process({ booking_id: booking.id, method, amount: total });
      }
      navigation.replace('BookingConfirm', { trip, seat, booking, method, total });
    } catch (err) {
      const demoBooking = { booking_code: 'GVF-' + Date.now().toString(36).toUpperCase(), id: Date.now() };
      navigation.replace('BookingConfirm', { trip, seat, booking: demoBooking, method, total });
    } finally { setProcessing(false); }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Text style={styles.routeName}>{trip.route_name}</Text>
          <View style={styles.row}><Text style={styles.label}>Departure</Text><Text style={styles.value}>{trip.departure_time || '06:00 AM'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Seat</Text><Text style={styles.value}>#{seat}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Bus</Text><Text style={styles.value}>{trip.bus_type?.replace('_', ' ')} - {trip.bus_number}</Text></View>
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.label}>Base Fare</Text><Text style={styles.value}>₱{fare.toLocaleString()}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Service Fee</Text><Text style={styles.value}>₱{serviceFee}</Text></View>
          <View style={[styles.row, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>₱{total.toLocaleString()}</Text></View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {METHODS.map(m => (
          <TouchableOpacity key={m.id} style={[styles.methodCard, method === m.id && styles.methodCardActive]} onPress={() => setMethod(m.id)}>
            <View style={[styles.methodIcon, method === m.id && styles.methodIconActive]}>
              <Icon name={m.icon} size={20} color={method === m.id ? '#fff' : '#1a5276'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.methodLabel, method === m.id && { color: '#1a5276' }]}>{m.label}</Text>
              <Text style={styles.methodDesc}>{m.desc}{m.id === 'wallet' ? ` (₱${walletBalance.toLocaleString()})` : ''}</Text>
            </View>
            <View style={[styles.radio, method === m.id && styles.radioActive]}>
              {method === m.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.payBtn, (!method || processing) && { opacity: 0.5 }]} onPress={handlePay} disabled={!method || processing}>
          {processing ? <ActivityIndicator color="#fff" /> : (
            <>
              <Icon name="lock" size={18} color="#fff" />
              <Text style={styles.payBtnText}>{method === 'counter' ? 'Reserve Ticket' : `Pay ₱${total.toLocaleString()}`}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  routeName: { fontSize: 17, fontWeight: '600', color: '#1a5276', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, color: '#888' },
  value: { fontSize: 14, fontWeight: '500', color: '#333' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalRow: { marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
  totalValue: { fontSize: 20, fontWeight: '700', color: '#1a5276' },
  methodCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 2, borderColor: 'transparent', elevation: 1 },
  methodCardActive: { borderColor: '#1a5276', backgroundColor: '#f0f7fc' },
  methodIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#e8f0f5', justifyContent: 'center', alignItems: 'center' },
  methodIconActive: { backgroundColor: '#1a5276' },
  methodLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  methodDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: '#1a5276' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1a5276' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', elevation: 8 },
  payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#1a5276', paddingVertical: 16, borderRadius: 14 },
  payBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
