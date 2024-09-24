import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type AppointmentDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AppointmentDetail'>;
type AppointmentDetailScreenRouteProp = RouteProp<RootStackParamList, 'AppointmentDetail'>;

type Props = {
  navigation: AppointmentDetailScreenNavigationProp;
  route: AppointmentDetailScreenRouteProp;
};

const AppointmentDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { appointment } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Agendamento</Text>
      <Text style={styles.info}>Título: {appointment.title}</Text>
      <Text style={styles.info}>Data: {appointment.date}</Text>
      <Text style={styles.info}>Categoria: {appointment.category}</Text>
      <Text style={styles.info}>Status: {appointment.status}</Text>

      {/* Botão para voltar */}
      <Button title='Voltar' onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default AppointmentDetailScreen;
