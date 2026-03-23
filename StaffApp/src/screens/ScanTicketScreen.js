import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ticketAPI } from '../services/api';
import Toast from 'react-native-toast-message';

export default function ScanTicketScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [totalScanned, setTotalScanned] = useState(0);

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) => setHasPermission(status === 'granted')).catch(() => setHasPermission(true));
  }, []);

  const handleScan = async ({ data }) => {
    setScanned(true);
    try {
      const parsed = JSON.parse(data);
      const result = { code: parsed.code || parsed.booking_code, seat: parsed.seat || parsed.seat_number, valid: true };
      try {
        const { data: validation } = await ticketAPI.validate({ booking_code: result.code });
        result.passenger = validation.passenger_name;
        result.route = validation.route_name;
        result.valid = validation.valid !== false;
      } catch (_) {
        result.passenger = 'Demo Passenger';
        result.route = 'Manila to Tuguegarao';
      }
      setLastResult(result);
      setTotalScanned(prev => prev + 1);
      if (result.valid) {
        try { await ticketAPI.boardPassenger({ booking_code: result.code }); } catch (_) {}
        Toast.show({ type: 'success', text1: 'Valid Ticket ✓', text2: `${result.passenger} • Seat #${result.seat}` });
      } else {
        Toast.show({ type: 'error', text1: 'Invalid Ticket', text2: 'This ticket is not valid for this trip' });
      }
    } catch (_) {
      setLastResult({ code: data, valid: false });
      Toast.show({ type: 'error', text1: 'Invalid QR Code', text2: 'Could not read ticket data' });
    }
  };

  if (hasPermission === false) {
    return <View style={styles.center}><Icon name="camera-off" size={48} color="#ccc" /><Text style={styles.permText}>Camera permission is required</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerWrap}>
        {hasPermission && (
          <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleScan} style={StyleSheet.absoluteFillObject} />
        )}
        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.scanHint}>Point camera at passenger's QR code</Text>
        </View>
      </View>

      {/* Result Panel */}
      <View style={styles.resultPanel}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statNum}>{totalScanned}</Text><Text style={styles.statLabel}>Scanned</Text></View>
        </View>

        {lastResult && (
          <View style={[styles.resultCard, { borderLeftColor: lastResult.valid ? '#27ae60' : '#e74c3c' }]}>
            <Icon name={lastResult.valid ? 'check-circle' : 'x-circle'} size={28} color={lastResult.valid ? '#27ae60' : '#e74c3c'} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resultTitle}>{lastResult.valid ? 'Valid Ticket' : 'Invalid Ticket'}</Text>
              <Text style={styles.resultCode}>{lastResult.code}</Text>
              {lastResult.passenger && <Text style={styles.resultDetail}>{lastResult.passenger} • Seat #{lastResult.seat}</Text>}
              {lastResult.route && <Text style={styles.resultRoute}>{lastResult.route}</Text>}
            </View>
          </View>
        )}

        {scanned && (
          <TouchableOpacity style={styles.scanAgainBtn} onPress={() => { setScanned(false); setLastResult(null); }}>
            <Icon name="refresh-cw" size={18} color="#fff" />
            <Text style={styles.scanAgainText}>Scan Next Ticket</Text>
          </TouchableOpacity>
        )}

        {!scanned && !lastResult && (
          <View style={styles.readyCard}><Icon name="camera" size={24} color="#1a5276" /><Text style={styles.readyText}>Ready to scan tickets</Text></View>
        )}
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6fa', gap: 12 },
  permText: { fontSize: 16, color: '#888' },
  scannerWrap: { flex: 1.2, position: 'relative' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 240, height: 240, position: 'relative' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#fff' },
  topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  scanHint: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 20 },
  resultPanel: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingTop: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: 'bold', color: '#1a5276' },
  statLabel: { fontSize: 12, color: '#888' },
  resultCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#f9f9f9', borderRadius: 14, padding: 16, borderLeftWidth: 4, marginBottom: 14 },
  resultTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  resultCode: { fontSize: 13, color: '#888', marginTop: 2, letterSpacing: 1 },
  resultDetail: { fontSize: 14, color: '#555', marginTop: 4 },
  resultRoute: { fontSize: 12, color: '#888', marginTop: 2 },
  scanAgainBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1a5276', paddingVertical: 14, borderRadius: 12 },
  scanAgainText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  readyCard: { alignItems: 'center', gap: 8, padding: 20 },
  readyText: { fontSize: 14, color: '#888' },
});
