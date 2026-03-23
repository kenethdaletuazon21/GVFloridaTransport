import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Toast from 'react-native-toast-message';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || 'Juan',
    last_name: user?.last_name || 'Dela Cruz',
    email: user?.email || 'juan@email.com',
    phone: user?.phone || '0917-123-4567',
  });
  const [notifs, setNotifs] = useState({ push: true, email: true, promo: false, tripUpdates: true });

  const handleSave = async () => {
    try { await userAPI.updateProfile(form); updateUser?.(form); } catch (_) {}
    setEditing(false);
    Toast.show({ type: 'success', text1: 'Profile updated' });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone. All your data, booking history, and loyalty points will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Type DELETE to confirm account deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await userAPI.deleteAccount();
                      Toast.show({ type: 'success', text1: 'Account deleted' });
                      logout();
                    } catch (_) {
                      Toast.show({ type: 'error', text1: 'Failed to delete account' });
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const loyaltyPoints = user?.loyalty_points || 1250;
  const loyaltyTier = loyaltyPoints >= 5000 ? 'Gold' : loyaltyPoints >= 2000 ? 'Silver' : 'Bronze';

  const menuItems = [
    { icon: 'clock', label: 'Travel History', onPress: () => navigation.navigate('MyTripsTab') },
    { icon: 'bell', label: 'Notifications', onPress: () => navigation.navigate('Notifications') },
    { icon: 'help-circle', label: 'Help & Support', onPress: () => {} },
    { icon: 'file-text', label: 'Terms & Conditions', onPress: () => navigation.navigate('Terms') },
    { icon: 'shield', label: 'Privacy Policy', onPress: () => navigation.navigate('Privacy') },
    { icon: 'info', label: 'About GV Florida', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(form.first_name[0] || 'J') + (form.last_name[0] || 'D')}</Text>
          </View>
          <Text style={styles.name}>{form.first_name} {form.last_name}</Text>
          <Text style={styles.email}>{form.email}</Text>
        </View>

        {/* Loyalty Card */}
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <View>
              <Text style={styles.loyaltyTitle}>Loyalty Program</Text>
              <Text style={styles.loyaltyTier}>{loyaltyTier} Member</Text>
            </View>
            <View style={styles.pointsBadge}>
              <Icon name="award" size={18} color="#f1c40f" />
              <Text style={styles.pointsText}>{loyaltyPoints.toLocaleString()} pts</Text>
            </View>
          </View>
          <View style={styles.loyaltyProgress}>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${Math.min((loyaltyPoints / 5000) * 100, 100)}%` }]} /></View>
            <Text style={styles.progressLabel}>{loyaltyPoints >= 5000 ? 'Gold tier reached!' : `${(5000 - loyaltyPoints).toLocaleString()} pts to Gold`}</Text>
          </View>
        </View>

        {/* Edit Profile */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)}>
              <Text style={styles.editBtn}>{editing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>
          {editing ? (
            <View style={styles.form}>
              <TextInput style={styles.input} value={form.first_name} onChangeText={v => setForm(f => ({ ...f, first_name: v }))} placeholder="First Name" />
              <TextInput style={styles.input} value={form.last_name} onChangeText={v => setForm(f => ({ ...f, last_name: v }))} placeholder="Last Name" />
              <TextInput style={styles.input} value={form.phone} onChangeText={v => setForm(f => ({ ...f, phone: v }))} placeholder="Phone" keyboardType="phone-pad" />
            </View>
          ) : (
            <View style={styles.infoList}>
              <View style={styles.infoRow}><Icon name="user" size={16} color="#888" /><Text style={styles.infoText}>{form.first_name} {form.last_name}</Text></View>
              <View style={styles.infoRow}><Icon name="mail" size={16} color="#888" /><Text style={styles.infoText}>{form.email}</Text></View>
              <View style={styles.infoRow}><Icon name="phone" size={16} color="#888" /><Text style={styles.infoText}>{form.phone}</Text></View>
            </View>
          )}
        </View>

        {/* Notification Preferences */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          {[
            { key: 'push', label: 'Push Notifications' },
            { key: 'email', label: 'Email Notifications' },
            { key: 'tripUpdates', label: 'Trip Updates' },
            { key: 'promo', label: 'Promotions & Offers' },
          ].map(item => (
            <View key={item.key} style={styles.switchRow}>
              <Text style={styles.switchLabel}>{item.label}</Text>
              <Switch value={notifs[item.key]} onValueChange={v => setNotifs(n => ({ ...n, [item.key]: v }))} trackColor={{ true: '#1a5276' }} thumbColor={notifs[item.key] ? '#e8f0f5' : '#ccc'} />
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.card}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.menuItem, i < menuItems.length - 1 && styles.menuBorder]} onPress={item.onPress}>
              <Icon name={item.icon} size={20} color="#D90045" />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={18} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Icon name="trash-2" size={18} color="#999" />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>

        <Text style={styles.version}>GV Florida App v1.0.0</Text>
      </ScrollView>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#D90045', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#888', marginTop: 2 },
  loyaltyCard: { backgroundColor: '#1a3c5e', borderRadius: 16, padding: 18, marginBottom: 16, elevation: 3 },
  loyaltyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  loyaltyTitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  loyaltyTier: { fontSize: 18, fontWeight: 'bold', color: '#f1c40f', marginTop: 2 },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  pointsText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  loyaltyProgress: {},
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#f1c40f', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, elevation: 1 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  editBtn: { fontSize: 14, fontWeight: '600', color: '#D90045' },
  form: { gap: 10 },
  input: { backgroundColor: '#f5f6fa', borderRadius: 10, padding: 12, fontSize: 15 },
  infoList: { gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoText: { fontSize: 15, color: '#333' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', trackColor: '#D90045' },
  switchLabel: { fontSize: 14, color: '#555' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuLabel: { flex: 1, fontSize: 15, color: '#333' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, marginTop: 8, marginBottom: 8 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#e74c3c' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, marginTop: 4, marginBottom: 8 },
  deleteText: { fontSize: 14, color: '#999' },
  version: { textAlign: 'center', fontSize: 12, color: '#ccc', marginBottom: 20 },
});
