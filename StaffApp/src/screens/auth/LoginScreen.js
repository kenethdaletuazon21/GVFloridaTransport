import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userId || !password) { Toast.show({ type: 'error', text1: 'Please fill all fields' }); return; }
    setLoading(true);
    try {
      await login(userId.trim().toUpperCase(), password);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: err.response?.data?.message || err.message || 'Invalid credentials' });
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Icon name="truck" size={48} color="#fff" />
        <Text style={styles.title}>GV Florida</Text>
        <Text style={styles.subtitle}>Driver / Conductor Portal</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Staff Login</Text>
        <View style={styles.inputWrap}>
          <Icon name="hash" size={18} color="#888" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="User ID (e.g. GVF-D001)" placeholderTextColor="#aaa" value={userId} onChangeText={setUserId} autoCapitalize="characters" />
        </View>
        <View style={styles.inputWrap}>
          <Icon name="lock" size={18} color="#888" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}><Icon name={showPass ? 'eye-off' : 'eye'} size={18} color="#888" /></TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.loginBtn, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Sign In</Text>}
        </TouchableOpacity>
        <Text style={styles.hint}>Enter the unique User ID assigned by your admin</Text>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D90045' },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  form: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, paddingTop: 32 },
  formTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 24, textAlign: 'center' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f6fa', borderRadius: 14, marginBottom: 14, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 16, fontSize: 15, color: '#333' },
  eyeBtn: { padding: 8 },
  loginBtn: { backgroundColor: '#D90045', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  hint: { textAlign: 'center', fontSize: 13, color: '#888', marginTop: 16 },
});
