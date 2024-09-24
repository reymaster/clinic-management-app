import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker'; // Biblioteca de upload de imagem
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); // URL da imagem
  const [image, setImage] = useState<any>(null); // Estado para a imagem selecionada

  // Função para abrir o seletor de imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Função para fazer o upload da imagem
  const uploadImage = async () => {
    if (!image) return null;

    let localUri = image;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename || '');
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('file', { uri: localUri, name: filename, type } as any);

    try {
      const response = await api.post('https://zazo.com.br/apps/upload.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.url; // Supondo que a API retorna a URL da imagem
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      Alert.alert('Erro', 'Falha ao fazer upload da imagem');
      return null;
    }
  };

  // Função para registrar o usuário na API
  const handleRegister = async () => {
    try {
      const uploadedAvatarUrl = await uploadImage();

      // Se o upload da imagem foi bem-sucedido, continue com o registro
      const userData = {
        name,
        phone,
        address,
        avatarUrl: uploadedAvatarUrl || '', // Se não houver imagem, avatarUrl fica vazio
        email,
        password,
        role: 'user', // Sempre será 'user' no registro
      };

      // Chamada à API para registrar o usuário
      await api.post('/user', userData);
      Alert.alert('Sucesso', 'Usuário registrado com sucesso');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro no registro do usuário:', error);
      Alert.alert('Erro', 'Falha ao registrar usuário');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput style={styles.input} placeholder='Seu nome' value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder='Seu email' value={email} keyboardType='email-address' onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder='Seu telefone' value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder='Seu endereço' value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder='Senha' secureTextEntry value={password} onChangeText={setPassword} />

      {/* Seletor de imagem */}
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Selecionar Imagem de Perfil</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 20 }} />}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  imagePickerButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
  },
  registerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
