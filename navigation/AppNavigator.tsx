import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen';
import EditAppointmentScreen from '../screens/EditAppointmentScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AdminTreatmentScreen from '../screens/AdminTreatmentScreen';
import AdminEditTreatmentScreen from '../screens/AdminEditTreatmentScreen';
import AdminEditEquipmentScreen from '../screens/AdminEditEquipmentScreen';
import AdminEquipmentScreen from '../screens/AdminEquipmentScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';

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
  AdminTreatment: undefined;
  AdminEditTreatment: { treatment: any };
  AdminEquipment: { equipment: any };
  AdminEditEquipment: { equipment: any };
  Feedback: undefined;
  Lidos: undefined;
  Novos: undefined;
  ProfileEdit: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{ title: 'Registrar-se' }} />
        <Stack.Screen name='Dashboard' component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name='CreateAppointment' component={CreateAppointmentScreen} options={{ title: 'Novo Agendamento' }} />
        <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} options={{ title: 'Recuperar Senha' }} />
        <Stack.Screen name='Profile' component={ProfileScreen} options={{ title: 'Perfil' }} />
        <Stack.Screen name='Notification' component={NotificationScreen} options={{ title: 'Notificações' }} />
        <Stack.Screen name='AppointmentDetail' component={AppointmentDetailScreen} options={{ title: 'Detalhes do Agendamento' }} />
        <Stack.Screen name='EditAppointment' component={EditAppointmentScreen} options={{ title: 'Editar Agendamento' }} />
        <Stack.Screen name='AdminTreatment' component={AdminTreatmentScreen} options={{ title: 'Gestão de Tratamentos' }} />
        <Stack.Screen name='AdminEditTreatment' component={AdminEditTreatmentScreen} options={{ title: 'Editar Tratamento' }} />
        <Stack.Screen name='AdminEquipment' component={AdminEquipmentScreen} options={{ title: 'Gestão de Equipamentos' }} />
        <Stack.Screen name='AdminEditEquipment' component={AdminEditEquipmentScreen} options={{ title: 'Editar Equipamento' }} />
        <Stack.Screen name='Feedback' component={FeedbackScreen} options={{ title: 'Comentários' }} />
        <Stack.Screen name='ProfileEdit' component={ProfileEditScreen} options={{ title: 'Editar Perfil' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
