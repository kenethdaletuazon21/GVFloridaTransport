import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { notificationAPI } from '../services/api';

const DEMO_NOTIFS = [
  { id: 1, type: 'trip', title: 'Trip Reminder', message: 'Your trip to Tuguegarao departs tomorrow at 6:00 AM from Sampaloc Terminal.', read: false, created_at: '2025-02-14T18:00:00' },
  { id: 2, type: 'promo', title: '20% Off Weekend Trips!', message: 'Book any weekend trip and get 20% discount. Use code WEEKEND20.', read: false, created_at: '2025-02-13T10:00:00' },
  { id: 3, type: 'wallet', title: 'Top-up Successful', message: 'Your wallet has been topped up with ₱2,000 via GCash.', read: true, created_at: '2025-02-10T10:05:00' },
  { id: 4, type: 'trip', title: 'Trip Completed', message: 'Your trip Manila to Santiago has been completed. Rate your experience!', read: true, created_at: '2025-02-08T17:30:00' },
  { id: 5, type: 'system', title: 'App Update Available', message: 'A new version of GV Florida app is available. Update for the latest features.', read: true, created_at: '2025-02-05T09:00:00' },
  { id: 6, type: 'wallet', title: 'Refund Processed', message: 'Refund of ₱850 for cancelled booking has been credited to your wallet.', read: true, created_at: '2025-02-03T09:20:00' },
];

const TYPE_CONFIG = {
  trip: { icon: 'map', color: '#1a5276', bg: '#e8f0f5' },
  promo: { icon: 'tag', color: '#e67e22', bg: '#fef9e7' },
  wallet: { icon: 'credit-card', color: '#27ae60', bg: '#eafaf1' },
  system: { icon: 'settings', color: '#8e44ad', bg: '#f4ecf7' },
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await notificationAPI.getAll();
      setNotifications(data.notifications || data || []);
    } catch (_) { setNotifications(DEMO_NOTIFS); }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try { await notificationAPI.markRead(id); } catch (_) {}
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try { await notificationAPI.markAllRead(); } catch (_) {}
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotification = ({ item }) => {
    const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.system;
    return (
      <TouchableOpacity style={[styles.notifCard, !item.read && styles.notifUnread]} onPress={() => markAsRead(item.id)}>
        <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
          <Icon name={config.icon} size={20} color={config.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.notifHeader}>
            <Text style={[styles.notifTitle, !item.read && { fontWeight: '700' }]}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
          <Text style={styles.notifTime}>{format(new Date(item.created_at), 'MMM dd • hh:mm a')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1a5276" /></View>;

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <View style={styles.topBar}>
          <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
          <TouchableOpacity onPress={markAllRead}><Text style={styles.markAllText}>Mark all read</Text></TouchableOpacity>
        </View>
      )}
      <FlatList
        data={notifications}
        keyExtractor={item => String(item.id)}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<View style={styles.empty}><Icon name="bell-off" size={48} color="#ccc" /><Text style={styles.emptyText}>No notifications</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  unreadText: { fontSize: 13, color: '#888' },
  markAllText: { fontSize: 13, fontWeight: '600', color: '#1a5276' },
  list: { padding: 16 },
  notifCard: { flexDirection: 'row', gap: 14, backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1 },
  notifUnread: { borderLeftWidth: 3, borderLeftColor: '#1a5276' },
  iconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  notifTitle: { fontSize: 15, fontWeight: '500', color: '#333', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1a5276' },
  notifMessage: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, color: '#aaa' },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: '#888' },
});
