import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as jwt from 'jwt-decode'; // Substituir por jwt-decode

const api = axios.create({
  baseURL: 'http://192.168.1.10:8000', // Substitua pela URL correta
  timeout: 10000,
});

// Interceptador para adicionar o token de autenticação a todas as requisições
api.interceptors.request.use(
  async (config) => {
    // Recupera o token do AsyncStorage
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      try {
        // Decodifica o token JWT e armazena o payload
        const decodedToken: any = jwt.jwtDecode(token); // jwt-decode não necessita de métodos de Node.js

        // Armazena o role no AsyncStorage
        const userRole = decodedToken.role; // Verifica a propriedade role no payload do token
        if (userRole) {
          await AsyncStorage.setItem('userRole', userRole);
        }

        // Adiciona o token no cabeçalho Authorization
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }

    return config;
  },
  (error) => {
    // Tratar erros de requisição
    return Promise.reject(error);
  }
);

export default api;
