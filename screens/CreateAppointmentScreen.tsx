import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import api from '../services/api'; // Importa o serviço de API

const CreateAppointmentScreen: React.FC = () => {
  const [treatmentsList, setTreatmentsList] = useState<{ id: string; name: string; description: string; price: string }[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTreatments, setLoadingTreatments] = useState<boolean>(true);

  // Função para buscar tratamentos da API
  const fetchTreatments = async () => {
    try {
      const response = await api.get('/treatment');
      // Supondo que response.data seja um array de tratamentos
      setTreatmentsList(response.data);
      if (response.data.length > 0) {
        setSelectedTreatment(response.data[0].id); // Define o primeiro tratamento como selecionado por padrão
      }
    } catch (error) {
      console.error('Erro ao buscar tratamentos:', error);
      Alert.alert('Erro', 'Falha ao carregar tratamentos');
    } finally {
      setLoadingTreatments(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      // Combinar a data e a hora selecionadas
      const combinedDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), 0, 0);
      const data = {
        treatmentId: selectedTreatment,
        date: combinedDateTime.toISOString(),
      };
      await api.post('/appointment', data);
      Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
      // Opcional: Navegar de volta ou limpar o formulário
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      Alert.alert('Erro', 'Falha ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange: handleDateChange,
        mode: 'date',
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const openTimePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: time,
        onChange: handleTimeChange,
        mode: 'time',
        is24Hour: true,
      });
    } else {
      setShowTimePicker(true);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setTime(selectedTime);
    }
    if (Platform.OS === 'ios') {
      setShowTimePicker(false);
    }
  };

  if (loadingTreatments) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#000' />
        <Text>Carregando tratamentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Agendamento</Text>

      {/* Lista de Tratamentos com rolagem */}
      <Text style={styles.label}>Selecione o Tratamento</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedTreatment} style={styles.picker} onValueChange={(itemValue) => setSelectedTreatment(itemValue)}>
          {treatmentsList.map((treatment) => (
            <Picker.Item key={treatment.id} label={treatment.name} value={treatment.id} />
          ))}
        </Picker>
      </View>

      {/* Selecionar Data */}
      <Text style={styles.label}>Data do Agendamento</Text>
      <TouchableOpacity onPress={openDatePicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {/* DatePicker para iOS */}
      {showDatePicker && <DateTimePicker value={date} mode='date' display='spinner' onChange={handleDateChange} />}

      {/* Selecionar Hora */}
      <Text style={styles.label}>Hora do Agendamento</Text>
      <TouchableOpacity onPress={openTimePicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>

      {/* TimePicker para iOS */}
      {showTimePicker && <DateTimePicker value={time} mode='time' display='spinner' onChange={handleTimeChange} is24Hour={true} />}

      <TouchableOpacity style={styles.createAppointmentButton} onPress={handleCreateAppointment} disabled={loading}>
        <Text style={styles.createAppointmentText}>{loading ? 'Criando...' : 'Criar Agendamento'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos permanecem os mesmos
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dateButton: {
    height: 50,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 16,
  },
  createAppointmentButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  createAppointmentText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CreateAppointmentScreen;
