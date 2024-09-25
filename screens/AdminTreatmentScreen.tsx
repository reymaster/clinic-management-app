import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { EvilIcons, FontAwesome } from '@expo/vector-icons'; // Ícone de edição
import api from '../services/api'; // Importando a API
import { useIsFocused } from '@react-navigation/native'; // Hook para detectar se a tela está focada

type Treatment = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: string;
  categories: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

const AdminTreatmentScreen = ({ navigation }: any) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filterText, setFilterText] = useState<string>(''); // Filtro para buscar tratamentos
  const isFocused = useIsFocused(); // Detecta se a tela está em foco

  const fetchTreatments = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/treatment'); // Buscando os tratamentos
      setTreatments(response.data);
    } catch (error) {
      setError(true);
      Alert.alert('Erro', 'Falha ao carregar tratamentos.');
    } finally {
      setLoading(false);
    }
  };

  // Atualiza a lista sempre que a tela estiver em foco
  useEffect(() => {
    if (isFocused) {
      fetchTreatments(); // Atualiza a lista ao voltar da tela de edição
    }
  }, [isFocused]);

  // Função para renderizar o botão de editar ao arrastar para a esquerda
  const renderRightActions = (item: Treatment) => {
    return (
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('AdminEditTreatment', { treatment: item })} // Navegação para a tela de edição
      >
        <FontAwesome name='edit' size={24} color='#fff' />
      </TouchableOpacity>
    );
  };

  // Filtrar tratamentos
  const filteredTreatments = treatments.filter((treatment) => treatment.name.toLowerCase().includes(filterText.toLowerCase()));

  const renderItem = ({ item }: { item: Treatment }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.treatmentItem}>
        <Text style={styles.treatmentName}>{item.name}</Text>
        <Text style={styles.treatmentDescription}>{item.description}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View>
        <TextInput style={styles.searchBar} placeholder='Filtrar tratamentos' value={filterText} onChangeText={setFilterText} />
        <EvilIcons style={styles.searchBarIcon} name='search' size={24} color='black' />
      </View>

      {loading ? (
        <ActivityIndicator size='large' color='#000' />
      ) : error ? (
        <Text style={styles.errorText}>Erro ao carregar tratamentos. Tente novamente mais tarde.</Text>
      ) : (
        <FlatList data={filteredTreatments} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} />
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
    paddingLeft: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  searchBarIcon: {
    position: 'absolute',
    top: 15,
    left: 20,
  },
  treatmentItem: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  treatmentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  treatmentDescription: {
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

export default AdminTreatmentScreen;
