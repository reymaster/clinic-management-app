import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Ação de registro
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign-up</Text>
      <TextInput style={styles.input} placeholder='Your name' value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder='Your email id' value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder='Your contact number' value={contact} onChangeText={setContact} />
      <TextInput style={styles.input} placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Sign-up</Text>
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
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
  },
  registerText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default RegisterScreen;
