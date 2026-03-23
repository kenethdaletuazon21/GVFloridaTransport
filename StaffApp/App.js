import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Icon from 'react-native-vector-icons/Feather';

import LoginScreen from './src/screens/auth/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TripManagementScreen from './src/screens/TripManagementScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';
import PassengerListScreen from './src/screens/PassengerListScreen';
import ScanTicketScreen from './src/screens/ScanTicketScreen';
import IncidentReportScreen from './src/screens/IncidentReportScreen';
import ShiftLogScreen from './src/screens/ShiftLogScreen';
import GeoTagScreen from './src/screens/GeoTagScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = { Dashboard: 'home', Trips: 'navigation', Scanner: 'camera', Shifts: 'clock', Profile: 'user' };
          return <Icon name={icons[route.name] || 'circle'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D90045',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Trips" component={TripManagementScreen} />
      <Tab.Screen name="Scanner" component={ScanTicketScreen} />
      <Tab.Screen name="Shifts" component={ShiftLogScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#D90045' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '600' } }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="TripDetail" component={TripDetailScreen} options={{ title: 'Trip Details' }} />
          <Stack.Screen name="PassengerList" component={PassengerListScreen} options={{ title: 'Passenger Manifest' }} />
          <Stack.Screen name="IncidentReport" component={IncidentReportScreen} options={{ title: 'Report Incident' }} />
          <Stack.Screen name="GeoTag" component={GeoTagScreen} options={{ title: 'Location Check-in' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
