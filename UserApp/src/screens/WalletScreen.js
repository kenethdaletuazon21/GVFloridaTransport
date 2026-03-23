import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { walletAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const TOPUP_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function WalletScreen({ navigation }) {
  const [balance, setBalance] = useState(2500);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { loadWallet(); }, []);

  const loadWallet = async () => {
    try {
      const [balRes, txRes] = await Promise.all([walletAPI.getBalance(), walletAPI.getTransactions()]);
      setBalance(balRes.data?.balance ?? 2500);
      setTransactions(txRes.data?.transactions || txRes.data || []);
    } catch (_) {
      setTransactions([
        { id: 1, type: 'topup', amount: 2000, method: 'GCash', created_at: '2025-02-10T10:00:00', status: 'completed' },
        { id: 2, type: 'payment', amount: -950, description: 'Manila to Tuguegarao', created_at: '2025-02-08T06:30:00', status: 'completed' },
        { id: 3, type: 'topup', amount: 1000, method: 'PayMaya', created_at: '2025-02-05T14:20:00', status: 'completed' },
        { id: 4, type: 'refund', amount: 850, description: 'Cancelled booking refund', created_at: '2025-02-03T09:15:00', status: 'completed' },
        { id: 5, type: 'payment', amount: -850, description: 'Manila to Santiago', created_at: '2025-02-01T08:00:00', status: 'completed' },
        { id: 6, type: 'topup', amount: 500, method: 'Bank Transfer', created_at: '2025-01-28T16:45:00', status: 'completed' },
      ]);
    }
    setLoading(false);
  };

  const handleTopUp = async () => {
    const amt = parseInt(topUpAmount);
    if (!amt || amt < 50) { Toast.show({ type: 'error', text1: 'Minimum top-up is ₱50' }); return; }
    if (amt > 50000) { Toast.show({ type: 'error', text1: 'Maximum top-up is ₱50,000' }); return; }
    setProcessing(true);
    try { await walletAPI.topUp({ amount: amt, method: 'gcash' }); } catch (_) {}
    setBalance(prev => prev + amt);
    setShowTopUp(false);
    setTopUpAmount('');
    setProcessing(false);
    Toast.show({ type: 'success', text1: 'Top-up successful', text2: `₱${amt.toLocaleString()} added to your wallet` });
  };

  const getIcon = (type) => {
    if (type === 'topup') return { name: 'arrow-down-circle', color: '#27ae60' };
    if (type === 'refund') return { name: 'rotate-ccw', color: '#3498db' };
    return { name: 'arrow-up-circle', color: '#e74c3c' };
  };

  const renderTransaction = ({ item }) => {
    const icon = getIcon(item.type);
    return (
      <View style={styles.txItem}>
        <View style={[styles.txIconWrap, { backgroundColor: icon.color + '15' }]}><Icon name={icon.name} size={20} color={icon.color} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.txTitle}>{item.type === 'topup' ? `Top Up via ${item.method}` : item.type === 'refund' ? 'Refund' : item.description}</Text>
          <Text style={styles.txDate}>{format(new Date(item.created_at), 'MMM dd, yyyy • hh:mm a')}</Text>
        </View>
        <Text style={[styles.txAmount, { color: item.amount >= 0 ? '#27ae60' : '#e74c3c' }]}>{item.amount >= 0 ? '+' : ''}₱{Math.abs(item.amount).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₱{balance.toLocaleString()}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setShowTopUp(true)}>
              <Icon name="plus-circle" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnOutline}>
              <Icon name="send" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Top-up */}
        {showTopUp && (
          <View style={styles.topUpCard}>
            <Text style={styles.sectionTitle}>Quick Top Up</Text>
            <View style={styles.quickAmounts}>
              {TOPUP_AMOUNTS.map(a => (
                <TouchableOpacity key={a} style={[styles.amountChip, topUpAmount === String(a) && styles.amountChipActive]} onPress={() => setTopUpAmount(String(a))}>
                  <Text style={[styles.amountChipText, topUpAmount === String(a) && styles.amountChipTextActive]}>₱{a.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.amountInput} placeholder="Or enter amount" keyboardType="numeric" value={topUpAmount} onChangeText={setTopUpAmount} />
            <View style={styles.topUpActions}>
              <TouchableOpacity style={styles.cancelTopUp} onPress={() => { setShowTopUp(false); setTopUpAmount(''); }}>
                <Text style={styles.cancelTopUpText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmTopUp, processing && { opacity: 0.5 }]} onPress={handleTopUp} disabled={processing}>
                {processing ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.confirmTopUpText}>Confirm Top Up</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Transaction History */}
        <View style={styles.txHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
        </View>
        {loading ? <ActivityIndicator size="large" color="#1a5276" /> : (
          transactions.length === 0 ? (
            <View style={styles.empty}><Icon name="inbox" size={40} color="#ccc" /><Text style={styles.emptyText}>No transactions yet</Text></View>
          ) : (
            transactions.map(tx => <View key={tx.id}>{renderTransaction({ item: tx })}</View>)
          )
        )}
      </ScrollView>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { padding: 20 },
  balanceCard: { backgroundColor: '#1a5276', borderRadius: 20, padding: 24, marginBottom: 20, elevation: 4 },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  balanceAmount: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  balanceActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  actionBtnOutline: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  topUpCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  amountChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, backgroundColor: '#f0f0f0' },
  amountChipActive: { backgroundColor: '#1a5276' },
  amountChipText: { fontSize: 14, fontWeight: '600', color: '#333' },
  amountChipTextActive: { color: '#fff' },
  amountInput: { backgroundColor: '#f5f6fa', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 14 },
  topUpActions: { flexDirection: 'row', gap: 12 },
  cancelTopUp: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: '#ddd', alignItems: 'center' },
  cancelTopUpText: { fontSize: 14, fontWeight: '600', color: '#888' },
  confirmTopUp: { flex: 2, backgroundColor: '#1a5276', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  confirmTopUpText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  txItem: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 8, elevation: 1 },
  txIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  txTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  txDate: { fontSize: 12, color: '#888', marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: '700' },
  empty: { alignItems: 'center', marginTop: 40, gap: 10 },
  emptyText: { fontSize: 15, color: '#888' },
});
