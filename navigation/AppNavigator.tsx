import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Importe a nova tela
import NotificationScreen from '../screens/NotificationScreen';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen';
import EditAppointmentScreen from '../screens/EditAppointmentScreen';
import DashboardScreen from '../screens/DashboardScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  CreateAppointment: undefined;
  ForgotPassword: undefined;
  Profile: undefined;
  Notification: undefined;
  AppointmentDetail: { appointment: any };
  EditAppointment: { appointment: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Dashboard' component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name='CreateAppointment' component={CreateAppointmentScreen} />
        <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
        <Stack.Screen name='Notification' component={NotificationScreen} />
        <Stack.Screen name='AppointmentDetail' component={AppointmentDetailScreen} />
        <Stack.Screen name='EditAppointment' component={EditAppointmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
