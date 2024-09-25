import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';
import { Picker } from '@react-native-picker/picker';

type AdminEditEquipmentScreenRouteProp = RouteProp<RootStackParamList, 'AdminEditEquipment'>;
type AdminEditEquipmentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminEditEquipment'>;

type Props = {
  route: AdminEditEquipmentScreenRouteProp;
  navigation: AdminEditEquipmentScreenNavigationProp;
};

type Equipment = {
  id: string;
  name: string;
  description: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const AdminEditEquipmentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { equipment: initialEquipment } = route.params; // Recebe o objeto equipment como parâmetro
  const [equipment, setEquipment] = useState<Equipment>(initialEquipment);
  const [updating, setUpdating] = useState(false);

  const handleSave = async () => {
    setUpdating(true);
    try {
      await api.patch(`/equipment/${equipment.id}`, equipment); // Atualiza o equipamento
      console.log(equipment);
      Alert.alert('Sucesso', 'Equipamento atualizado com sucesso!');
      navigation.goBack(); // Volta para a tela anterior após o sucesso
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao atualizar o equipamento.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={equipment.name} onChangeText={(text) => setEquipment({ ...equipment, name: text })} />

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={equipment.description} onChangeText={(text) => setEquipment({ ...equipment, description: text })} />

      <Text style={styles.label}>Status</Text>
      <Picker selectedValue={equipment.status} onValueChange={(itemValue) => setEquipment({ ...equipment, status: itemValue })} style={styles.picker}>
        <Picker.Item label='Disponível' value='available' />
        <Picker.Item label='Em manutenção' value='maintenance' />
      </Picker>

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
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminEditEquipmentScreen;
