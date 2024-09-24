import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { userInfo } from '../utils/user';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userAvatar, setUserAvatar] = useState<string>('https://www.gravatar.com/avatar/');
  const [userName, setUserName] = useState<string>('Usuário');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Função para pegar informações do usuário
  const getUserInfo = async () => {
    try {
      const user = await userInfo();
      setUserRole(user.role);
      setUserName(user.name);
      setUserAvatar(user.avatarUrl);
      setUserEmail(user.email);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar informações');
    }
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userName');

      navigation.navigate('Login' as never);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer logout.');
    }
  };

  useEffect(() => {
    getUserInfo();
  });

  return (
    <View style={styles.container}>
      {/* Parte superior com o fundo e a imagem do usuário */}
      <View style={styles.header}>
        <Text style={styles.headerText}></Text>
      </View>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: userAvatar }} // URL da imagem do usuário
          style={styles.avatar}
        />
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
      </View>

      {/* Menu de opções */}
      <View style={styles.menuContainer}>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>{userName}</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>{userEmail}</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Permissão: {userRole === 'admin' ? 'Administrador' : 'Usuário'}</Text>
        </View>
      </View>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#000',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
  menuContainer: {
    marginTop: 30,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
