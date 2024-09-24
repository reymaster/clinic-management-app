import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import DefaultAppBar from '../components/DefaultAppBar';
import api from '../services/api';
import AppointmentListUser from '../components/AppointmentListUser';
import { MaterialIcons } from '@expo/vector-icons';
import AppointmentListAdmin from '../components/AppointmentListAdmin';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { userInfo } from '../utils/user';
import Icon from 'react-native-vector-icons/AntDesign';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

type Appointment = {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'canceled';
  client: {
    name: string;
    phone: string;
    email: string;
  };
  treatment: {
    name: string;
    description: string;
    price: string;
    duration: number;
    categories: {
      id: string;
      name: string;
    }[];
  };
};

const Tab = createMaterialTopTabNavigator();

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Usuário');
  const [userAvatar, setUserAvatar] = useState<string>('https://www.gravatar.com/avatar/');
  const [greeting, setGreeting] = useState<string>('Olá,');

  const isFocused = useIsFocused();

  const getUserInfo = async () => {
    const selectGreetings = (hour: number) => {
      if (hour >= 0 && hour < 12) {
        return 'Bom dia';
      } else if (hour >= 12 && hour < 18) {
        return 'Boa tarde';
      } else {
        return 'Boa noite';
      }
    };

    setGreeting(selectGreetings(new Date().getHours()));

    try {
      const user = await userInfo();
      setUserRole(user.role);
      setUserName(user.name);
      setUserAvatar(user.avatarUrl);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar informações');
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/appointment');
      setAppointments(response.data);
    } catch (error) {
      console.log(error);
      setError(true);
      Alert.alert('Erro', 'Falha ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAppointments();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar agendamentos');
    } finally {
      setRefreshing(false);
    }
  };

  const confirmAppointment = async (id: string) => {
    try {
      await api.patch(`/appointment/${id}`, { status: 'confirmed' });
      fetchAppointments();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao confirmar agendamento');
    }
  };

  const editAppointment = (item: Appointment) => {
    navigation.navigate('EditAppointment', { appointment: item });
  };

  const cancelAppointment = async (id: string) => {
    try {
      await api.patch(`/appointment/${id}`, { status: 'canceled' });
      fetchAppointments();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao cancelar agendamento');
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await api.delete(`/appointment/${id}`);
      fetchAppointments();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao excluir agendamento');
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchAppointments();
    }
    getUserInfo();
  }, [isFocused]);

  const confirmedAppointments = appointments.filter((item) => item.status === 'confirmed');
  const pendingAppointments = appointments.filter((item) => item.status === 'pending');
  const canceledAppointments = appointments.filter((item) => item.status === 'canceled');

  const renderAppointment = ({ item }: { item: Appointment }) => {
    return userRole === 'admin' ? (
      <AppointmentListAdmin appointment={item} onConfirm={confirmAppointment} onEdit={editAppointment} onCancel={cancelAppointment} onDelete={deleteAppointment} />
    ) : (
      <AppointmentListUser appointment={item} />
    );
  };

  // Componentes das abas
  const ConfirmedAppointmentsTab = () => (
    <View style={styles.tabContainer}>
      {loading ? (
        <ActivityIndicator size='large' color='#000' />
      ) : error ? (
        <Text style={styles.errorText}>Erro ao carregar agendamentos. Tente novamente mais tarde.</Text>
      ) : confirmedAppointments.length === 0 ? (
        <>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name='infocirlceo' size={70} />
            <Text style={{ textAlign: 'center', paddingVertical: 30, fontSize: 24, fontWeight: 300 }}>
              Você não possui nenhum agendamento confirmado. Verifique seus agendamentos pendentes na guia "PENDENTES" ou agende um novo tratamento tocando no botão "+" na parte inferior da tela.
            </Text>
          </View>
        </>
      ) : (
        <FlatList
          data={confirmedAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointment}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );

  const PendingAppointmentsTab = () => (
    <View style={styles.tabContainer}>
      {loading ? (
        <ActivityIndicator size='large' color='#000' />
      ) : error ? (
        <Text style={styles.errorText}>Erro ao carregar agendamentos. Tente novamente mais tarde.</Text>
      ) : pendingAppointments.length === 0 ? (
        <Text style={styles.noAppointmentsText}>Nenhum agendamento pendente</Text>
      ) : (
        <FlatList
          data={pendingAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointment}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );

  const CanceledAppointmentsTab = () => (
    <View style={styles.tabContainer}>
      {loading ? (
        <ActivityIndicator size='large' color='#000' />
      ) : error ? (
        <Text style={styles.errorText}>Erro ao carregar agendamentos. Tente novamente mais tarde.</Text>
      ) : canceledAppointments.length === 0 ? (
        <Text style={styles.noAppointmentsText}>Nenhum agendamento cancelado</Text>
      ) : (
        <FlatList
          data={canceledAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointment}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />

      {/* AppBar */}
      <DefaultAppBar user={{ name: userName!, greeting }} avatarUrl={userAvatar} navigation={navigation} />

      {/* Tab Navigator */}
      <Tab.Navigator>
        <Tab.Screen name='Confirmados' component={ConfirmedAppointmentsTab} />
        <Tab.Screen name='Pendentes' component={PendingAppointmentsTab} />
        <Tab.Screen name='Cancelados' component={CanceledAppointmentsTab} />
      </Tab.Navigator>

      {/* Botão FAB de Novo Agendamento */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateAppointment')}>
        <MaterialIcons name='add' size={28} color='#fff' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flex: 1,
    padding: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default DashboardScreen;
