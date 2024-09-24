import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';
import { formatPriceBR } from '../utils/number';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

type EditAppointmentScreenRouteProp = RouteProp<RootStackParamList, 'EditAppointment'>;
type EditAppointmentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditAppointment'>;

type Props = {
  route: EditAppointmentScreenRouteProp;
  navigation: EditAppointmentScreenNavigationProp;
};

type Appointment = {
  id: string;
  date: string;
  status: string;
  treatment: {
    name: string;
    description: string;
    price: string;
    duration: number;
  };
};

const EditAppointmentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { appointment: initialAppointment } = route.params; // Recebe o objeto appointment como parâmetro
  const [appointment, setAppointment] = useState<Appointment>(initialAppointment);
  const [updating, setUpdating] = useState(false);
  const [showPicker, setShowPicker] = useState(false); // Controla a exibição do DateTimePicker
  const [mode, setMode] = useState<'date' | 'time'>('date'); // Define o modo (data ou hora)
  const [date, setDate] = useState(new Date(appointment.date)); // Converte a data de string para Date
  const [status, setStatus] = useState<string | null>(null); // Estado inicial do status

  const handleSave = async () => {
    setUpdating(true);
    try {
      await api.patch(`/appointment/${appointment.id}`, { date: date.toISOString(), status }); // Atualiza o agendamento com a data modificada
      console.log(date.toISOString(), status);
      Alert.alert('Sucesso', 'Agendamento atualizado com sucesso!');
      navigation.goBack(); // Volta para a tela anterior após o sucesso
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar o agendamento.');
    } finally {
      setUpdating(false);
    }
  };

  const showDateTimePicker = (currentMode: 'date' | 'time') => {
    setMode(currentMode); // Define se o picker será para data ou hora
    setShowPicker(true); // Exibe o picker
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (mode === 'date') {
        const currentDate = new Date(date); // Mantém a hora atual ao alterar a data
        currentDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        setDate(currentDate);
      } else if (mode === 'time') {
        const currentDate = new Date(date); // Mantém a data atual ao alterar a hora
        currentDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
        setDate(currentDate);
      }
    }

    // Fecha o picker após a seleção
    if (Platform.OS === 'android') {
      setShowPicker(false); // Garante que o picker será fechado corretamente no Android
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appointmentName}>{appointment.treatment.name}</Text>
      <Text style={styles.appointmentDesc}>{appointment.treatment.description}</Text>
      <Text style={styles.label}>Preço: {formatPriceBR(+appointment.treatment.price)}</Text>
      <Text style={styles.label}>Duração média: {appointment.treatment.duration.toString()} minuto(s)</Text>

      <Text></Text>

      <Text style={styles.label}>Alterar data</Text>
      <TouchableOpacity onPress={() => showDateTimePicker('date')} style={styles.input}>
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Alterar hora</Text>
      <TouchableOpacity onPress={() => showDateTimePicker('time')} style={styles.input}>
        <Text>{date.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      <View style={styles.input}>
        <Picker selectedValue={status === null ? appointment.status : status} onValueChange={(itemValue) => setStatus(itemValue)}>
          <Picker.Item label='Pendente' value='pending' />
          <Picker.Item label='Confirmado' value='confirmed' />
          <Picker.Item label='Cancelado' value='canceled' />
        </Picker>
      </View>

      {/* Exibe o picker se showPicker estiver true */}
      {showPicker && (
        <DateTimePicker
          value={date}
          mode={mode} // Define o modo como 'date' ou 'time'
          is24Hour={true}
          display='default'
          onChange={onDateChange}
        />
      )}

      <Button title='Salvar' onPress={handleSave} disabled={updating} />

      {updating && (
        <View style={styles.loading}>
          <ActivityIndicator size='small' color='#000' />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appointmentDesc: {
    color: '#777',
    marginBottom: 15,
  },
});

export default EditAppointmentScreen;
