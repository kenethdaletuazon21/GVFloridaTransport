import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';
import * as Location from 'expo-location';
import { geoTagAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const CHECKPOINTS = [
  { id: 1, name: 'Sampaloc Terminal', lat: 14.6091, lng: 120.9892, checked: true, time: '06:05 AM' },
  { id: 2, name: 'Cabanatuan City', lat: 15.4869, lng: 120.9654, checked: true, time: '08:30 AM' },
  { id: 3, name: 'San Jose City', lat: 15.7895, lng: 120.9908, checked: false },
  { id: 4, name: 'Bayombong', lat: 16.4821, lng: 121.1500, checked: false },
  { id: 5, name: 'Solano', lat: 16.5217, lng: 121.1789, checked: false },
  { id: 6, name: 'Santiago City', lat: 16.6892, lng: 121.5533, checked: false },
  { id: 7, name: 'Tuguegarao Terminal', lat: 17.6132, lng: 121.7270, checked: false },
];

export default function GeoTagScreen({ route }) {
  const trip = route.params?.trip;
  const [location, setLocation] = useState(null);
  const [checkpoints, setCheckpoints] = useState(CHECKPOINTS);
  const [checkingIn, setCheckingIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } else {
        setLocation({ latitude: 14.6091, longitude: 120.9892 });
      }
      if (trip) {
        try {
          const { data } = await geoTagAPI.getCheckpoints(trip.id);
          if (data.checkpoints) setCheckpoints(data.checkpoints);
        } catch (_) {}
      }
      setLoading(false);
    })();
  }, []);

  const handleCheckIn = async (checkpoint) => {
    if (checkpoint.checked) return;
    setCheckingIn(true);
    try {
      await geoTagAPI.checkIn({
        trip_id: trip?.id,
        checkpoint_id: checkpoint.id,
        checkpoint_name: checkpoint.name,
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
    } catch (_) {}
    setCheckpoints(prev => prev.map(c =>
      c.id === checkpoint.id ? { ...c, checked: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : c
    ));
    setCheckingIn(false);
    Toast.show({ type: 'success', text1: 'Checked in!', text2: checkpoint.name });
  };

  const progress = checkpoints.filter(c => c.checked).length;

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1a5276" /></View>;

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{ latitude: location?.latitude || 15.5, longitude: location?.longitude || 121.0, latitudeDelta: 4, longitudeDelta: 2 }}
      >
        {checkpoints.map(cp => (
          <Marker key={cp.id} coordinate={{ latitude: cp.lat, longitude: cp.lng }} title={cp.name} pinColor={cp.checked ? '#27ae60' : '#e74c3c'} />
        ))}
        {location && <Marker coordinate={location} title="Your Location"><View style={styles.myLocMarker}><View style={styles.myLocDot} /></View></Marker>}
      </MapView>

      {/* Checkpoints Panel */}
      <View style={styles.panel}>
        <View style={styles.handle} />
        <View style={styles.progressRow}>
          <Text style={styles.progressTitle}>Route Progress</Text>
          <Text style={styles.progressText}>{progress}/{checkpoints.length}</Text>
        </View>
        <View style={styles.progressBarWrap}><View style={[styles.progressBar, { width: `${(progress / checkpoints.length) * 100}%` }]} /></View>

        <ScrollView style={styles.checkpointList}>
          {checkpoints.map((cp, i) => (
            <View key={cp.id} style={styles.checkpointItem}>
              <View style={styles.checkpointTimeline}>
                <View style={[styles.checkDot, cp.checked && styles.checkDotActive]}>
                  {cp.checked && <Icon name="check" size={10} color="#fff" />}
                </View>
                {i < checkpoints.length - 1 && <View style={[styles.checkLine, cp.checked && styles.checkLineActive]} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.checkName, cp.checked && { color: '#333' }]}>{cp.name}</Text>
                {cp.time && <Text style={styles.checkTime}>{cp.time}</Text>}
              </View>
              {!cp.checked && (
                <TouchableOpacity style={styles.checkInBtn} onPress={() => handleCheckIn(cp)} disabled={checkingIn}>
                  <Text style={styles.checkInText}>Check In</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
  myLocMarker: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(26,82,118,0.3)', justifyContent: 'center', alignItems: 'center' },
  myLocDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1a5276' },
  panel: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '55%', backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingTop: 12, elevation: 10 },
  handle: { width: 40, height: 4, backgroundColor: '#ddd', borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  progressText: { fontSize: 14, fontWeight: '600', color: '#1a5276' },
  progressBarWrap: { height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, overflow: 'hidden', marginBottom: 16 },
  progressBar: { height: '100%', backgroundColor: '#27ae60', borderRadius: 3 },
  checkpointList: {},
  checkpointItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 0 },
  checkpointTimeline: { alignItems: 'center', width: 24 },
  checkDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  checkDotActive: { backgroundColor: '#27ae60', borderColor: '#27ae60' },
  checkLine: { width: 2, height: 30, backgroundColor: '#ddd' },
  checkLineActive: { backgroundColor: '#27ae60' },
  checkName: { fontSize: 14, fontWeight: '500', color: '#888' },
  checkTime: { fontSize: 12, color: '#27ae60', marginTop: 2 },
  checkInBtn: { backgroundColor: '#1a5276', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  checkInText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
