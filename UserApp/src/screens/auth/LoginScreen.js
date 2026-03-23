import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const formatPhone = (text) => {
    const digits = text.replace(/[^0-9]/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return digits.slice(0, 4) + '-' + digits.slice(4);
    return digits.slice(0, 4) + '-' + digits.slice(4, 7) + '-' + digits.slice(7, 11);
  };

  const handleLogin = async () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || !password) { Toast.show({ type: 'error', text1: 'Please fill in all fields' }); return; }
    if (cleanPhone.length < 10) { Toast.show({ type: 'error', text1: 'Please enter a valid phone number' }); return; }
    setLoading(true);
    try {
      await login(cleanPhone, password);
      Toast.show({ type: 'success', text1: 'Welcome back!' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: err.response?.data?.error || 'Invalid credentials' });
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logo}><Text style={styles.logoText}>GV</Text></View>
          <Text style={styles.title}>GV Florida Transport</Text>
          <Text style={styles.subtitle}>Book your trip with ease</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign In</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={t => setPhone(formatPhone(t))} placeholder="09XX-XXX-XXXX" keyboardType="phone-pad" maxLength={13} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput style={[styles.input, { flex: 1 }]} value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showBtn}>
                <Text style={styles.showBtnText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Sign In</Text>}
          </TouchableOpacity>
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
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
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#D90045' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  formTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#f8f9fa' },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  showBtn: { position: 'absolute', right: 14, padding: 4 },
  showBtnText: { color: '#D90045', fontWeight: '600', fontSize: 13 },
  loginBtn: { backgroundColor: '#D90045', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: '#666' },
  registerLink: { color: '#D90045', fontWeight: '700' },
});
