import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { userInfo } from '../utils/user'; // Função para buscar as informações do usuário
import api from '../services/api'; // Supondo que sua API esteja configurada aqui

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const [userAvatar, setUserAvatar] = useState<string>('https://www.gravatar.com/avatar/');
  const [userName, setUserName] = useState<string>('Usuário');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>(''); // Exemplo de campo de telefone
  const [userAddress, setUserAddress] = useState<string>(''); // Exemplo de campo de endereço
  const [userId, setUserId] = useState<number>();

  // Função para pegar informações do usuário
  const getUserInfo = async () => {
    try {
      const user = await userInfo();
      setUserName(user.name);
      setUserAvatar(user.avatarUrl);
      setUserEmail(user.email);
      setUserPhone(user.phone); // Supondo que exista o campo de telefone
      setUserAddress(user.address); // Supondo que exista o campo de endereço
      setUserId(user.id);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar informações');
    }
  };

  // Função para salvar as alterações do perfil
  const handleSaveProfile = async () => {
    try {
      // Enviar os dados atualizados para a API
      const updatedUser = {
        name: userName,
        email: userEmail,
        phone: userPhone, // Supondo que exista
        address: userAddress, // Supondo que exista
        avatarUrl: userAvatar,
      };
      await api.patch(`/user/${userId}`, updatedUser); // Envia as informações para a API
      const oldToken = await AsyncStorage.getItem('userToken'); // Busca o token do usuário
      const { data } = await api.post('/auth/renew-token', { token: oldToken }); // Renova o token do usuário

      await AsyncStorage.setItem('userToken', data.access_token); // Atualiza o token no AsyncStorage

      await AsyncStorage.setItem('userName', data.user.name); // Atualiza o nome no AsyncStorage

      setUserName(data.user.name);
      setUserAvatar(data.user.avatarUrl);
      setUserEmail(data.user.email);
      setUserPhone(data.user.phone); // Supondo que exista o campo de telefone
      setUserAddress(data.user.address); // Supondo que exista o campo de endereço

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
      navigation.goBack(); // Voltar para a tela anterior
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar perfil');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}></Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: userAvatar }} // URL da imagem do usuário
          style={styles.avatar}
        />
      </View>

      {/* Campos editáveis */}
      <View style={styles.formContainer}>
        <TextInput style={styles.input} value={userName} onChangeText={setUserName} placeholder='Nome' />
        <TextInput style={styles.input} value={userEmail} onChangeText={setUserEmail} placeholder='Email' keyboardType='email-address' />
        <TextInput style={styles.input} value={userPhone} onChangeText={setUserPhone} placeholder='Telefone' keyboardType='phone-pad' />
        <TextInput style={styles.input} value={userAddress} onChangeText={setUserAddress} placeholder='Endereço' />
      </View>

      {/* Botão de Salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
    marginTop: -100,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 200,
    borderWidth: 12,
    borderColor: '#fff',
  },
  formContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileEditScreen;
