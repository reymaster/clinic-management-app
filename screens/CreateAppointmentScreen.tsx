import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../services/api'; // Assuma que a API está configurada
import { Picker } from '@react-native-picker/picker';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatPriceBR } from '../utils/number';

type CreateAppointmentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateAppointment'>;

type Props = {
  navigation: CreateAppointmentScreenNavigationProp;
};

// Definindo os tipos
interface Treatment {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TreatmentCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  treatments: Treatment[];
}

interface TreatmentGroup {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  categories: TreatmentCategory[];
}

const CreateAppointmentScreen: React.FC<Props> = ({ navigation }) => {
  const [treatmentGroups, setTreatmentGroups] = useState<TreatmentGroup[]>([]); // Lista de grupos com tipagem correta
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);
  const [userId, setUserId] = useState<number>();

  const [filteredCategories, setFilteredCategories] = useState<TreatmentCategory[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);

  const [loading, setLoading] = useState(false);

  // Estado para os campos de data e hora
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Função para buscar o ID do usuário
  const getUserId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    setUserId(Number(userId));
  };

  // Função para buscar os dados da API
  const fetchTreatmentGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get<TreatmentGroup[]>('/treatment-group');
      setTreatmentGroups(response.data);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      await api.post(`/appointment/`, { clientId: userId, treatmentId: selectedTreatment, date: selectedDate.toISOString(), status: 'pending' }); // Atualiza o agendamento com a data modificada
      Alert.alert('Sucesso', 'Agendamento cadastrado com sucesso!');
      navigation.goBack(); // Volta para a tela anterior após o sucesso
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar o agendamento.');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    getUserId();
    fetchTreatmentGroups();
  }, []);

  // Atualiza as categorias quando um grupo de tratamento é selecionado
  const handleGroupChange = (groupId: number | null) => {
    setSelectedGroup(groupId);
    const group = treatmentGroups.find((group) => group.id === groupId);
    if (group) {
      setFilteredCategories(group.categories);
      setSelectedCategory(null); // Limpa a seleção de categoria ao mudar o grupo
      setFilteredTreatments([]); // Limpa a lista de tratamentos ao mudar o grupo
    }
  };

  // Atualiza os tratamentos quando uma categoria é selecionada
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const category = filteredCategories.find((category) => category.id === categoryId);
    if (category) {
      setFilteredTreatments(category.treatments);
      setSelectedTreatment(null); // Limpa a seleção de tratamento ao mudar a categoria
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setShowDatePicker(false);
      setSelectedDate(selectedDate);
    }
  };

  // Manipula a mudança de hora
  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      setShowTimePicker(false);
      const currentDate = new Date(selectedDate);
      currentDate.setHours(selectedTime.getHours());
      currentDate.setMinutes(selectedTime.getMinutes());
      setSelectedDate(currentDate);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    setShowTimePicker(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#000' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecione o Grupo de Tratamento</Text>
      <Picker selectedValue={selectedGroup} onValueChange={handleGroupChange} style={styles.picker}>
        <Picker.Item label='Selecione um grupo' value={null} />
        {treatmentGroups.map((group) => (
          <Picker.Item key={group.id} label={group.name} value={group.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Selecione a Categoria de Tratamento</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={handleCategoryChange}
        enabled={!!selectedGroup} // Desabilita se nenhum grupo for selecionado
        style={styles.picker}
      >
        <Picker.Item label='Selecione uma categoria' value={null} />
        {filteredCategories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Selecione o Tratamento</Text>
      <Picker
        selectedValue={selectedTreatment}
        onValueChange={(value) => setSelectedTreatment(value)}
        enabled={!!selectedCategory} // Desabilita se nenhuma categoria for selecionada
        style={styles.picker}
      >
        <Picker.Item label='Selecione um tratamento' value={null} />
        {filteredTreatments.map((treatment) => (
          <Picker.Item key={treatment.id} label={treatment.name} value={treatment.id} />
        ))}
      </Picker>

      {/* Campo de seleção de data */}
      <Text style={styles.label}>Selecione a Data do Agendamento</Text>
      <TouchableOpacity onPress={openDatePicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>{selectedDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {/* Campo de seleção de hora */}
      <Text style={styles.label}>Selecione a Hora do Agendamento</Text>
      <TouchableOpacity onPress={openTimePicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>{selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>

      {/* DateTimePicker para Data */}
      {showDatePicker && <DateTimePicker value={selectedDate} mode='date' display='default' onChange={handleDateChange} />}

      {/* DateTimePicker para Hora */}
      {showTimePicker && <DateTimePicker value={selectedDate} mode='time' display='default' onChange={handleTimeChange} is24Hour={true} />}

      {/* Imprimir o preço do tratamento selecionado */}
      {selectedTreatment && (
        <Text style={styles.label}>
          Valor a ser pago:{' '}
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'green' }}>{formatPriceBR(Number(filteredTreatments.find((treatment) => treatment.id === selectedTreatment)?.price || 0))}</Text>
        </Text>
      )}

      {/* Botão de salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>SOLICITAR AGENDAMENTO</Text>
      </TouchableOpacity>

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
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#ddd',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  saveButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateAppointmentScreen;
