import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import QRCode from 'react-native-qrcode-svg';
import { format } from 'date-fns';
import { bookingAPI } from '../services/api';
import Toast from 'react-native-toast-message';

export default function TripDetailScreen({ navigation, route }) {
  const { trip } = route.params;
  const [rating, setRating] = useState(trip.rating || 0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(!!trip.rating);

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking? The fare will be refunded to your wallet.', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
        try { await bookingAPI.cancel(trip.id); } catch (_) {}
        Toast.show({ type: 'success', text1: 'Booking cancelled', text2: 'Refund has been processed to your wallet' });
        navigation.goBack();
      }},
    ]);
  };

  const handleRate = async () => {
    if (rating === 0) { Toast.show({ type: 'error', text1: 'Please select a rating' }); return; }
    try { await bookingAPI.rate?.(trip.id, { rating, review }); } catch (_) {}
    setSubmitted(true);
    Toast.show({ type: 'success', text1: 'Thank you for your feedback!' });
  };

  const isUpcoming = trip.status === 'confirmed' || trip.status === 'booked';
  const isCompleted = trip.status === 'completed';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Status Header */}
        <View style={[styles.statusHeader, { backgroundColor: isUpcoming ? '#eafaf1' : isCompleted ? '#e8f0f5' : '#fde8e8' }]}>
          <Icon name={isUpcoming ? 'check-circle' : isCompleted ? 'award' : 'x-circle'} size={24} color={isUpcoming ? '#27ae60' : isCompleted ? '#1a5276' : '#e74c3c'} />
          <Text style={[styles.statusTitle, { color: isUpcoming ? '#27ae60' : isCompleted ? '#1a5276' : '#e74c3c' }]}>{trip.status?.toUpperCase()}</Text>
        </View>

        {/* QR Code */}
        {isUpcoming && (
          <View style={styles.qrSection}>
            <QRCode value={JSON.stringify({ code: trip.booking_code, id: trip.id })} size={160} color="#1a5276" />
            <Text style={styles.bookingCode}>{trip.booking_code}</Text>
          </View>
        )}

        {/* Trip Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Information</Text>
          <Text style={styles.routeName}>{trip.route_name}</Text>
          <View style={styles.timeline}>
            <View style={styles.timelinePoint}><View style={styles.dot} /><View><Text style={styles.timeLabel}>Departure</Text><Text style={styles.timeValue}>{format(new Date(trip.departure_time), 'MMM dd, yyyy • hh:mm a')}</Text></View></View>
            <View style={styles.timelineLine} />
            <View style={styles.timelinePoint}><View style={[styles.dot, { backgroundColor: '#e74c3c' }]} /><View><Text style={styles.timeLabel}>Arrival (Est.)</Text><Text style={styles.timeValue}>{trip.arrival_time ? format(new Date(trip.arrival_time), 'MMM dd, yyyy • hh:mm a') : 'TBD'}</Text></View></View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Seat Number</Text><Text style={styles.infoValue}>#{trip.seat_number}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Bus Type</Text><Text style={styles.infoValue}>{trip.bus_type?.replace('_', ' ')}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Total Fare</Text><Text style={styles.infoValue}>₱{trip.fare?.toLocaleString()}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Booking Code</Text><Text style={styles.infoValue}>{trip.booking_code}</Text></View>
          </View>
        </View>

        {/* Rate Trip */}
        {isCompleted && !submitted && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Rate Your Trip</Text>
            <View style={styles.starRow}>
              {[1,2,3,4,5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Icon name="star" size={36} color={s <= rating ? '#f1c40f' : '#ddd'} />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.reviewInput} placeholder="Share your experience (optional)" multiline numberOfLines={3} value={review} onChangeText={setReview} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleRate}>
              <Text style={styles.submitBtnText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        )}
        {isCompleted && submitted && (
          <View style={styles.ratedCard}>
            <Icon name="check-circle" size={20} color="#27ae60" />
            <Text style={styles.ratedText}>You rated this trip {rating}/5 stars</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      {isUpcoming && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.trackBtn} onPress={() => navigation.navigate('Tracking', { trip })}>
            <Icon name="navigation" size={18} color="#fff" />
            <Text style={styles.trackBtnText}>Track Bus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Icon name="x" size={18} color="#e74c3c" />
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20, paddingBottom: 100 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 14, marginBottom: 20 },
  statusTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  qrSection: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 24, marginBottom: 20, elevation: 2 },
  bookingCode: { fontSize: 18, fontWeight: 'bold', color: '#1a5276', marginTop: 12, letterSpacing: 2 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  routeName: { fontSize: 18, fontWeight: '700', color: '#1a5276', marginBottom: 16 },
  timeline: { gap: 4 },
  timelinePoint: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1a5276' },
  timelineLine: { width: 2, height: 24, backgroundColor: '#ddd', marginLeft: 5 },
  timeLabel: { fontSize: 12, color: '#888' },
  timeValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoItem: { width: '45%' },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  infoValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  starRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  reviewInput: { backgroundColor: '#f5f6fa', borderRadius: 12, padding: 14, fontSize: 14, textAlignVertical: 'top', marginBottom: 12 },
  submitBtn: { backgroundColor: '#1a5276', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  ratedCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#eafaf1', borderRadius: 14, padding: 16 },
  ratedText: { fontSize: 14, fontWeight: '500', color: '#27ae60' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', elevation: 8 },
  trackBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1a5276', paddingVertical: 14, borderRadius: 12 },
  trackBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cancelBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: '#e74c3c', paddingVertical: 14, borderRadius: 12 },
  cancelBtnText: { color: '#e74c3c', fontSize: 15, fontWeight: '600' },
});
