import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons'; // Ícone de edição
import api from '../services/api'; // Importando a API
import { useIsFocused } from '@react-navigation/native'; // Hook para detectar se a tela está focada

type Equipment = {
  id: string;
  name: string;
  description: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const AdminEquipmentScreen = ({ navigation }: any) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filterText, setFilterText] = useState<string>(''); // Filtro para buscar equipamentos
  const isFocused = useIsFocused(); // Detecta se a tela está em foco

  const fetchEquipments = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/equipment'); // Buscando os equipamentos
      setEquipments(response.data);
    } catch (error) {
      setError(true);
      Alert.alert('Erro', 'Falha ao carregar equipamentos.');
    } finally {
      setLoading(false);
    }
  };

  // Atualiza a lista sempre que a tela estiver em foco
  useEffect(() => {
    if (isFocused) {
      fetchEquipments(); // Atualiza a lista ao voltar da tela de edição
    }
  }, [isFocused]);

  // Função para renderizar o botão de editar ao arrastar para a esquerda
  const renderRightActions = (item: Equipment) => {
    return (
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('AdminEditEquipment', { equipment: item })} // Navegação para a tela de edição
      >
        <FontAwesome name='edit' size={24} color='#fff' />
      </TouchableOpacity>
    );
  };

  // Filtrar equipamentos
  const filteredEquipments = equipments.filter((equipment) => equipment.name.toLowerCase().includes(filterText.toLowerCase()));

  const renderItem = ({ item }: { item: Equipment }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.equipmentItem}>
        <Text style={styles.equipmentName}>{item.name}</Text>
        <Text style={styles.equipmentDescription}>{item.description}</Text>
        <Text>Status: {item.status === 'available' ? 'Disponível' : 'Em manutenção'}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchBar} placeholder='Filtrar equipamentos' value={filterText} onChangeText={setFilterText} />

      {loading ? (
        <ActivityIndicator size='large' color='#000' />
      ) : error ? (
        <Text style={styles.errorText}>Erro ao carregar equipamentos. Tente novamente mais tarde.</Text>
      ) : (
        <FlatList data={filteredEquipments} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchBar: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  equipmentItem: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  equipmentDescription: {
    fontSize: 14,
    color: '#777',
  },
  editButton: {
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AdminEquipmentScreen;
