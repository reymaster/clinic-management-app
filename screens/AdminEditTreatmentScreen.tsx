import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type AdminEditTreatmentScreenRouteProp = RouteProp<RootStackParamList, 'AdminEditTreatment'>;
type AdminEditTreatmentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminEditTreatment'>;

type Props = {
  route: AdminEditTreatmentScreenRouteProp;
  navigation: AdminEditTreatmentScreenNavigationProp;
};

type Treatment = {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: number;
};

const AdminEditTreatmentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { treatment } = route.params; // Recebe o objeto treatment como parâmetro

  const [name, setName] = useState(treatment.name);
  const [description, setDescription] = useState(treatment.description);
  const [price, setPrice] = useState(treatment.price);
  const [duration, setDuration] = useState(treatment.duration.toString());
  const [updating, setUpdating] = useState(false);

  const handleSave = async () => {
    if (!name || !description || !price || !duration) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setUpdating(true);

    try {
      const updatedTreatment = {
        ...treatment,
        name,
        description,
        price,
        duration: parseInt(duration, 10),
      };

      await api.patch(`/treatment/${treatment.id}`, updatedTreatment); // Atualiza o tratamento na API
      console.log(updatedTreatment);
      Alert.alert('Sucesso', 'Tratamento atualizado com sucesso!');
      navigation.goBack(); // Volta para a tela anterior
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar o tratamento.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Tratamento</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.textArea} value={description} onChangeText={setDescription} multiline numberOfLines={4} />

      <Text style={styles.label}>Preço (R$)</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType='numeric' />

      <Text style={styles.label}>Duração (minutos)</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType='numeric' />

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
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default AdminEditTreatmentScreen;
