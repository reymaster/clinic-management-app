import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('auth/login', { email, password });
      console.log(response.data);
      const { access_token, user } = response.data;

      // Armazena o token localmente
      await AsyncStorage.setItem('userToken', access_token);
      await AsyncStorage.setItem('userName', user.name);
      await AsyncStorage.setItem('userId', `${user.id}`);

      console.log('Login efetuado com sucesso!', access_token, user);

      // Redireciona para o dashboard ou próxima tela
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../assets/LoginBG.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Entre com seus dados</Text>
        <TextInput style={styles.input} placeholder='Seu e-mail' value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder='Sua senha' secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>ACESSAR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpLink}>Ainda não tem uma conta? Crie sua conta.</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    marginTop: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: 20,
    color: '#007bff',
  },
  loginButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signUpLink: {
    textAlign: 'center',
    color: '#007bff',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default LoginScreen;
