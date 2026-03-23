import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const name = `${user?.first_name || 'Staff'} ${user?.last_name || 'Member'}`;
  const role = user?.role || 'driver';
  const initials = (user?.first_name?.[0] || 'S') + (user?.last_name?.[0] || 'M');

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const infoItems = [
    { icon: 'mail', label: 'Email', value: user?.email || 'staff@gvflorida.com' },
    { icon: 'phone', label: 'Phone', value: user?.phone || '0917-000-0000' },
    { icon: 'briefcase', label: 'Role', value: role.charAt(0).toUpperCase() + role.slice(1) },
    { icon: 'hash', label: 'Employee ID', value: user?.employee_id || 'EMP-001' },
    { icon: 'map-pin', label: 'Terminal', value: user?.terminal || 'Sampaloc Terminal' },
  ];

  const menuItems = [
    { icon: 'clock', label: 'Shift History' },
    { icon: 'file-text', label: 'My Reports' },
    { icon: 'help-circle', label: 'Help & Support' },
    { icon: 'info', label: 'About' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.roleBadge}><Text style={styles.roleText}>{role.toUpperCase()}</Text></View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {infoItems.map(item => (
          <View key={item.label} style={styles.infoRow}>
            <Icon name={item.icon} size={18} color="#1a5276" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={item.label} style={[styles.menuItem, i < menuItems.length - 1 && styles.menuBorder]}>
            <Icon name={item.icon} size={20} color="#1a5276" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Icon name="chevron-right" size={18} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Icon name="log-out" size={20} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.version}>GV Florida Staff v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1a5276', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  roleBadge: { backgroundColor: '#e8f0f5', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  roleText: { fontSize: 12, fontWeight: '700', color: '#1a5276', letterSpacing: 1 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  infoLabel: { fontSize: 12, color: '#888' },
  infoValue: { fontSize: 15, fontWeight: '500', color: '#333', marginTop: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuLabel: { flex: 1, fontSize: 15, color: '#333' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, marginTop: 8 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#e74c3c' },
  version: { textAlign: 'center', fontSize: 12, color: '#ccc', marginTop: 8, marginBottom: 20 },
});
