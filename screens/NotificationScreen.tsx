import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NotificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Notification'>;

type Props = {
  navigation: NotificationScreenNavigationProp;
};

const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <Text style={styles.message}>Nenhuma notificação no momento.</Text>

      {/* Botão para voltar */}
      <Button title='Voltar' onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default NotificationScreen;
