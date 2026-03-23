import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register } = useAuth();

  const update = (key, val) => setForm({ ...form, [key]: val });

  const formatPhone = (text) => {
    const digits = text.replace(/[^0-9]/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return digits.slice(0, 4) + '-' + digits.slice(4);
    return digits.slice(0, 4) + '-' + digits.slice(4, 7) + '-' + digits.slice(7, 11);
  };

  const handleRegister = async () => {
    const cleanPhone = form.phone.replace(/[^0-9]/g, '');
    if (!form.first_name || !form.last_name || !cleanPhone || !form.password) {
      Toast.show({ type: 'error', text1: 'Please fill in all required fields' }); return;
    }
    if (cleanPhone.length < 10) {
      Toast.show({ type: 'error', text1: 'Please enter a valid phone number' }); return;
    }
    if (form.password !== form.confirm) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' }); return;
    }
    if (form.password.length < 8) {
      Toast.show({ type: 'error', text1: 'Password must be at least 8 characters' }); return;
    }
    if (!agreeTerms) {
      Toast.show({ type: 'error', text1: 'Please agree to Terms & Conditions' }); return;
    }
    setLoading(true);
    try {
      await register({ ...form, phone: cleanPhone });
      Toast.show({ type: 'success', text1: 'Account created!' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: err.response?.data?.error || 'Try again later' });
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join GV Florida Transport</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput style={styles.input} value={form.first_name} onChangeText={v => update('first_name', v)} placeholder="Juan" />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput style={styles.input} value={form.last_name} onChangeText={v => update('last_name', v)} placeholder="Dela Cruz" />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput style={styles.input} value={form.phone} onChangeText={v => update('phone', formatPhone(v))} placeholder="09XX-XXX-XXXX" keyboardType="phone-pad" maxLength={13} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput style={styles.input} value={form.email} onChangeText={v => update('email', v)} placeholder="juan@email.com" keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput style={styles.input} value={form.password} onChangeText={v => update('password', v)} placeholder="Min 8 characters" secureTextEntry />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput style={styles.input} value={form.confirm} onChangeText={v => update('confirm', v)} placeholder="Re-enter password" secureTextEntry />
          </View>

          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreeTerms(!agreeTerms)}>
            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
              {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink} onPress={() => navigation.navigate('Terms')}>Terms & Conditions</Text> and <Text style={styles.termsLink} onPress={() => navigation.navigate('Privacy')}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.registerBtn, !agreeTerms && styles.registerBtnDisabled]} onPress={handleRegister} disabled={loading || !agreeTerms}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Create Account</Text>}
          </TouchableOpacity>
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D90045' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 4 },
  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, fontSize: 15, backgroundColor: '#f8f9fa' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#D90045', borderColor: '#D90045' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  termsText: { flex: 1, fontSize: 13, color: '#666' },
  termsLink: { color: '#D90045', fontWeight: '600' },
  registerBtn: { backgroundColor: '#D90045', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  registerBtnDisabled: { opacity: 0.5 },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { color: '#666' },
  loginLink: { color: '#D90045', fontWeight: '700' },
});
