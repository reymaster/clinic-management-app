import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Swipeable } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons'; // Para o rating com estrelas
import api from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useFocusEffect } from '@react-navigation/native';

type NotificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feedback'>;

type Props = {
  navigation: NotificationScreenNavigationProp;
};

interface Feedback {
  id: number;
  rating: number; // Avaliação de 1 a 5 estrelas
  comment: string;
  readed: boolean;
  client: { id: number; name: string; email: string; avatarUrl: string };
  treatment: {
    id: number;
    name: string;
  };
  createdAt: Date;
}

const Tab = createMaterialTopTabNavigator();

// Componente de avaliação com estrelas
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<FontAwesome key={i} name={i <= rating ? 'star' : 'star-o'} size={20} color='#FFD700' style={{ marginRight: 5 }} />);
  }
  return <View style={styles.starContainer}>{stars}</View>;
};

// Componente para exibir o feedback
const FeedbackItem = ({ feedback, onDelete, onRead }: any) => {
  return (
    <Swipeable
      renderRightActions={() => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(feedback)}>
            <FontAwesome name='trash' size={24} color='#fff' />
          </TouchableOpacity>

          <TouchableOpacity style={styles.readButton} onPress={() => onRead(feedback)}>
            {feedback.readed === true ? <FontAwesome name='eye-slash' size={24} color='#fff' /> : <FontAwesome name='eye' size={24} color='#fff' />}
          </TouchableOpacity>
        </View>
      )}
    >
      <View style={styles.feedbackItem}>
        <Image source={{ uri: feedback.client.avatarUrl }} style={styles.avatar} />
        <View style={styles.feedbackInfo}>
          <Text style={styles.clientName}>{feedback.client.name}</Text>
          <Text style={styles.clientEmail}>{feedback.client.email}</Text>
          <StarRating rating={feedback.rating} />
          <Text style={styles.comment}>{feedback.comment}</Text>
          <Text style={styles.treatmentName}>{feedback.treatment.name}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

// Função para marcar o feedback como lido
const markAsReaded = async (feedback: any) => {
  try {
    await api.patch(`/feedback/${feedback.id}`, { readed: !feedback.readed });
  } catch (error) {
    console.error('Erro ao marcar feedback como lido:', error);
    Alert.alert('Erro', 'Falha ao marcar feedback como lido.');
  }
};

// Função para buscar feedbacks de uma categoria (novos ou lidos)
const fetchFeedbacks = async (endpoint: string) => {
  try {
    const response = await api.get(`/feedback/${endpoint}`);

    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar feedbacks de ${endpoint}:`, error);
    Alert.alert('Erro', 'Falha ao carregar feedbacks.');
    return [];
  }
};

// Tela para listar feedbacks
const FeedbackListScreen = ({ route, navigation }: any) => {
  const [feedbacks, setFeedbacks] = useState([]);

  const loadFeedbacks = async () => {
    const endpoint = route.name === 'Novos' ? 'unreaded' : 'readed'; // Diferenciar entre "Novos" e "Lidos"
    const data = await fetchFeedbacks(endpoint);
    setFeedbacks(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFeedbacks(); // Atualiza os feedbacks toda vez que a aba é focada
    }, [route.name])
  );

  const handleEdit = (feedback: any) => {
    Alert.alert('Excluir comentário', 'Deseja excluir este comentário?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/feedback/${feedback.id}`);
            const data = feedbacks.filter((item: any) => item.id !== feedback.id);
            setFeedbacks(data);
          } catch (error) {
            console.error('Erro ao excluir feedback:', error);
            Alert.alert('Erro', 'Falha ao excluir feedback.');
          }
        },
      },
    ]);
  };

  const handleRead = (feedback: any) => {
    const modalTitle = feedback.readed === true ? 'Marcar como não lido' : 'Marcar como lido';
    const modalMessage = feedback.readed === true ? 'Deseja marcar este comentário como não lido?' : 'Deseja marcar este comentário como lido?';

    Alert.alert(modalTitle, modalMessage, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Marcar',
        style: 'destructive',
        onPress: async () => {
          await markAsReaded(feedback);
          const data = feedbacks.filter((item: any) => item.id !== feedback.id);
          setFeedbacks(data);
        },
      },
    ]);
  };

  return (
    <View style={styles.feedbackList}>
      {feedbacks.length > 0 ? (
        <FlatList
          data={feedbacks}
          keyExtractor={(item: Feedback) => item.id.toString()}
          renderItem={({ item }) => <FeedbackItem feedback={item} onDelete={handleEdit} onRead={handleRead} />}
          contentContainerStyle={styles.feedbackList}
        />
      ) : (
        <Text style={{ textAlign: 'center', paddingVertical: 30, fontSize: 24, fontWeight: 300 }}>Não há comentários para exibir</Text>
      )}
    </View>
  );
};

// Navegação por abas (Novos e Lidos)
const FeedbackScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Novos' component={FeedbackListScreen} />
      <Tab.Screen name='Lidos' component={FeedbackListScreen} />
    </Tab.Navigator>
  );
};

// Estilos
const styles = StyleSheet.create({
  feedbackItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  feedbackInfo: {
    flex: 1,
  },
  clientName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  clientEmail: {
    color: '#777',
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  comment: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  treatmentName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  feedbackList: {
    paddingHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  readButton: {
    backgroundColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  readButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancel: {
    color: 'grey',
    fontSize: 16,
  },
  destructive: {
    color: 'red',
    fontSize: 16,
  },
});

export default FeedbackScreen;
