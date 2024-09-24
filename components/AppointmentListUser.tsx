import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/AntDesign';
import { formatPriceBR } from '../utils/number';

type Appointment = {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'canceled';
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

type Props = {
  appointment: Appointment;
};

const AppointmentListUser: React.FC<Props> = ({ appointment }) => {
  const price = `${formatPriceBR(+appointment.treatment.price)}`;
  return (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentTitle}>{appointment.treatment.name}</Text>
        <Text style={styles.treatmentDescription}>
          {appointment.treatment.categories.map((category, index) => {
            return index === appointment.treatment.categories.length - 1 ? category.name : `${category.name}, `;
          })}
        </Text>
      </View>
      <View style={styles.appointmentFooter}>
        {/* Criar um container dividido em duas partes */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>Duração: {appointment.treatment.duration} minutos</Text>
            <Text>{format(new Date(appointment.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</Text>
            {appointment.status === 'confirmed' && <Text style={styles.confirmedText}>Pago {price}</Text>}
            {appointment.status === 'pending' && <Text style={styles.pendingText}>{price}</Text>}
            {appointment.status === 'canceled' && <Text style={styles.canceledText}></Text>}
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            {appointment.status === 'confirmed' && (
              <Text style={styles.confirmedText}>
                <Icon name='checkcircleo' size={20} /> Confirmado
              </Text>
            )}
            {appointment.status === 'pending' && (
              <Text style={styles.pendingText}>
                <Icon name='exclamationcircleo' size={20} /> Pendente
              </Text>
            )}
            {appointment.status === 'canceled' && (
              <Text style={styles.canceledText}>
                <Icon name='closecircleo' size={20} /> Cancelado
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appointmentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  appointmentHeader: {
    marginBottom: 10,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  treatmentDescription: {
    fontSize: 14,
    color: '#777',
  },
  appointmentFooter: {
    marginTop: 10, // Adiciona um espaçamento superior para separar visualmente do conteúdo anterior
  },
  confirmedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  pendingText: {
    color: 'red',
    fontWeight: 'bold',
  },
  canceledText: {
    color: 'grey',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AppointmentListUser;
