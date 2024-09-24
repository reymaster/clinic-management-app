import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const AppointmentListScreen: React.FC = () => {
  // Simulação de uma lista de agendamentos
  const appointments = [
    { id: '1', title: 'Consulta Dermatológica' },
    { id: '2', title: 'Tratamento de Pele' },
    { id: '3', title: 'Consulta de Revisão' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos os Agendamentos</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  appointmentItem: {
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default AppointmentListScreen;
