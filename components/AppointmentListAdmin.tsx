import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/AntDesign';

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

type Props = {
  appointment: Appointment;
  onConfirm: (id: string) => void;
  onEdit: (item: Appointment) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
};

const AppointmentListAdmin: React.FC<Props> = ({ appointment, onConfirm, onEdit, onCancel, onDelete }) => {
  // Função para renderizar os botões de ação de acordo com o status do agendamento
  const renderActions = () => {
    if (appointment.status === 'pending') {
      return (
        <>
          <TouchableOpacity style={styles.confirmedButton} onPress={() => onConfirm(appointment.id)}>
            <Text style={styles.confirmedButtonText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(appointment)}>
            <Text style={styles.editButtonText}>Alterar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.canceledButton} onPress={() => onCancel(appointment.id)}>
            <Text style={styles.canceledButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      );
    } else if (appointment.status === 'confirmed') {
      return (
        <>
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(appointment)}>
            <Text style={styles.editButtonText}>Alterar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.canceledButton} onPress={() => onCancel(appointment.id)}>
            <Text style={styles.canceledButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      );
    } else if (appointment.status === 'canceled') {
      return (
        <>
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(appointment)}>
            <Text style={styles.editButtonText}>Alterar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(appointment.id)}>
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  return (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentTitle}>{appointment.treatment.name}</Text>
        <Text style={styles.clientInfo}>Cliente: {appointment.client.name}</Text>
        <Text style={styles.clientInfo}>Telefone: {appointment.client.phone}</Text>
      </View>
      <View style={styles.appointmentFooter}>
        <Text>{format(new Date(appointment.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</Text>
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

      {/* Botões de ação do admin */}
      <View style={styles.adminActions}>{renderActions()}</View>
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
  clientInfo: {
    fontSize: 14,
    color: '#555',
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmedText: {
    marginLeft: 5,
    color: 'green',
    fontWeight: 'bold',
  },
  pendingText: {
    marginLeft: 5,
    color: 'red',
    fontWeight: 'bold',
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  adminButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmedButton: {
    borderWidth: 1,
    borderColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  confirmedButtonText: {
    color: 'green',
    fontWeight: 'bold',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  editButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: 'red',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  canceledButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  canceledButtonText: {
    color: 'grey',
    fontWeight: 'bold',
  },
  canceledText: {
    marginLeft: 5,
    color: 'grey',
    fontWeight: 'bold',
  },
});

export default AppointmentListAdmin;
