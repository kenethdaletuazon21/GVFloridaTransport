import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';
import { trackingAPI } from '../services/api';
import io from 'socket.io-client';

const { width } = Dimensions.get('window');

export default function TrackingScreen({ navigation, route }) {
  const { trip } = route.params || {};
  const mapRef = useRef(null);
  const [busLocation, setBusLocation] = useState({ latitude: 14.6091, longitude: 120.9892, heading: 0 });
  const [eta, setEta] = useState('2h 15m');
  const [status, setStatus] = useState('In Transit');
  const [speed, setSpeed] = useState(65);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
    const socket = io('http://localhost:3000', { transports: ['websocket'] });
    socket.on('bus-location', (data) => {
      if (data.trip_id === trip?.id || data.bus_id === trip?.bus_id) {
        setBusLocation({ latitude: data.latitude, longitude: data.longitude, heading: data.heading || 0 });
        if (data.speed) setSpeed(data.speed);
        if (data.eta) setEta(data.eta);
      }
    });
    // Demo movement simulation
    const interval = setInterval(() => {
      setBusLocation(prev => ({
        ...prev,
        latitude: prev.latitude + (Math.random() - 0.3) * 0.005,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.003,
      }));
      setSpeed(Math.floor(50 + Math.random() * 40));
    }, 5000);
    return () => { socket.disconnect(); clearInterval(interval); };
  }, []);

  const loadTracking = async () => {
    try {
      const { data } = await trackingAPI.getBusLocation(trip?.bus_id);
      if (data.latitude) setBusLocation(data);
    } catch (_) {}
    setLoading(false);
  };

  const centerOnBus = () => {
    mapRef.current?.animateToRegion({ ...busLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 500);
  };

  const routeCoords = [
    { latitude: 14.6091, longitude: 120.9892 },
    { latitude: 14.85, longitude: 121.05 },
    { latitude: 15.2, longitude: 121.1 },
    { latitude: 15.6, longitude: 121.15 },
    { latitude: 16.0, longitude: 121.2 },
    { latitude: 16.5, longitude: 121.4 },
    { latitude: 17.0, longitude: 121.6 },
    { latitude: 17.6, longitude: 121.7 },
  ];

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1a5276" /></View>;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{ ...busLocation, latitudeDelta: 0.15, longitudeDelta: 0.15 }}
      >
        <Marker coordinate={busLocation} title={trip?.bus_number || 'GV Bus'} description={status}>
          <View style={styles.busMarker}>
            <Text style={styles.busEmoji}>🚌</Text>
          </View>
        </Marker>
        <Marker coordinate={routeCoords[0]} title="Origin - Manila" pinColor="#1a5276" />
        <Marker coordinate={routeCoords[routeCoords.length - 1]} title={`Destination - ${trip?.route_name?.split(' to ')[1] || 'Tuguegarao'}`} pinColor="#e74c3c" />
        <Polyline coordinates={routeCoords} strokeColor="#1a5276" strokeWidth={3} lineDashPattern={[10, 5]} />
      </MapView>

      {/* Center on Bus */}
      <TouchableOpacity style={styles.centerBtn} onPress={centerOnBus}>
        <Icon name="crosshair" size={22} color="#1a5276" />
      </TouchableOpacity>

      {/* Info Panel */}
      <View style={styles.infoPanel}>
        <View style={styles.handle} />
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}><View style={styles.statusDot} /><Text style={styles.statusText}>{status}</Text></View>
          <Text style={styles.busLabel}>{trip?.bus_number || 'MNL-001'}</Text>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Icon name="clock" size={18} color="#1a5276" />
            <Text style={styles.metricValue}>{eta}</Text>
            <Text style={styles.metricLabel}>ETA</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Icon name="navigation" size={18} color="#1a5276" />
            <Text style={styles.metricValue}>{speed} km/h</Text>
            <Text style={styles.metricLabel}>Speed</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Icon name="map-pin" size={18} color="#1a5276" />
            <Text style={styles.metricValue}>{trip?.route_name?.split(' to ')[0] || 'Manila'}</Text>
            <Text style={styles.metricLabel}>From</Text>
          </View>
        </View>

        <View style={styles.routeProgress}>
          <View style={styles.progressBar}><View style={[styles.progressFill, { width: '35%' }]} /></View>
          <Text style={styles.progressText}>35% of journey completed</Text>
        </View>

        <TouchableOpacity style={styles.callBtn}>
          <Icon name="phone" size={18} color="#fff" />
          <Text style={styles.callBtnText}>Contact Driver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
  busMarker: { backgroundColor: '#fff', borderRadius: 20, padding: 4, elevation: 4 },
  busEmoji: { fontSize: 24 },
  centerBtn: { position: 'absolute', top: 60, right: 16, backgroundColor: '#fff', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  infoPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingTop: 12, elevation: 10 },
  handle: { width: 40, height: 4, backgroundColor: '#ddd', borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#eafaf1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#27ae60' },
  statusText: { fontSize: 13, fontWeight: '600', color: '#27ae60' },
  busLabel: { fontSize: 15, fontWeight: '700', color: '#1a5276' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  metricItem: { alignItems: 'center', gap: 4 },
  metricValue: { fontSize: 16, fontWeight: '700', color: '#333' },
  metricLabel: { fontSize: 11, color: '#888' },
  metricDivider: { width: 1, backgroundColor: '#eee' },
  routeProgress: { marginBottom: 16 },
  progressBar: { height: 6, backgroundColor: '#e8f0f5', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#1a5276', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#888', marginTop: 6, textAlign: 'center' },
  callBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#27ae60', paddingVertical: 14, borderRadius: 12 },
  callBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
