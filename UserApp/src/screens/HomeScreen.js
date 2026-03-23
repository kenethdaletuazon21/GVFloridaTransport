import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../context/AuthContext';
import { routeAPI, walletAPI } from '../services/api';

const POPULAR_ROUTES = [
  { id: 1, from: 'Manila', to: 'Tuguegarao', price: 950, time: '10 hrs', icon: '🏔️' },
  { id: 2, from: 'Manila', to: 'Santiago', price: 850, time: '8 hrs', icon: '🌾' },
  { id: 3, from: 'Manila', to: 'Ilagan', price: 900, time: '9 hrs', icon: '🏞️' },
  { id: 4, from: 'Manila', to: 'Tabuk', price: 1050, time: '12 hrs', icon: '⛰️' },
];

const TERMINALS = [
  { name: 'Sampaloc Terminal', address: '832 AH Lacson Ave, Sampaloc, Manila', status: 'Open', phone: '02-493-7956' },
  { name: 'Kamias Terminal', address: 'Kamias Rd, Quezon City', status: 'Open', phone: '02-929-0973' },
  { name: 'Cubao Terminal', address: 'Aurora Blvd, Cubao, QC', status: 'Open', phone: '02-421-1853' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadBalance(); }, []);

  const loadBalance = async () => {
    try { const { data } = await walletAPI.getBalance(); setBalance(data.balance || 0); }
    catch (err) { console.log('Balance load error'); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBalance();
    setRefreshing(false);
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1a5276" />}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.first_name || 'Traveler'}! 👋</Text>
            <Text style={styles.subGreeting}>Where are you headed?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notifBtn}>
            <Icon name="bell" size={22} color="#fff" />
            <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>2</Text></View>
          </TouchableOpacity>
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletTop}>
            <Text style={styles.walletLabel}>GV Wallet Balance</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
              <Text style={styles.walletLink}>Top Up →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.walletBalance}>₱{balance.toLocaleString()}</Text>
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletAction} onPress={() => navigation.navigate('Wallet')}>
              <Icon name="plus-circle" size={20} color="#1a5276" /><Text style={styles.walletActionText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletAction} onPress={() => navigation.navigate('My Trips')}>
              <Icon name="clock" size={20} color="#1a5276" /><Text style={styles.walletActionText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Book */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('Search')}>
          <Icon name="search" size={20} color="#999" />
          <Text style={styles.searchPlaceholder}>Search for trips...</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.quickActions}>
          {[
            { icon: 'search', label: 'Book Trip', screen: 'Search', color: '#1a5276' },
            { icon: 'map-pin', label: 'Track Bus', screen: 'Tracking', color: '#27ae60' },
            { icon: 'calendar', label: 'My Trips', screen: 'My Trips', color: '#f39c12' },
            { icon: 'star', label: 'Promos', screen: 'Home', color: '#e74c3c' },
          ].map((action, i) => (
            <TouchableOpacity key={i} style={styles.quickAction} onPress={() => navigation.navigate(action.screen)}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                <Icon name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Popular Routes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Routes</Text>
        {POPULAR_ROUTES.map(route => (
          <TouchableOpacity key={route.id} style={styles.routeCard} onPress={() => navigation.navigate('Search', { destination: route.to })}>
            <Text style={styles.routeIcon}>{route.icon}</Text>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>{route.from} → {route.to}</Text>
              <Text style={styles.routeTime}>{route.time} journey</Text>
            </View>
            <View style={styles.routePriceBox}>
              <Text style={styles.routePrice}>₱{route.price}</Text>
              <Text style={styles.routePriceLabel}>from</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Terminals */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <Text style={styles.sectionTitle}>Our Terminals</Text>
        {TERMINALS.map((terminal, i) => (
          <View key={i} style={styles.terminalCard}>
            <View style={styles.terminalIcon}><Icon name="map-pin" size={18} color="#1a5276" /></View>
            <View style={styles.terminalInfo}>
              <Text style={styles.terminalName}>{terminal.name}</Text>
              <Text style={styles.terminalAddress}>{terminal.address}</Text>
              <View style={styles.terminalRow}>
                <View style={[styles.statusDot, { backgroundColor: '#27ae60' }]} />
                <Text style={styles.terminalStatus}>{terminal.status}</Text>
                <Text style={styles.terminalPhone}>{terminal.phone}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  header: { backgroundColor: '#1a5276', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  notifBtn: { position: 'relative', padding: 8 },
  notifBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#e74c3c', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  notifBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  walletCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { fontSize: 13, color: '#888', fontWeight: '500' },
  walletLink: { fontSize: 13, color: '#1a5276', fontWeight: '600' },
  walletBalance: { fontSize: 36, fontWeight: 'bold', color: '#1a5276', marginVertical: 8 },
  walletActions: { flexDirection: 'row', gap: 20, marginTop: 4 },
  walletAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  walletActionText: { fontSize: 13, color: '#1a5276', fontWeight: '500' },
  section: { paddingHorizontal: 20, marginTop: 20 },
  searchBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  searchPlaceholder: { fontSize: 15, color: '#999' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', flex: 1 },
  quickActionIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  quickActionLabel: { fontSize: 12, color: '#555', fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  routeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1 },
  routeIcon: { fontSize: 28, marginRight: 14 },
  routeInfo: { flex: 1 },
  routeName: { fontSize: 15, fontWeight: '600', color: '#333' },
  routeTime: { fontSize: 13, color: '#888', marginTop: 2 },
  routePriceBox: { alignItems: 'flex-end' },
  routePrice: { fontSize: 18, fontWeight: 'bold', color: '#1a5276' },
  routePriceLabel: { fontSize: 11, color: '#888' },
  terminalCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1 },
  terminalIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#e8f0f5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  terminalInfo: { flex: 1 },
  terminalName: { fontSize: 15, fontWeight: '600', color: '#333' },
  terminalAddress: { fontSize: 13, color: '#888', marginTop: 2 },
  terminalRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  terminalStatus: { fontSize: 12, color: '#27ae60', fontWeight: '600' },
  terminalPhone: { fontSize: 12, color: '#888', marginLeft: 10 },
});
